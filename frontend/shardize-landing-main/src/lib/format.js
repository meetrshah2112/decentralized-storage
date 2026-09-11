export function formatBytes(bytes) {
  if (bytes === undefined || bytes === null || isNaN(bytes)) return '—';
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / Math.pow(1024, exponent);

  return `${value.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return dateStr;
  }
}

export function fileExtensionIcon(filename = '') {
  const ext = filename.split('.').pop().toLowerCase();
  const map = {
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    txt: '📄',
    png: '🖼️',
    jpg: '🖼️',
    jpeg: '🖼️',
    gif: '🖼️',
    zip: '🗜️',
    rar: '🗜️',
    mp4: '🎞️',
    mp3: '🎵',
    csv: '📊',
    xlsx: '📊',
    json: '🧾',
  };
  return map[ext] || '📦';
}
