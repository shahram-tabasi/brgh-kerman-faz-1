import type { TooltipProps } from 'recharts';
import { useLocale } from '../../contexts/LocaleContext';

export const AXIS_TICK = { fill: '#64748b', fontSize: 10 };
export const GRID_STROKE = 'rgba(148,163,184,0.12)';

export const PALETTE = {
  elec: '#38bdf8',
  ok: '#34d399',
  warn: '#f59e0b',
  crit: '#ef4444',
  violet: '#a78bfa',
  orange: '#f97316',
  slate: '#64748b',
  brandBlue: '#3b6fd1',
  brandOrange: '#ee7f3b'
};

/** Shared axis props; X axis is mirrored in RTL so time flows right → left. */
export function useAxes() {
  const { isFa, n } = useLocale();
  const fmt = (v: number) => n(v, Math.abs(v) < 10 && v % 1 !== 0 ? 1 : 0);
  const x = { tick: AXIS_TICK, tickLine: false, axisLine: { stroke: GRID_STROKE }, reversed: isFa };
  return {
    x,
    /** numeric X axis (horizontal bar / scatter charts) with locale digits */
    xn: { ...x, tickFormatter: fmt },
    y: {
      tick: AXIS_TICK,
      tickLine: false,
      axisLine: false,
      width: 44,
      orientation: (isFa ? 'right' : 'left') as 'right' | 'left',
      tickFormatter: fmt
    }
  };
}

export function ChartTooltip({ active, payload, label, unit }: TooltipProps<number, string> & {unit?: string;}) {
  const { n } = useLocale();
  if (!active || !payload?.length) return null;
  return (
    <div className="border border-line-strong bg-ink-900/95 px-2.5 py-1.5 text-[11px] shadow-xl">
      {label !== undefined && <p className="mb-1 text-slate-400">{label}</p>}
      {payload.map((p) =>
      <p key={String(p.dataKey)} className="flex items-center gap-2">
          <span className="h-2 w-2" style={{ background: p.color }} />
          <span className="text-slate-400">{p.name}</span>
          <span className="ms-auto font-mono text-slate-100">
            {typeof p.value === 'number' ? n(p.value, Math.abs(p.value) < 10 && p.value % 1 !== 0 ? 2 : 0) : p.value}
            {unit ? ` ${unit}` : ''}
          </span>
        </p>
      )}
    </div>);

}

export function Legend({ items }: {items: {label: string;color: string;dashed?: boolean;}[];}) {
  return (
    <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-2xs text-slate-500">
      {items.map((i) =>
      <span key={i.label} className="flex items-center gap-1.5">
          <span
          className="inline-block h-[2px] w-3"
          style={{ background: i.dashed ? 'transparent' : i.color, borderTop: i.dashed ? `2px dashed ${i.color}` : undefined }} />
        
          {i.label}
        </span>
      )}
    </div>);

}
