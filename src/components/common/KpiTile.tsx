import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkline } from './Sparkline';
import { Gauge } from './Gauge';
import type { Kpi, Level } from '../../types';
import { levelColor } from '../../utils/format';
import { kpiLevel } from '../../data/kpis';
import { useLocale } from '../../contexts/LocaleContext';

interface KpiTileProps {
  label: string;
  value: string;
  unit?: string;
  trend?: number[];
  tone?: 'neutral' | 'ok' | 'warn' | 'crit' | 'elec' | 'forecast';
  level?: Level;
  gauge?: number;
  foot?: React.ReactNode;
  to?: string;
  title?: string;
}

const toneColor: Record<string, string> = {
  neutral: '#e2e8f0',
  ok: '#34d399',
  warn: '#f59e0b',
  crit: '#ef4444',
  elec: '#38bdf8',
  forecast: '#a78bfa'
};

export function KpiTile({ label, value, unit, trend, tone = 'neutral', level, gauge, foot, to, title }: KpiTileProps) {
  const navigate = useNavigate();
  const color = level ? levelColor[level] : toneColor[tone];
  const clickable = Boolean(to);
  return (
    <div
      title={title}
      role={clickable ? 'link' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={clickable ? () => navigate(to!) : undefined}
      onKeyDown={clickable ? (e) => {if (e.key === 'Enter') navigate(to!);} : undefined}
      className={`relative flex min-w-0 flex-col justify-between border border-line bg-ink-850/70 px-3 py-2 ${
      clickable ? 'cursor-pointer transition-colors duration-150 hover:border-elec-400/40 focus:outline-none focus-visible:border-elec-400/60' : ''}`}>
      
      {level &&
      <span className="absolute inset-x-0 top-0 h-[2px]" style={{ background: color, opacity: 0.8 }} />
      }
      <p className="truncate text-2xs uppercase tracking-[0.1em] text-slate-500">{label}</p>
      <div className="mt-1.5 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <span className="block truncate font-mono text-xl font-semibold tabular-nums" style={{ color }}>
            {value}
          </span>
          {unit && <span className="text-2xs text-slate-500">{unit}</span>}
        </div>
        {gauge !== undefined ?
        <Gauge value={gauge} size={38} thickness={4} color={color} /> :
        trend ?
        <div className="w-16 shrink-0">
            <Sparkline values={trend} color={color} height={20} fill />
          </div> :
        null}
      </div>
      {foot && <div className="mt-1 truncate text-2xs text-slate-500">{foot}</div>}
    </div>);

}

/** Tile bound to a KPI Master entry: colour, target and drill target come from the KPI definition. */
export function KpiMasterTile({ kpi, to }: {kpi: Kpi;to?: string;}) {
  const { tx, n, tr } = useLocale();
  const d = kpi.digits ?? 1;
  return (
    <KpiTile
      label={tx(kpi.name)}
      value={n(kpi.value, d)}
      unit={tx(kpi.unit)}
      trend={kpi.trend}
      level={kpiLevel(kpi)}
      to={to ?? `/kpi?id=${kpi.id}`}
      title={`${kpi.id} · ${kpi.formula}`}
      foot={
      <>
          {tr('هدف', 'Target')}: <span className="font-mono text-slate-400">{n(kpi.target, d)}</span>
        </>
      } />);


}
