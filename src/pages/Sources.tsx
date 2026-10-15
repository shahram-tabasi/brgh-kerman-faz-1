import { useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, DatabaseIcon, IdCardIcon, PlugIcon, WorkflowIcon } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Panel } from '../components/common/Panel';
import { KpiMasterTile, KpiTile } from '../components/common/KpiTile';
import { LevelBadge, LevelDot, Tag } from '../components/common/Badge';
import { Meter } from '../components/common/Gauge';
import { useLocale } from '../contexts/LocaleContext';
import { CONNECTIONS, DIMENSIONS, connectionLabel, dimensionLabel, groupLabel, sourceScore, sources } from '../data/sources';
import type { DataSource, QualityGrade, SourceGroup } from '../data/sources';
import { kpiById } from '../data/kpis';
import type { Level } from '../types';
import { levelColor } from '../utils/format';

const GRADE: Record<QualityGrade, {fa: string;en: string;level: Level;}> = {
  GOOD: { fa: 'مناسب', en: 'Good', level: 'OK' },
  MEDIUM: { fa: 'متوسط', en: 'Medium', level: 'WARN' },
  POOR: { fa: 'ضعیف', en: 'Poor', level: 'CRIT' }
};
const GEN = { AUTO: ['خودکار', 'Automatic'], MANUAL: ['دستی', 'Manual'], MIXED: ['خودکار/دستی', 'Mixed'] } as const;

