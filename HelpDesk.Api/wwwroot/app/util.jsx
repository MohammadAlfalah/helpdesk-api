/* Small helpers shared across the agent console screens. */

// Lucide icon as a React element. Re-runs createIcons after each render.
function Icon({ name, size = 18, color = 'currentColor', strokeWidth = 1.75, style }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (window.lucide && ref.current) {
      ref.current.innerHTML = '';
      const el = document.createElement('i');
      el.setAttribute('data-lucide', name);
      ref.current.appendChild(el);
      window.lucide.createIcons({ attrs: { width: size, height: size, 'stroke-width': strokeWidth }, nameAttr: 'data-lucide' });
    }
  });
  return React.createElement('span', {
    ref,
    style: { display: 'inline-flex', color, width: size, height: size, ...style },
  });
}

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

Object.assign(window, { Icon, timeAgo });
