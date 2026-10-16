import React from 'react';
import type { Level } from '../../types';
import { levelColor } from '../../utils/format';
import { useLocale } from '../../contexts/LocaleContext';

const LEVEL_TEXT: Record<Level, [string, string]> = {
  OK: ['مطلوب', 'On target'],
  WARN: ['هشدار', 'Warning'],
  CRIT: ['بحرانی', 'Critical']
};

export function LevelBadge({ level, size = 'sm', label }: {level: Level;size?: 'sm' | 'xs';label?: string;}) {
  const { tr } = useLocale();
  const color = levelColor[level];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 border font-semibold uppercase tracking-wider ${
      size === 'xs' ? 'px-1.5 py-0.5 text-2xs' : 'px-2 py-0.5 text-[11px]'}`
      }
      style={{ color, borderColor: `${color}55`, backgroundColor: `${color}14` }}>
      
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {label ?? tr(...LEVEL_TEXT[level])}
    </span>);

}

export function LevelDot({ level, pulse = false }: {level: Level;pulse?: boolean;}) {
  const color = levelColor[level];
  return (
    <span className="relative inline-flex h-2 w-2 shrink-0">
      {pulse && level !== 'OK' &&
      <span className="absolute inset-0 rounded-full animate-pulseRing" style={{ background: color }} />
      }
      <span className="relative h-2 w-2 rounded-full" style={{ background: color }} />
    </span>);

}

export function DemoBadge({ className = '' }: {className?: string;}) {
  const { tr } = useLocale();
  return (
    <span
      className={`inline-flex items-center gap-1.5 border border-signal-warn/40 bg-signal-warn/10 px-2 py-0.5 text-2xs font-semibold uppercase tracking-[0.14em] text-signal-warn ${className}`}>
      
      {tr('داده نمایشی', 'DEMO DATA')}
    </span>);

}

export function Tag({
  children,
  tone = 'slate'



}: {children: React.ReactNode;tone?: 'slate' | 'elec' | 'ok' | 'warn' | 'crit' | 'forecast';}) {
  const tones: Record<string, string> = {
    slate: 'text-slate-400 border-line',
    elec: 'text-elec-300 border-elec-400/30 bg-elec-400/10',
    ok: 'text-signal-ok border-signal-ok/30 bg-signal-ok/10',
    warn: 'text-signal-warn border-signal-warn/30 bg-signal-warn/10',
    crit: 'text-signal-crit border-signal-crit/30 bg-signal-crit/10',
    forecast: 'text-signal-forecast border-signal-forecast/30 bg-signal-forecast/10'
  };
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap border px-1.5 py-0.5 text-2xs font-medium ${tones[tone]}`}>
      {children}
    </span>);

}
