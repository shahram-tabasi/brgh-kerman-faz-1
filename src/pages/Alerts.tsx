import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BellRingIcon, CheckIcon, EyeIcon, ScaleIcon } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Panel } from '../components/common/Panel';
import { KpiTile } from '../components/common/KpiTile';
import { LevelBadge, LevelDot, Tag } from '../components/common/Badge';
import { Segmented } from '../components/common/Segmented';
import { useLocale } from '../contexts/LocaleContext';
import { alerts, categoryLabel } from '../data/alerts';
import type { AlertCategory, AlertState } from '../data/alerts';
import { regionById } from '../data/regions';

const STATE_LABEL: Record<AlertState, [string, string]> = {
  NEW: ['جدید', 'New'],
  ACK: ['بررسی‌شده', 'Acknowledged'],
  RESOLVED: ['رفع‌شده', 'Resolved']
};

export function Alerts() {
  const { tr, tx, n } = useLocale();
  const [states, setStates] = useState<Record<string, AlertState>>(() => Object.fromEntries(alerts.map((a) => [a.id, a.state])));
  const [level, setLevel] = useState<'ALL' | 'CRIT' | 'WARN'>('ALL');
  const [cat, setCat] = useState<'ALL' | AlertCategory>('ALL');
  const [show, setShow] = useState<'OPEN' | 'ALL'>('OPEN');

  const rows = useMemo(
    () => alerts.filter((a) =>
    (level === 'ALL' || a.level === level) && (
    cat === 'ALL' || a.category === cat) && (
    show === 'ALL' || states[a.id] !== 'RESOLVED')
    ),
    [level, cat, show, states]
  );

  const open = alerts.filter((a) => states[a.id] !== 'RESOLVED');
  const cats = Object.keys(categoryLabel) as AlertCategory[];

  return (
    <>
      <PageHeader
        section="12"
        title={tr('سیستم هشدار و مدیریت استثناها', 'Alert & exception management')}
        subtitle={tr(
          'علاوه بر گزارش وضعیت، موارد غیرعادی شناسایی و به مدیر مسئول اعلام می‌شود — همه هشدارها بر پایه قواعد صریح و حدود شناسنامه شاخص‌ها',
          'Beyond status reporting, anomalies are detected and routed to the accountable manager — every alert comes from an explicit rule and KPI Master thresholds'
        )} />
      

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <KpiTile label={tr('هشدارهای باز', 'Open alerts')} value={n(open.length)} tone="warn" />
        <KpiTile label={tr('بحرانی', 'Critical')} value={n(open.filter((a) => a.level === 'CRIT').length)} tone="crit" />
        <KpiTile label={tr('جدید (بررسی‌نشده)', 'New (unacknowledged)')} value={n(alerts.filter((a) => states[a.id] === 'NEW').length)} tone="elec" />
        <KpiTile label={tr('رفع‌شده در این نشست', 'Resolved this session')} value={n(alerts.filter((a) => states[a.id] === 'RESOLVED').length)} tone="ok" />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-9">
        {cats.map((c) => {
          const list = open.filter((a) => a.category === c);
          const crit = list.some((a) => a.level === 'CRIT');
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCat(cat === c ? 'ALL' : c)}
              aria-pressed={cat === c}
              className={`flex flex-col items-start border px-2.5 py-2 text-start transition-colors duration-150 ${
              cat === c ? 'border-elec-400/50 bg-elec-400/10' : 'border-line bg-ink-850/70 hover:border-elec-400/30'}`
              }>
              
              <span className={`font-mono text-lg font-bold ${list.length ? crit ? 'text-signal-crit' : 'text-signal-warn' : 'text-slate-600'}`}>{n(list.length)}</span>
              <span className="text-2xs leading-tight text-slate-400">{tx(categoryLabel[c])}</span>
            </button>);

        })}
      </div>

      <Panel
        title={tr('صف هشدارها', 'Alert queue')}
        icon={<BellRingIcon size={14} />}
        accent="crit"
        bodyClassName="p-0"
        actions={
        <div className="flex flex-wrap gap-2">
            <Segmented label={tr('شدت', 'Severity')} value={level} onChange={setLevel} options={[{ value: 'ALL', label: tr('همه', 'All') }, { value: 'CRIT', label: tr('بحرانی', 'Critical') }, { value: 'WARN', label: tr('هشدار', 'Warning') }]} />
            <Segmented label={tr('وضعیت', 'State')} value={show} onChange={setShow} options={[{ value: 'OPEN', label: tr('باز', 'Open') }, { value: 'ALL', label: tr('همه', 'All') }]} />
          </div>
        }>
        
        <ul>
          {rows.map((a) => {
            const st = states[a.id];
            return (
              <li key={a.id} className={`flex flex-wrap items-start gap-3 border-b border-line/60 px-3 py-2.5 ${st === 'RESOLVED' ? 'opacity-50' : ''}`}>
                <span className="mt-1.5"><LevelDot level={a.level} pulse={st === 'NEW'} /></span>
                <div className="min-w-[240px] flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-2xs text-slate-500">{a.id}</span>
                    <Link to={a.link} className="text-[13px] text-slate-100 transition-colors duration-150 hover:text-elec-300">{tx(a.title)}</Link>
                    <LevelBadge level={a.level} size="xs" />
                    <Tag tone="slate">{tx(categoryLabel[a.category])}</Tag>
                  </div>
                  <p className="mt-0.5 text-[12px] text-slate-400">{tx(a.detail)}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-2xs text-slate-500">
                    <span className="flex items-center gap-1"><ScaleIcon size={11} /><span className="font-mono text-slate-400" dir="ltr">{a.rule}</span></span>
                    {a.regionId && <span>{tx(regionById(a.regionId).name)}</span>}
                    <span>{tr('مسئول', 'Owner')}: {tx(a.owner)}</span>
                    <span>{tx(a.time)}</span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <Tag tone={st === 'NEW' ? 'crit' : st === 'ACK' ? 'warn' : 'ok'}>{tr(...STATE_LABEL[st])}</Tag>
                  {st === 'NEW' &&
                  <button type="button" onClick={() => setStates((s) => ({ ...s, [a.id]: 'ACK' }))} className="flex items-center gap-1 border border-line px-2 py-1 text-2xs text-slate-400 transition-colors duration-150 hover:border-elec-400/40 hover:text-elec-300">
                      <EyeIcon size={11} />{tr('بررسی', 'Acknowledge')}
                    </button>
                  }
                  {st !== 'RESOLVED' &&
                  <button type="button" onClick={() => setStates((s) => ({ ...s, [a.id]: 'RESOLVED' }))} className="flex items-center gap-1 border border-line px-2 py-1 text-2xs text-slate-400 transition-colors duration-150 hover:border-signal-ok/40 hover:text-signal-ok">
                      <CheckIcon size={11} />{tr('رفع شد', 'Resolve')}
                    </button>
                  }
                </div>
              </li>);

          })}
          {!rows.length && <li className="px-3 py-4 text-[12px] text-slate-500">{tr('هشداری با این فیلتر وجود ندارد.', 'No alerts match this filter.')}</li>}
        </ul>
      </Panel>
    </>);

}
