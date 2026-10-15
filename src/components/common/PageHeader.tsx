import React from 'react';
import { DemoBadge } from './Badge';
import { useLocale } from '../../contexts/LocaleContext';
import { toFaDigits } from '../../utils/format';

export function PageHeader({
  title,
  subtitle,
  section,
  actions





}: {title: string;subtitle?: string;section?: string;actions?: React.ReactNode;}) {
  const { isFa } = useLocale();
  return (
    <header className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-2.5">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          {section &&
          <span className="hex-mark grid h-6 min-w-7 place-items-center bg-elec-400/15 px-1.5 font-mono text-2xs font-bold text-elec-300">
              {isFa ? toFaDigits(section) : section}
            </span>
          }
          <h1 className="truncate text-base font-semibold tracking-wide text-slate-50">{title}</h1>
          <DemoBadge />
        </div>
        {subtitle && <p className="mt-0.5 text-[11px] text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>);

}
