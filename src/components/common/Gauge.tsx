import React from 'react';

interface GaugeProps {
  value: number;
  max?: number;
  size?: number;
  thickness?: number;
  color?: string;
  track?: string;
  label?: React.ReactNode;
  sublabel?: React.ReactNode;
}

export function Gauge({
  value,
  max = 100,
  size = 96,
  thickness = 7,
  color = '#38bdf8',
  track = 'rgba(148,163,184,0.16)',
  label,
  sublabel
}: GaugeProps) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value / max));
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={thickness} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 260ms cubic-bezier(0.23,1,0.32,1)' }} />
        
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        {label}
        {sublabel}
      </div>
    </div>);

}

export function Meter({
  value,
  max = 100,
  color = '#38bdf8',
  height = 4





}: {value: number;max?: number;color?: string;height?: number;}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  return (
    <div className="w-full bg-slate-500/15" style={{ height }} aria-hidden="true">
      <div
        className="h-full"
        style={{
          width: `${pct}%`,
          background: color,
          transition: 'width 240ms cubic-bezier(0.23,1,0.32,1)'
        }} />
      
    </div>);

}