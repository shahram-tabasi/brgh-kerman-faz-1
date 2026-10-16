import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BellRingIcon,
  BookOpenIcon,
  BriefcaseIcon,
  ClipboardCheckIcon,
  CrownIcon,
  DatabaseIcon,
  FileTextIcon,
  FlaskConicalIcon,
  GitForkIcon,
  LayersIcon,
  ListChecksIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  TargetIcon,
  UsersIcon,
  WalletIcon,
  ZapIcon } from
'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';
import { alerts } from '../../data/alerts';

interface Item {
  to: string;
  fa: string;
  en: string;
  icon: React.ReactNode;
  badge?: number;
}

const openAlerts = alerts.filter((a) => a.state !== 'RESOLVED').length;

const GROUPS: {fa: string;en: string;items: Item[];}[] = [
{
  fa: 'داشبوردهای مدیریتی و عملیاتی', en: 'Management dashboards',
  items: [
  { to: '/', fa: 'مدیرعامل و مدیریت ارشد', en: 'CEO & Executive', icon: <CrownIcon size={15} /> },
  { to: '/operations', fa: 'بهره‌برداری', en: 'Operations', icon: <ZapIcon size={15} /> },
  { to: '/projects', fa: 'برنامه‌ریزی و پروژه‌ها', en: 'Planning & Projects', icon: <BriefcaseIcon size={15} /> },
  { to: '/finance', fa: 'مالی', en: 'Finance', icon: <WalletIcon size={15} /> },
  { to: '/customers', fa: 'مشترکین و خدمات', en: 'Customers & Services', icon: <UsersIcon size={15} /> }]

},
{
  fa: 'پایش و تحلیل', en: 'Monitoring & analysis',
  items: [
  { to: '/drilldown', fa: 'شکست مسئله (Drill-down)', en: 'Drill-down analysis', icon: <GitForkIcon size={15} /> },
  { to: '/alerts', fa: 'هشدار و استثناها', en: 'Alerts & exceptions', icon: <BellRingIcon size={15} />, badge: openAlerts },
  { to: '/kpi', fa: 'شناسنامه شاخص‌ها (KPI Master)', en: 'KPI Master', icon: <TargetIcon size={15} /> },
  { to: '/reports', fa: 'گزارش‌های مدیریتی', en: 'Management reports', icon: <FileTextIcon size={15} /> }]

},
{
  fa: 'داده و یکپارچه‌سازی', en: 'Data & integration',
  items: [
  { to: '/sources', fa: 'منابع و یکپارچه‌سازی', en: 'Sources & integration', icon: <DatabaseIcon size={15} /> },
  { to: '/quality', fa: 'مدیریت کیفیت داده', en: 'Data quality', icon: <ClipboardCheckIcon size={15} /> },
  { to: '/dictionary', fa: 'فرهنگ داده', en: 'Data dictionary', icon: <BookOpenIcon size={15} /> },
  { to: '/architecture', fa: 'معماری و مراحل اجرا', en: 'Architecture & roadmap', icon: <LayersIcon size={15} /> }]

},
{
  fa: 'پروژه', en: 'Project',
  items: [
  { to: '/pilot', fa: 'اجرای Pilot', en: 'Pilot', icon: <FlaskConicalIcon size={15} /> },
  { to: '/traceability', fa: 'انطباق با شرح خدمات', en: 'Scope compliance', icon: <ListChecksIcon size={15} /> }]

}];


export function Sidebar({ collapsed, onToggle }: {collapsed: boolean;onToggle: () => void;}) {
  const { tr, n } = useLocale();
  return (
    <nav
      aria-label={tr('ناوبری اصلی', 'Main navigation')}
      className={`flex shrink-0 flex-col border-e border-line bg-ink-900/95 print:hidden transition-[width] duration-200 ease-out ${
      collapsed ? 'w-[52px]' : 'w-[220px]'}`
      }>
      
      <div className="flex-1 overflow-y-auto py-2">
        {GROUPS.map((g) =>
        <div key={g.en} className="mb-1.5">
            {!collapsed &&
          <p className="px-3 pb-1 pt-2 text-2xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                {tr(g.fa, g.en)}
              </p>
          }
            <ul>
              {g.items.map((it) =>
            <li key={it.to}>
                  <NavLink
                to={it.to}
                end={it.to === '/'}
                title={collapsed ? tr(it.fa, it.en) : undefined}
                className={({ isActive }) =>
                `relative flex items-center gap-2.5 px-3 py-[7px] text-[12.5px] transition-colors duration-150 ${
                isActive ?
                'bg-elec-400/[0.09] text-elec-300 before:absolute before:inset-y-0 before:start-0 before:w-[2px] before:bg-elec-400' :
                'text-slate-400 hover:bg-slate-400/[0.06] hover:text-slate-200'}`
                }>
                
                    <span className="shrink-0">{it.icon}</span>
                    {!collapsed && <span className="truncate">{tr(it.fa, it.en)}</span>}
                    {!collapsed && it.badge ?
                <span className="ms-auto bg-signal-crit/15 px-1.5 font-mono text-2xs text-signal-crit">{n(it.badge)}</span> :
                null}
                  </NavLink>
                </li>
            )}
            </ul>
          </div>
        )}
      </div>

      {!collapsed &&
      <div className="mx-3 mb-2 flex items-center gap-2.5 border border-line bg-ink-850/70 p-2">
          <img src="/brand/baba-barghi-line.png" alt="" className="h-11 w-11 shrink-0 rounded-full bg-white object-cover" />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[11.5px] font-semibold text-slate-200">{tr('بابا برقی', 'Baba Barghi')}</p>
            <p className="text-2xs text-slate-500">
              {tr('یک تصویر، یک مرجع، یک حقیقت', 'One picture, one source of truth')}
            </p>
          </div>
        </div>
      }

      <button
        type="button"
        onClick={onToggle}
        aria-label={tr('جمع/باز کردن منو', 'Toggle sidebar')}
        className="flex items-center gap-2 border-t border-line px-3 py-2 text-2xs text-slate-500 transition-colors duration-150 hover:text-elec-300">
        
        {collapsed ? <PanelLeftOpenIcon size={14} /> : <PanelLeftCloseIcon size={14} />}
      </button>
    </nav>);

}