export function Sources() {
  const { tr, tx, n, pct, isFa } = useLocale();
  const [sel, setSel] = useState<DataSource>(sources[0]);
  const Arrow = isFa ? ArrowLeftIcon : ArrowRightIcon;
  const records = sources.reduce((a, s) => a + s.records, 0);
  const errors = sources.reduce((a, s) => a + s.errors, 0);

  const stages: {fa: string;en: string;level: Level;}[] = [
  { fa: 'منبع', en: 'Source', level: 'OK' },
  { fa: `اتصال (${connectionLabel(sel.connection).fa})`, en: `Connect (${connectionLabel(sel.connection).en})`, level: sel.connection === 'Manual' || sel.connection === 'ExcelCSV' ? 'WARN' : 'OK' },
  { fa: 'لایه Staging', en: 'Staging', level: sel.pipeline },
  { fa: 'کنترل کیفیت', en: 'Quality checks', level: sourceScore(sel) >= 90 ? 'OK' : sourceScore(sel) >= 80 ? 'WARN' : 'CRIT' },
  { fa: 'لایه داده یکپارچه', en: 'Unified layer', level: sel.pipeline === 'CRIT' ? 'CRIT' : 'OK' }];


  return (
    <>
      <PageHeader
        section="5–7"
        title={tr('منابع اطلاعاتی و لایه یکپارچه‌سازی', 'Data sources & integration layer')}
        subtitle={tr(
          'نقشه جامع منابع اطلاعاتی شرکت و وضعیت دریافت داده — سامانه‌های مبدأ حذف یا جایگزین نمی‌شوند؛ داده از آن‌ها به لایه مشترک بالادستی منتقل می‌شود',
          'Company-wide source map and ingestion status — source systems are not replaced; their data flows into a shared upstream layer'
        )} />
      

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 2xl:grid-cols-6">
        <KpiTile label={tr('منابع شناسایی‌شده', 'Sources identified')} value={n(sources.length)} unit={`${n(sources.filter((s) => s.pilot).length)} ${tr('در فاز Pilot', 'in pilot')}`} tone="elec" />
        <KpiMasterTile kpi={kpiById('KPI-21')} />
        <KpiMasterTile kpi={kpiById('KPI-22')} />
        <KpiMasterTile kpi={kpiById('KPI-23')} />
        <KpiTile label={tr('رکوردهای دریافتی', 'Records ingested')} value={n(records / 1e6, 2)} unit={tr('میلیون', 'million')} tone="neutral" />
        <KpiTile label={tr('خطاهای انتقال', 'Transfer errors')} value={n(errors)} unit={pct(errors / records * 100, 2)} tone="warn" />
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <Panel className="xl:col-span-3" title={tr('روش‌های اتصال', 'Connection methods')} icon={<PlugIcon size={14} />}>
          <ul className="space-y-2">
            {CONNECTIONS.map((c) => {
              const cnt = sources.filter((s) => s.connection === c.id).length;
              const color = c.id === 'Manual' ? '#f59e0b' : c.id === 'ExcelCSV' || c.id === 'FileExchange' ? '#a78bfa' : '#38bdf8';
              return (
                <li key={c.id}>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-slate-300">{tr(c.fa, c.en)}</span>
                    <span className="font-mono text-slate-400">{n(cnt)}</span>
                  </div>
                  <div className="mt-1"><Meter value={cnt} max={sources.length} color={color} height={4} /></div>
                </li>);

            })}
          </ul>
          <p className="mt-3 border-t border-line pt-2 text-2xs leading-relaxed text-slate-500">
            {tr('اتصال استاندارد = API، Web Service، Database یا سرویس زمان‌بندی‌شده (شاخص KPI-21)', 'Standard link = API, Web Service, Database or scheduled service (KPI-21)')}
          </p>
        </Panel>

        <Panel className="xl:col-span-9" title={tr('مسیر داده منبع انتخاب‌شده', 'Pipeline of selected source')} subtitle={tx(sel.name)} icon={<WorkflowIcon size={14} />} accent="elec">
          <div className="flex flex-wrap items-center gap-2">
            {stages.map((s, i) =>
            <div key={s.en} className="flex items-center gap-2">
                {i > 0 && <Arrow size={14} className="text-slate-600" />}
                <div className="flex items-center gap-2 border px-3 py-2" style={{ borderColor: `${levelColor[s.level]}55`, background: `${levelColor[s.level]}10` }}>
                  <LevelDot level={s.level} pulse={s.level !== 'OK'} />
                  <span className="text-[12px] text-slate-200">{tr(s.fa, s.en)}</span>
                </div>
              </div>
            )}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[12px] sm:grid-cols-4">
            {[
            [tr('آخرین دریافت', 'Last sync'), tx(sel.lastSync)],
            [tr('رکوردها', 'Records'), n(sel.records)],
            [tr('خطاها', 'Errors'), n(sel.errors)],
            [tr('امتیاز کیفیت', 'Quality score'), `${n(sourceScore(sel))} / ${n(100)}`]].
            map(([k, v]) =>
            <div key={k} className="border border-line bg-ink-800/40 px-2.5 py-1.5">
                <p className="text-2xs text-slate-500">{k}</p>
                <p className="font-mono text-slate-200">{v}</p>
              </div>
            )}
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <Panel className="xl:col-span-8" title={tr('نقشه جامع منابع اطلاعاتی', 'Data source inventory')} icon={<DatabaseIcon size={14} />} bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-line-strong text-2xs uppercase tracking-[0.08em] text-slate-500">
                  <th className="px-2.5 py-2 text-start font-semibold">{tr('سامانه / منبع', 'System / source')}</th>
                  <th className="px-2.5 py-2 text-start font-semibold">{tr('واحد مالک', 'Owner')}</th>
                  <th className="px-2.5 py-2 text-start font-semibold">{tr('تناوب', 'Cadence')}</th>
                  <th className="px-2.5 py-2 text-start font-semibold">{tr('اتصال', 'Link')}</th>
                  <th className="px-2.5 py-2 text-start font-semibold">{tr('کیفیت', 'Quality')}</th>
                  <th className="px-2.5 py-2 text-start font-semibold">{tr('دریافت', 'Ingestion')}</th>
                </tr>
              </thead>
              <tbody>
                {(Object.keys(groupLabel) as SourceGroup[]).filter((g) => sources.some((s) => s.group === g)).flatMap((g) => [
                <tr key={g} className="bg-ink-800/60"><td colSpan={6} className="px-2.5 py-1 text-2xs font-semibold text-slate-500">{tx(groupLabel[g])}</td></tr>,
                ...sources.filter((s) => s.group === g).map((s) =>
                <tr
                  key={s.id}
                  tabIndex={0}
                  onClick={() => setSel(s)}
                  onKeyDown={(e) => {if (e.key === 'Enter') setSel(s);}}
                  className={`cursor-pointer border-b border-line/60 transition-colors duration-150 hover:bg-elec-400/[0.06] focus:outline-none ${sel.id === s.id ? 'bg-elec-400/[0.1]' : ''}`}>
                  
                    <td className="px-2.5 py-1.5 text-slate-200">
                      <span className="me-1.5 font-mono text-2xs text-slate-500">{s.id.replace('SRC-', '')}</span>
                      {tx(s.name)}
                      {s.pilot && <span className="ms-1.5"><Tag tone="elec">Pilot</Tag></span>}
                    </td>
                    <td className="whitespace-nowrap px-2.5 py-1.5 text-slate-400">{tx(s.owner)}</td>
                    <td className="whitespace-nowrap px-2.5 py-1.5 text-slate-400">{tx(s.frequency)}</td>
                    <td className="px-2.5 py-1.5"><Tag tone={s.connection === 'Manual' || s.connection === 'ExcelCSV' ? 'warn' : 'slate'}>{tr(connectionLabel(s.connection).fa, connectionLabel(s.connection).en)}</Tag></td>
                    <td className="px-2.5 py-1.5"><LevelBadge level={GRADE[s.grade].level} size="xs" label={tr(GRADE[s.grade].fa, GRADE[s.grade].en)} /></td>
                    <td className="whitespace-nowrap px-2.5 py-1.5"><span className="flex items-center gap-1.5 text-2xs text-slate-400"><LevelDot level={s.pipeline} pulse />{tx(s.lastSync)}</span></td>
                  </tr>
                )])}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel className="xl:col-span-4" title={tr('شناسنامه منبع', 'Source identity card')} subtitle={tr('ساختار بند ۵ شرح خدمات', 'Structure of scope §5')} icon={<IdCardIcon size={14} />} accent="elec">
          <dl className="grid grid-cols-[96px_1fr] gap-x-3 gap-y-1.5 text-[12px]">
            <dt className="text-slate-500">{tr('نام سامانه', 'System')}</dt><dd className="text-slate-200">{tx(sel.name)}</dd>
            <dt className="text-slate-500">{tr('واحد مالک', 'Owner unit')}</dt><dd className="text-slate-300">{tx(sel.owner)}</dd>
            <dt className="text-slate-500">{tr('نوع اطلاعات', 'Info type')}</dt><dd className="text-slate-300">{tx(sel.infoType)}</dd>
            <dt className="text-slate-500">{tr('روش تولید', 'Generation')}</dt><dd className="text-slate-300">{tr(GEN[sel.generation][0], GEN[sel.generation][1])}</dd>
            <dt className="text-slate-500">{tr('تناوب', 'Cadence')}</dt><dd className="text-slate-300">{tx(sel.frequency)}</dd>
            <dt className="text-slate-500">{tr('فرمت', 'Format')}</dt><dd className="font-mono text-slate-300">{sel.format}</dd>
            <dt className="text-slate-500">{tr('سطح دسترسی', 'Access')}</dt><dd className="text-slate-300">{tx(sel.access)}</dd>
            <dt className="text-slate-500">{tr('کیفیت داده', 'Data quality')}</dt><dd><LevelBadge level={GRADE[sel.grade].level} size="xs" label={tr(GRADE[sel.grade].fa, GRADE[sel.grade].en)} /></dd>
            <dt className="text-slate-500">{tr('مشکلات', 'Issues')}</dt><dd className="flex flex-wrap gap-1">{sel.problems.map((p) => <Tag key={p.en} tone="warn">{tx(p)}</Tag>)}</dd>
            <dt className="text-slate-500">{tr('قابلیت اتصال', 'Connectivity')}</dt><dd className="text-slate-300">{tr(connectionLabel(sel.connection).fa, connectionLabel(sel.connection).en)}</dd>
            <dt className="text-slate-500">{tr('دسته منبع (بند ۱۴)', 'Category (§14)')}</dt><dd className="text-slate-300">{tx(groupLabel[sel.group])}</dd>
          </dl>
          <div className="mt-3 space-y-1.5 border-t border-line pt-2">
            {DIMENSIONS.map((d) =>
            <div key={d} className="grid grid-cols-[90px_1fr_28px] items-center gap-2 text-2xs">
                <span className="truncate text-slate-500">{tx(dimensionLabel[d])}</span>
                <Meter value={sel.scores[d]} color={sel.scores[d] >= 90 ? '#34d399' : sel.scores[d] >= 80 ? '#f59e0b' : '#ef4444'} height={4} />
                <span className="text-end font-mono text-slate-400">{n(sel.scores[d])}</span>
              </div>
            )}
          </div>
        </Panel>
      </div>
    </>);

}
