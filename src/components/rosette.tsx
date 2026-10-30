// Eight-point girih rosette. Every ring has pathLength=1 so motion can draw
// it with a single dash offset regardless of its real length.
const star = Array.from({ length: 16 }, (_, i) => {
  const r = i % 2 ? 31 : 48;
  const a = (Math.PI / 8) * i - Math.PI / 2;
  return `${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`;
}).join(" ");

export function Rosette({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="0.2">
        <polygon pathLength={1} points={star} />
        <rect pathLength={1} x="22" y="22" width="56" height="56" />
        <rect
          pathLength={1}
          x="22"
          y="22"
          width="56"
          height="56"
          transform="rotate(45 50 50)"
        />
        <circle pathLength={1} cx="50" cy="50" r="17" />
        <circle pathLength={1} cx="50" cy="50" r="49.6" />
      </g>
    </svg>
  );
}
