import React from 'react';

interface PanelProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  accent?: 'none' | 'elec' | 'warn' | 'crit';
}

const accentMap: Record<string, string> = {
  none: '',
  elec: 'before:bg-elec-400',
  warn: 'before:bg-signal-warn',
  crit: 'before:bg-signal-crit'
};

export function Panel({
  title,
  subtitle,
  icon,
  actions,
  children,
  className = '',
  bodyClassName = '',
  accent = 'none'
}: PanelProps) {
  return (
    <section
      className={`relative flex min-w-0 flex-col border border-line bg-ink-850/80 ${
      accent !== 'none' ?
      `before:absolute before:inset-y-0 before:start-0 before:w-px ${accentMap[accent]}` :
      ''} ${
      className}`}>
      
      {(title || actions) &&
      <header className="flex items-center gap-3 border-b border-line px-3 py-2">
          {icon && <span className="text-elec-400">{icon}</span>}
          <div className="min-w-0 flex-1">
            {title &&
          <h2 className="truncate text-[13px] font-semibold tracking-wide text-slate-100">
                {title}
              </h2>
          }
            {subtitle &&
          <p className="truncate text-2xs text-slate-500">{subtitle}</p>
          }
          </div>
          {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
        </header>
      }
      <div className={`min-h-0 flex-1 ${bodyClassName || 'p-3'}`}>{children}</div>
    </section>);

}