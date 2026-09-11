import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { filesApi, providerApi } from '../lib/api';
import { formatBytes, formatDate, fileExtensionIcon } from '../lib/format';
import AppTopbar from '../components/AppTopbar';
import '../styles/theme.css';
import '../styles/app.css';

const QUOTA_BYTES = 5 * 1024 * 1024 * 1024; // 5 GB soft quota shown for the progress bar

function fileTypeLabel(contentType) {
  if (!contentType) return 'File';
  const parts = contentType.split('/');
  return (parts[1] || parts[0]).toUpperCase();
}

export default function Dashboard() {
  const { user, refreshUser } = useAuth();

  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [toast, setToast] = useState(null); // { type, message }
  const [becomingProvider, setBecomingProvider] = useState(false);

  const fileInputRef = useRef(null);

  const loadFiles = async () => {
    setLoadingFiles(true);
    try {
      const data = await filesApi.list();
      setFiles(data.files || []);
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setLoadingFiles(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleFiles = async (fileList) => {
    const file = fileList?.[0];
    if (!file) return;

    setUploading(true);
    setToast(null);
    try {
      await filesApi.upload(file);
      setToast({ type: 'success', message: `"${file.name}" uploaded and encrypted successfully.` });
      await loadFiles();
      await refreshUser();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDelete = async (fileId, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await filesApi.delete(fileId);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      setToast({ type: 'success', message: `"${name}" deleted.` });
      await refreshUser();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  };

  const triggerBlobAction = async (fetcher, filename, mode) => {
    try {
      const blob = await fetcher();
      const url = window.URL.createObjectURL(blob);
      if (mode === 'download') {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        window.open(url, '_blank');
      }
      setTimeout(() => window.URL.revokeObjectURL(url), 30000);
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  };

  const handleBecomeProvider = async () => {
    setBecomingProvider(true);
    try {
      await providerApi.becomeProvider();
      await refreshUser();
      setToast({ type: 'success', message: 'You are now a storage provider. Set up your node from the Provider tab.' });
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setBecomingProvider(false);
    }
  };

  const storageUsed = user?.storage_used ?? 0;
  const usedPct = Math.min(100, (storageUsed / QUOTA_BYTES) * 100);
  const progressClass = usedPct > 90 ? 'full' : usedPct > 70 ? 'warn' : '';
  const isProvider = user?.role === 'provider';

  return (
    <div className="app-shell">
      <div className="grain-overlay" aria-hidden="true" />
      <AppTopbar />

      <div className="app-content">
        <div className="app-page-header">
          <h1 className="app-page-title">Your files</h1>
          <p className="app-page-sub">
            Every file is AES-256-GCM encrypted before it leaves your device and is sharded across the IPFS network.
          </p>
        </div>

        {toast && (
          <div className={`inline-toast ${toast.type}`}>
            <span>{toast.message}</span>
            <button className="inline-toast-close" onClick={() => setToast(null)} aria-label="Dismiss">×</button>
          </div>
        )}

        {/* Summary cards */}
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-card-label">Storage used</div>
            <div className="stat-card-value">{formatBytes(storageUsed)}</div>
            <div className="progress-track" style={{ marginTop: 12 }}>
              <div className={`progress-fill ${progressClass}`} style={{ width: `${usedPct}%` }} />
            </div>
            <div className="progress-caption">
              <span>{usedPct.toFixed(1)}% used</span>
              <span>of {formatBytes(QUOTA_BYTES)}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Files stored</div>
            <div className="stat-card-value">{files.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Network</div>
            <div className="stat-card-value" style={{ fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge-dot success"><span className="dot" />IPFS enabled</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Account</div>
            <div className="stat-card-value" style={{ textTransform: 'capitalize', fontSize: 18 }}>
              {user?.role || '—'}
            </div>
            {isProvider && (
              <div style={{ marginTop: 10, fontSize: 12.5, color: 'var(--text-2)', display: 'grid', gap: 4 }}>
                <span>Contributed: <strong style={{ color: 'var(--text-1)' }}>{formatBytes(user?.storage_contributed)}</strong></span>
                <span>Reputation: <strong style={{ color: 'var(--text-1)' }}>{user?.reputation ?? '—'}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Upload + How it works */}
        <div className="panels-2col">
          <div className="panel">
            <h2 className="panel-title">Upload a file</h2>
            <div
              className={`upload-dropzone ${dragging ? 'dragging' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
            >
              <div className="upload-icon">{uploading ? '⏳' : '⬆️'}</div>
              <div>
                {uploading ? 'Encrypting and uploading…' : (
                  <>Drag & drop a file here, or <strong style={{ color: 'var(--accent)' }}>browse</strong></>
                )}
              </div>
              <div className="upload-hint">Files are encrypted client-side before being shared with any provider node.</div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={(e) => handleFiles(e.target.files)}
                disabled={uploading}
              />
            </div>
          </div>

          <div className="panel">
            <h2 className="panel-title">How it works</h2>
            <div className="info-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div className="info-card">
                <div className="info-card-icon">🔐</div>
                <div>
                  <p className="info-card-title">Encrypted before upload</p>
                  <p className="info-card-text">Your file is encrypted on your device, then sent to a provider node running IPFS, which returns a unique content identifier (CID).</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-icon">🧩</div>
                <div>
                  <p className="info-card-title">CID-based storage</p>
                  <p className="info-card-text">Every file gets a content address — the same file always produces the same CID, the core idea behind content-addressed decentralized storage.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Become a provider CTA */}
        {!isProvider && (
          <div className="cta-banner">
            <div>
              <p className="cta-banner-title">🚀 Become a storage provider</p>
              <p className="cta-banner-text">Have unused storage on your machine? Contribute it to the decentralized network and earn reputation for every file you host.</p>
            </div>
            <button className="primary-btn" onClick={handleBecomeProvider} disabled={becomingProvider}>
              {becomingProvider ? 'Upgrading…' : 'Become a provider'}
            </button>
          </div>
        )}

        {/* Files table */}
        <div className="panel">
          <div className="section-heading">
            <div>
              <h2 className="panel-title">Stored files</h2>
              <p className="panel-sub">Files you've uploaded, encrypted, and pinned across the network.</p>
            </div>
            <span className="badge-dot neutral">{files.length} files</span>
          </div>

          {loadingFiles ? (
            <div className="empty-state">Loading files…</div>
          ) : files.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🗂️</div>
              <div>No files uploaded yet. Upload your first file above.</div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="file-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Size</th>
                    <th>Node</th>
                    <th>Uploaded</th>
                    <th>CID</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((f) => (
                    <tr key={f.id}>
                      <td>
                        <div className="file-name-cell">
                          <div className="file-icon">{fileExtensionIcon(f.original_filename)}</div>
                          <div>
                            <div>{f.original_filename}</div>
                            <span className="type-chip">{fileTypeLabel(f.content_type)}</span>
                          </div>
                        </div>
                      </td>
                      <td>{f.file_size_mb ? `${f.file_size_mb} MB` : formatBytes(f.file_size)}</td>
                      <td>{f.provider_node_name || '—'}</td>
                      <td>{formatDate(f.uploaded_at)}</td>
                      <td className="file-cid" title={f.cid}>
                        {f.cid ? `${f.cid.slice(0, 10)}…` : '—'}
                      </td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="icon-btn"
                            title="View"
                            onClick={() => triggerBlobAction(() => filesApi.viewBlob(f.id), f.original_filename, 'view')}
                          >
                            👁️
                          </button>
                          <button
                            className="icon-btn"
                            title="Download"
                            onClick={() => triggerBlobAction(() => filesApi.downloadBlob(f.id), f.original_filename, 'download')}
                          >
                            ⬇️
                          </button>
                          <button
                            className="icon-btn danger"
                            title="Delete"
                            onClick={() => handleDelete(f.id, f.original_filename)}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
