import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { providerApi, networkApi } from '../lib/api';
import { formatBytes, formatDate } from '../lib/format';
import AppTopbar from '../components/AppTopbar';
import '../styles/theme.css';
import '../styles/app.css';

export default function ProviderDashboard() {
  const { user, refreshUser } = useAuth();

  const [node, setNode] = useState(null);
  const [networkStats, setNetworkStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [becomingProvider, setBecomingProvider] = useState(false);

  const [form, setForm] = useState({ display_name: '', allocated_storage_gb: '' });
  const [registering, setRegistering] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [statsRes] = await Promise.allSettled([networkApi.stats()]);
      if (statsRes.status === 'fulfilled') setNetworkStats(statsRes.value.stats);

      if (user?.role === 'provider') {
        try {
          const nodeRes = await providerApi.getNode();
          setNode(nodeRes.node);
        } catch {
          setNode(null);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  const handleBecomeProvider = async () => {
    setBecomingProvider(true);
    try {
      await providerApi.becomeProvider();
      await refreshUser();
      setToast({ type: 'success', message: 'Upgraded to storage provider. Register your node below.' });
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setBecomingProvider(false);
    }
  };

  const handleRegisterNode = async (e) => {
    e.preventDefault();
    setToast(null);

    if (!form.display_name || !form.allocated_storage_gb) {
      setToast({ type: 'error', message: 'Please fill in both fields.' });
      return;
    }

    setRegistering(true);
    try {
      const data = await providerApi.registerNode(form.display_name, form.allocated_storage_gb);
      setNode(data.node);
      setToast({ type: 'success', message: data.message });
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setRegistering(false);
    }
  };

  const isProvider = user?.role === 'provider';
  const usedPct = node ? Math.min(100, (Number(node.storage_used_gb || 0) / Number(node.total_storage_gb || 1)) * 100) : 0;
  const progressClass = usedPct > 90 ? 'full' : usedPct > 70 ? 'warn' : '';

  return (
    <div className="app-shell">
      <div className="grain-overlay" aria-hidden="true" />
      <AppTopbar />

      <div className="app-content">
        <div className="app-page-header">
          <h1 className="app-page-title">Provider node</h1>
          <p className="app-page-sub">
            Register your machine as a storage node and earn from contributing spare capacity to the network.
          </p>
        </div>

        {toast && (
          <div className={`inline-toast ${toast.type}`}>
            <span>{toast.message}</span>
            <button className="inline-toast-close" onClick={() => setToast(null)} aria-label="Dismiss">×</button>
          </div>
        )}

        {networkStats && (
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-card-label">Network nodes</div>
              <div className="stat-card-value">{networkStats.total_nodes}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-label">Online now</div>
              <div className="stat-card-value">{networkStats.online_nodes}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-label">Total files stored</div>
              <div className="stat-card-value">{networkStats.total_files}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-label">Network storage used</div>
              <div className="stat-card-value">{networkStats.total_storage_used_mb} MB</div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="panel"><div className="empty-state">Loading node status…</div></div>
        ) : !isProvider ? (
          <div className="panel" style={{ textAlign: 'center' }}>
            <h2 className="panel-title">You're currently a storage user</h2>
            <p className="app-page-sub" style={{ marginBottom: 18 }}>
              Upgrade to a provider account to register a node and start earning from spare storage.
            </p>
            <button className="primary-btn" onClick={handleBecomeProvider} disabled={becomingProvider}>
              {becomingProvider ? 'Upgrading…' : 'Become a provider'}
            </button>
          </div>
        ) : node ? (
          <>
            {/* Status + storage overview */}
            <div className="panel">
              <div className="section-heading">
                <h2 className="panel-title">Node overview</h2>
                <span className={`badge-dot ${node.online ? 'success' : 'danger'}`}>
                  <span className="dot" />{node.online ? 'Online' : 'Offline'}
                </span>
              </div>

              <div className="stat-grid">
                <div className="stat-card">
                  <div className="stat-card-label">IPFS status</div>
                  <div className="stat-card-value" style={{ fontSize: 18 }}>
                    <span className={`badge-dot ${node.ipfs_status ? 'success' : 'danger'}`}>
                      <span className="dot" />{node.ipfs_status ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-label">Allocated</div>
                  <div className="stat-card-value">{node.allocated_storage_gb} GB</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-label">Used</div>
                  <div className="stat-card-value">{node.storage_used_display || formatBytes(node.storage_used)}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-label">Available</div>
                  <div className="stat-card-value">{node.available_storage_gb} GB</div>
                </div>
              </div>

              <div style={{ marginTop: 20 }}>
                <div className="progress-track">
                  <div className={`progress-fill ${progressClass}`} style={{ width: `${usedPct}%` }} />
                </div>
                <div className="progress-caption">
                  <span>{usedPct.toFixed(1)}% of allocated storage used</span>
                  <span>{node.storage_used_gb ?? '0'} GB / {node.total_storage_gb ?? node.allocated_storage_gb} GB</span>
                </div>
              </div>

              {!node.agent_api_url && (
                <div className="auth-error-banner" style={{ marginTop: 20 }}>
                  This node hasn't connected a node agent yet. Run the Shardize node agent on this machine and point it at your account to start receiving files and heartbeats.
                </div>
              )}
            </div>

            {/* Node info + IPFS info */}
            <div className="panels-2col">
              <div className="panel">
                <h2 className="panel-title">Storage node information</h2>
                <div className="kv-grid">
                  <div className="kv-row">
                    <span className="kv-label">Display name</span>
                    <span className="kv-value">{node.display_name}</span>
                  </div>
                  <div className="kv-row">
                    <span className="kv-label">Node UUID</span>
                    <span className="kv-value mono">{node.node_uuid}</span>
                  </div>
                  <div className="kv-row">
                    <span className="kv-label">Operating system</span>
                    <span className="kv-value">{node.operating_system || 'Not available'}</span>
                  </div>
                  <div className="kv-row">
                    <span className="kv-label">Agent version</span>
                    <span className="kv-value">{node.agent_version || 'Not available'}</span>
                  </div>
                  <div className="kv-row">
                    <span className="kv-label">Last heartbeat</span>
                    <span className="kv-value">{node.last_heartbeat ? formatDate(node.last_heartbeat) : 'Not received yet'}</span>
                  </div>
                  <div className="kv-row">
                    <span className="kv-label">Registered</span>
                    <span className="kv-value">{formatDate(node.created_at)}</span>
                  </div>
                </div>
              </div>

              <div className="panel">
                <h2 className="panel-title">IPFS node information</h2>
                <div className="kv-grid">
                  <div className="kv-row">
                    <span className="kv-label">Status</span>
                    <span className="kv-value">
                      <span className={`badge-dot ${node.ipfs_status ? 'success' : 'danger'}`}>
                        <span className="dot" />{node.ipfs_status ? 'Connected' : 'Disconnected'}
                      </span>
                    </span>
                  </div>
                  <div className="kv-row">
                    <span className="kv-label">Peer ID</span>
                    <span className="kv-value mono">{node.ipfs_peer_id || 'Not available'}</span>
                  </div>
                  <div className="kv-row">
                    <span className="kv-label">Version</span>
                    <span className="kv-value">{node.ipfs_version || 'Not available'}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="panel">
            <h2 className="panel-title">Register your storage node</h2>
            <form onSubmit={handleRegisterNode}>
              <div className="field-row">
                <label className="auth-field-label" htmlFor="display_name">Node display name</label>
                <input
                  id="display_name"
                  className="auth-input"
                  placeholder="e.g. Home Server Mumbai"
                  value={form.display_name}
                  onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))}
                />
              </div>
              <div className="field-row">
                <label className="auth-field-label" htmlFor="allocated_storage_gb">Allocated storage (GB)</label>
                <input
                  id="allocated_storage_gb"
                  type="number"
                  min="1"
                  step="0.1"
                  className="auth-input"
                  placeholder="e.g. 50"
                  value={form.allocated_storage_gb}
                  onChange={(e) => setForm((f) => ({ ...f, allocated_storage_gb: e.target.value }))}
                />
              </div>
              <button type="submit" className="auth-submit-button" style={{ width: '100%' }} disabled={registering}>
                {registering ? 'Registering…' : 'Register node'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
