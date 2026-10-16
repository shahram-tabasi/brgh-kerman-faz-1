
interface SparklineProps {
  values: number[];
  color?: string;
  height?: number;
  className?: string;
  fill?: boolean;
}

export function Sparkline({
  values,
  color = '#38bdf8',
  height = 22,
  className = '',
  fill = false
}: SparklineProps) {
  if (values.length < 2) return null;
  const w = 100;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => {
    const x = i / (values.length - 1) * w;
    const y = height - (v - min) / span * (height - 3) - 1.5;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  return (
    <svg
      viewBox={`0 0 ${w} ${height}`}
      preserveAspectRatio="none"
      className={`w-full ${className}`}
      style={{ height }}
      aria-hidden="true">
      
      {fill &&
      <polygon
        points={`0,${height} ${pts.join(' ')} ${w},${height}`}
        fill={color}
        opacity="0.14" />

      }
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke" />
      
    </svg>);

}