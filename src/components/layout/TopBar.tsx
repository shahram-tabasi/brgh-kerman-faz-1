import React from 'react';
import { Link } from 'react-router-dom';
import { BellIcon, CircleCheckIcon, DatabaseIcon, ShieldCheckIcon, UserIcon } from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';
import { useLiveClock } from '../../hooks/useLiveClock';
import { fmtDate, fmtTime } from '../../utils/format';
import { alerts } from '../../data/alerts';
import { overallQuality } from '../../data/sources';

export function TopBar() {
  const { tr, lang, setLang, n } = useLocale();
  const now = useLiveClock();
  const openCritical = alerts.filter((a) => a.state !== 'RESOLVED' && a.level === 'CRIT').length;

  return (
    <header className="relative z-20 shrink-0 border-b border-line bg-ink-900/95 print:hidden">
      <div className="flex items-center gap-4 px-4 py-2">
        {/* identity */}
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <img
            src="/brand/company-logo.png"
            alt={tr('نشان توزیع برق', 'Distribution company emblem')}
            className="h-9 w-9 shrink-0 rounded-full ring-1 ring-white/10" />
          
          <span className="hidden min-w-0 flex-col leading-tight sm:flex">
            <span className="truncate text-[12px] font-semibold text-slate-200">
              {tr('شرکت توزیع نیروی برق جنوب کرمان', 'South Kerman Electricity Distribution Co.')}
            </span>
            <span className="truncate text-2xs text-slate-500">{tr('نمایشی / داده مصنوعی', 'DEMO / SYNTHETIC')}</span>
          </span>
        </Link>

        {/* title */}
        <div className="min-w-0 flex-1 text-center">
          <h1 className="truncate text-[15px] font-bold tracking-wide text-slate-50">
            {tr('پلتفرم یکپارچه اطلاعات مدیریتی و عملیاتی', 'Integrated Management & Operational Information Platform')}
          </h1>
          <p className="truncate text-[11px] text-slate-500">
            {tr(
              'یکپارچه‌سازی، تجمیع و کیفیت داده سامانه‌ها — شاخص‌ها، داشبوردها و هشدارهای مدیریتی',
              'Integration, aggregation & data quality across systems — KPIs, dashboards and management alerts'
            )}
          </p>
        </div>

        {/* status cluster */}
        <div className="hidden items-center gap-3 lg:flex">
          <StatusPill icon={<CircleCheckIcon size={12} />} label={tr('لایه یکپارچه', 'Unified layer')} value={tr('برخط', 'ONLINE')} tone="ok" />
          <StatusPill icon={<DatabaseIcon size={12} />} label={tr('کیفیت داده', 'Data quality')} value={`${n(overallQuality, 1)}`} tone="warn" />
          <StatusPill icon={<ShieldCheckIcon size={12} />} label={tr('دسترسی', 'Access')} value={tr('مبتنی بر نقش', 'RBAC')} tone="elec" />
          <div className="flex flex-col items-end leading-tight">
            <span className="font-mono text-[12px] tabular-nums text-slate-200">{fmtTime(now, lang)}</span>
            <span className="text-2xs text-slate-500">{fmtDate(now, lang)}</span>
          </div>
        </div>

        {/* actions */}
        <div className="flex shrink-0 items-center gap-1.5">
          <Link
            to="/alerts"
            className="relative grid h-7 w-7 place-items-center border border-line text-slate-400 transition-colors duration-150 hover:border-elec-400/40 hover:text-elec-300"
            aria-label={tr('هشدارها', 'Alerts')}>
            
            <BellIcon size={13} />
            {openCritical > 0 &&
            <span className="absolute -end-1.5 -top-1.5 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-signal-crit px-0.5 font-mono text-[9px] font-bold text-white">
                {n(openCritical)}
              </span>
            }
          </Link>
          <button
            type="button"
            className="grid h-7 w-7 place-items-center border border-line text-slate-400 transition-colors duration-150 hover:border-elec-400/40 hover:text-elec-300"
            aria-label={tr('کاربر', 'User')}>
            
            <UserIcon size={13} />
          </button>
          <div className="flex overflow-hidden border border-line" role="group" aria-label="Language">
            {(['fa', 'en'] as const).map((l) =>
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={`px-2 py-1 font-mono text-[11px] font-semibold uppercase transition-colors duration-150 ${
              lang === l ? 'bg-elec-400/15 text-elec-300' : 'text-slate-500 hover:text-slate-300'}`
              }>
              
                {l}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="brand-band h-[2px] w-full opacity-80" />
    </header>);

}

function StatusPill({
  icon,
  label,
  value,
  tone





}: {icon: React.ReactNode;label: string;value: string;tone: 'ok' | 'warn' | 'elec';}) {
  const tones = {
    ok: 'text-signal-ok',
    warn: 'text-signal-warn',
    elec: 'text-elec-300'
  };
  return (
    <div className="flex flex-col leading-tight">
      <span className="text-2xs uppercase tracking-[0.12em] text-slate-600">{label}</span>
      <span className={`flex items-center gap-1 text-[11px] font-semibold ${tones[tone]}`}>
        {icon}
        {value}
      </span>
    </div>);

}
