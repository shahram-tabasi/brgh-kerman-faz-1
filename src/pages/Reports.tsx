import { useMemo, useState } from 'react';
import { DownloadIcon, FileTextIcon, PrinterIcon } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Panel } from '../components/common/Panel';
import { Tag } from '../components/common/Badge';
import { useLocale } from '../contexts/LocaleContext';
import { company, regionScore, regions } from '../data/regions';
import { kpiLevel, kpis } from '../data/kpis';
import { contractLabel, deputies, projects } from '../data/projects';
import { budgetLines, credits } from '../data/finance';
import { requestTypes } from '../data/customers';
import { outageClasses } from '../data/operations';
import { DIMENSIONS, dimensionLabel, issues, sourceScore, sources } from '../data/sources';
import { alerts, categoryLabel } from '../data/alerts';
import { DATA_AS_OF } from '../data/common';
import { useLiveClock } from '../hooks/useLiveClock';
import { fmtDate } from '../utils/format';

type Cell = string | number;
interface Table {
  title: string;
  head: string[];
  rows: Cell[][];
}
interface Report {
  id: string;
  title: string;
  audience: string;
  period: string;
  sources: string[];
  summary: string[];
  tables: Table[];
}

const LEVEL_TXT = { OK: ['مطلوب', 'On target'], WARN: ['هشدار', 'Warning'], CRIT: ['بحرانی', 'Critical'] } as const;

export function Reports() {
  const { tr, tx, n, pct, lang } = useLocale();
  const now = useLiveClock(60000);
  const [selId, setSelId] = useState('R-EXEC');

  const reports = useMemo<Report[]>(() => {
    const lv = (l: 'OK' | 'WARN' | 'CRIT') => tr(LEVEL_TXT[l][0], LEVEL_TXT[l][1]);
    const monthly = tr('ماهانه — مهر ۱۴۰۵', 'Monthly — Mehr 1405');
    return [
    {
      id: 'R-EXEC', title: tr('گزارش ماهانه مدیریت ارشد', 'Monthly executive report'), audience: tr('مدیرعامل، هیئت‌مدیره', 'CEO, board'), period: monthly,
      sources: ['SRC-OMS', 'SRC-SCADA', 'SRC-CIS', 'SRC-FIN', 'SRC-PMIS'],
      summary: [
      tr(`${n(company.customers)} مشترک، پیک بار ${n(company.peakMW)} مگاوات در برابر ظرفیت ${n(company.capacityMW)} مگاوات.`, `${n(company.customers)} customers; peak ${n(company.peakMW)} MW vs ${n(company.capacityMW)} MW capacity.`),
      tr(`${n(kpis.filter((k) => kpiLevel(k) === 'OK').length)} شاخص مطلوب، ${n(kpis.filter((k) => kpiLevel(k) === 'WARN').length)} هشدار، ${n(kpis.filter((k) => kpiLevel(k) === 'CRIT').length)} بحرانی.`, `${kpis.filter((k) => kpiLevel(k) === 'OK').length} KPIs on target, ${kpis.filter((k) => kpiLevel(k) === 'WARN').length} warning, ${kpis.filter((k) => kpiLevel(k) === 'CRIT').length} critical.`),
      tr(`${n(alerts.filter((a) => a.level === 'CRIT').length)} هشدار بحرانی باز؛ بیشترین مربوط به ${tx(categoryLabel[alerts[0].category])}.`, `${alerts.filter((a) => a.level === 'CRIT').length} open critical alerts; mostly ${tx(categoryLabel[alerts[0].category])}.`)],
      tables: [{
        title: tr('شاخص‌های کلیدی', 'Key indicators'),
        head: [tr('کد', 'ID'), tr('شاخص', 'KPI'), tr('مقدار', 'Value'), tr('هدف', 'Target'), tr('واحد', 'Unit'), tr('وضعیت', 'Status')],
        rows: kpis.filter((k) => ['executive', 'operations', 'finance', 'customers', 'projects'].includes(k.category)).map((k) => [k.id, tx(k.name), n(k.value, k.digits ?? 1), n(k.target, k.digits ?? 1), tx(k.unit), lv(kpiLevel(k))])
      }]
    },
    {
      id: 'R-REGION', title: tr('گزارش عملکرد مدیریت‌های شهرستان', 'County units performance report'), audience: tr('معاونین و مدیران شهرستان‌ها', 'Deputies, county managers'), period: monthly,
      sources: ['SRC-OMS', 'SRC-CIS', 'SRC-FIN', 'SRC-PMIS'],
      summary: [tr('مقایسه ۱۶ مدیریت برق شهرستان بر اساس شاخص‌های یکسان و امتیاز ترکیبی.', 'Comparison of the 16 county units on identical KPIs and a composite score.')],
      tables: [{
        title: tr('عملکرد مدیریت‌ها (مرتب بر اساس امتیاز)', 'Units by score'),
        head: [tr('مدیریت', 'Unit'), tr('مشترکین', 'Customers'), tr('پیک (MW)', 'Peak MW'), 'SAIDI', tr('تلفات٪', 'Loss %'), tr('وصول٪', 'Collect %'), tr('رضایت', 'Satisf.'), tr('امتیاز', 'Score')],
        rows: [...regions].sort((a, b) => regionScore(b) - regionScore(a)).map((r) => [tx(r.name), n(r.customers), n(r.peakMW), n(r.saidi), n(r.lossPct, 1), n(r.collectionPct), n(r.satisfaction), n(regionScore(r))])
      }]
    },
    {
      id: 'R-OUTAGE', title: tr('گزارش خاموشی و قابلیت اطمینان', 'Outage & reliability report'), audience: tr('معاونت بهره‌برداری', 'Operations deputy'), period: monthly,
      sources: ['SRC-OMS', 'SRC-SCADA', 'SRC-GIS'],
      summary: [tr(`SAIDI شرکت ${n(company.saidi)} دقیقه و SAIFI ${n(company.saifi, 2)}؛ ${n(company.outages)} قطعی بی‌برنامه در ماه.`, `Company SAIDI ${n(company.saidi)} min, SAIFI ${n(company.saifi, 2)}; ${n(company.outages)} unplanned interruptions this month.`)],
      tables: [
      { title: tr('طبقه‌بندی خاموشی', 'Outage classes'), head: [tr('طبقه', 'Class'), tr('سهم', 'Share'), tr('در SAIDI', 'In SAIDI')], rows: outageClasses.map((c) => [tx(c.name), pct(c.share, 0), c.inSaidi ? tr('بله', 'yes') : tr('خیر', 'no')]) },
      { title: tr('شاخص‌ها به تفکیک مدیریت', 'By unit'), head: [tr('مدیریت', 'Unit'), tr('قطعی', 'Interruptions'), 'SAIDI', 'SAIFI', tr('رفع (دقیقه)', 'Restore (min)')], rows: regions.map((r) => [tx(r.name), n(r.outages), n(r.saidi), n(r.saifi, 2), n(r.restoreMin)]) }]
    },
    {
      id: 'R-PROJECT', title: tr('گزارش وضعیت پروژه‌ها', 'Project status report'), audience: tr('معاونت برنامه‌ریزی و مهندسی', 'Planning deputy'), period: monthly,
      sources: ['SRC-PMIS', 'SRC-FIN'],
      summary: [tr(`${n(company.projects)} پروژه مصوب، ${n(company.delayedProjects)} پروژه با تأخیر.`, `${company.projects} approved projects, ${company.delayedProjects} delayed.`)],
      tables: [{
        title: tr('پروژه‌های شاخص', 'Flagship projects'),
        head: [tr('کد', 'ID'), tr('پروژه', 'Project'), tr('معاونت', 'Deputy'), tr('بودجه', 'Budget'), tr('فیزیکی/برنامه', 'Phys/plan'), tr('تأخیر (روز)', 'Delay d'), tr('قرارداد', 'Contract')],
        rows: projects.map((p) => [p.id, tx(p.name), tx(deputies.find((d) => d.id === p.deputyId)!.name), n(p.budgetBn), `${n(p.physical)}/${n(p.planned)}`, n(p.delayDays), tx(contractLabel[p.contract])])
      }]
    },
    {
      id: 'R-FIN', title: tr('گزارش عملکرد بودجه', 'Budget performance report'), audience: tr('معاونت مالی و پشتیبانی', 'Finance deputy'), period: tr('تجمعی تا پایان مهر ۱۴۰۵', 'YTD to end of Mehr 1405'),
      sources: ['SRC-FIN', 'SRC-PMIS'],
      summary: [tr(`جذب بودجه ${pct(credits.spentBn / credits.approvedBn * 100, 1)} (هدف ۷/۱۲ سال ≈ ۵۸٪).`, `Budget absorption ${pct(credits.spentBn / credits.approvedBn * 100, 1)} (YTD target ≈ 58%).`)],
      tables: [{
        title: tr('ردیف‌های بودجه (میلیارد تومان)', 'Budget lines (bn toman)'),
        head: [tr('ردیف', 'Line'), tr('مصوب', 'Approved'), tr('تخصیص', 'Allocated'), tr('هزینه', 'Spent'), tr('تعهد', 'Committed'), tr('جذب٪', 'Absorbed %')],
        rows: budgetLines.map((b) => [tx(b.name), n(b.approvedBn), n(b.allocatedBn), n(b.spentBn), n(b.committedBn), n(b.spentBn / b.approvedBn * 100, 1)])
      }]
    },
    {
      id: 'R-CUST', title: tr('گزارش خدمات مشترکین', 'Customer services report'), audience: tr('معاونت فروش و خدمات مشترکین', 'Sales & customer services'), period: monthly,
      sources: ['SRC-CIS', 'SRC-APP', 'SRC-OMS'],
      summary: [tr(`${n(company.requests)} درخواست، میانگین پاسخ ${n(company.responseHrs, 1)} ساعت، ${n(company.complaints)} شکایت.`, `${company.requests} requests, avg response ${company.responseHrs.toFixed(1)} h, ${company.complaints} complaints.`)],
      tables: [{
        title: tr('درخواست‌ها در برابر استاندارد خدمت', 'Requests vs service standard'),
        head: [tr('نوع', 'Type'), tr('تعداد', 'Count'), tr('میانگین (ساعت)', 'Avg h'), tr('استاندارد', 'Standard'), tr('وضعیت', 'Status')],
        rows: requestTypes.map((q) => [tx(q.name), n(q.count), n(q.avgHrs), n(q.targetHrs), q.avgHrs <= q.targetHrs ? lv('OK') : lv('WARN')])
      }]
    },
    {
      id: 'R-DQ', title: tr('گزارش کیفیت داده', 'Data quality report'), audience: tr('دفتر فناوری اطلاعات، مالکین داده', 'ICT office, data owners'), period: tr('هفتگی', 'Weekly'),
      sources: sources.map((s) => s.id),
      summary: [tr(`${n(issues.filter((i) => i.status !== 'RESOLVED').length)} مغایرت باز از ${n(issues.length)}؛ ضعیف‌ترین منبع: ${tx([...sources].sort((a, b) => sourceScore(a) - sourceScore(b))[0].name)}.`, `${issues.filter((i) => i.status !== 'RESOLVED').length} open discrepancies of ${issues.length}.`)],
      tables: [
      { title: tr('امتیاز کیفیت منابع', 'Source quality scores'), head: [tr('منبع', 'Source'), ...DIMENSIONS.map((d) => tx(dimensionLabel[d])), tr('کل', 'Total')], rows: sources.map((s) => [tx(s.name), ...DIMENSIONS.map((d) => n(s.scores[d])), n(sourceScore(s))]) },
      { title: tr('مغایرت‌ها', 'Discrepancies'), head: [tr('کد', 'ID'), tr('شرح', 'Issue'), tr('رکورد', 'Records'), tr('اولویت', 'Priority'), tr('وضعیت', 'Status')], rows: issues.map((i) => [i.id, tx(i.title), n(i.records), i.priority, i.status]) }]
    }];

  }, [tr, tx, n, pct]);

  const r = reports.find((x) => x.id === selId) ?? reports[0];

  function downloadCsv() {
    const lines: string[] = [];
    r.tables.forEach((t) => {
      lines.push(t.title);
      lines.push(t.head.map(csv).join(','));
      t.rows.forEach((row) => lines.push(row.map(csv).join(',')));
      lines.push('');
    });
    const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${r.id}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <>
      <PageHeader
        section="16"
        title={tr('گزارش‌های مدیریتی استاندارد', 'Standard management reports')}
        subtitle={tr('گزارش‌هایی که پیش‌تر به‌صورت دستی و با Excel تهیه می‌شد — اکنون خودکار از لایه یکپارچه، با قابلیت چاپ، PDF و خروجی CSV/Excel', 'Reports formerly assembled by hand in Excel — now generated from the unified layer, printable to PDF and exportable to CSV/Excel')}
        actions={
        <div className="flex gap-1.5 print:hidden">
            <button type="button" onClick={() => window.print()} className="flex items-center gap-1.5 border border-line px-2.5 py-1 text-[12px] text-slate-300 hover:border-elec-400/40 hover:text-elec-300">
              <PrinterIcon size={13} />{tr('چاپ / PDF', 'Print / PDF')}
            </button>
            <button type="button" onClick={downloadCsv} className="flex items-center gap-1.5 border border-line px-2.5 py-1 text-[12px] text-slate-300 hover:border-elec-400/40 hover:text-elec-300">
              <DownloadIcon size={13} />{tr('خروجی Excel (CSV)', 'Export Excel (CSV)')}
            </button>
          </div>
        } />
      
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <Panel className="xl:col-span-3 print:hidden" title={tr('فهرست گزارش‌ها', 'Report catalogue')} icon={<FileTextIcon size={14} />} bodyClassName="p-0">
          <ul>
            {reports.map((x) =>
            <li key={x.id}>
                <button
                type="button"
                onClick={() => setSelId(x.id)}
                className={`w-full border-b border-line/60 px-3 py-2 text-start transition-colors duration-150 ${x.id === r.id ? 'bg-elec-400/[0.1] text-elec-300' : 'text-slate-300 hover:bg-slate-400/[0.06]'}`}>
                
                  <p className="text-[12.5px]">{x.title}</p>
                  <p className="text-2xs text-slate-500">{x.audience} · {x.period}</p>
                </button>
              </li>
            )}
          </ul>
        </Panel>

        <section className="report-sheet border border-line bg-ink-850/80 p-5 xl:col-span-9">
          <header className="flex items-start gap-3 border-b border-line pb-3">
            <img src="/brand/company-logo.png" alt="" className="h-12 w-12 rounded-full" />
            <div className="min-w-0 flex-1">
              <p className="text-2xs text-slate-500">{tr('شرکت توزیع نیروی برق جنوب استان کرمان', 'South Kerman Electricity Distribution Co.')}</p>
              <h2 className="text-lg font-bold text-slate-50">{r.title}</h2>
              <p className="text-[12px] text-slate-400">{tr('مخاطب', 'Audience')}: {r.audience} · {tr('دوره', 'Period')}: {r.period}</p>
            </div>
            <div className="text-end text-2xs text-slate-500">
              <p>{tr('تاریخ تهیه', 'Generated')}: {fmtDate(now, lang)}</p>
              <p>{tr('داده تا', 'Data as of')}: {tx(DATA_AS_OF)}</p>
              <p className="mt-1"><Tag tone="warn">{tr('داده نمایشی', 'Demo data')}</Tag></p>
            </div>
          </header>
          <div className="mt-3">
            <h3 className="text-[13px] font-semibold text-slate-200">{tr('خلاصه', 'Summary')}</h3>
            <ul className="mt-1 list-disc space-y-1 ps-5 text-[12.5px] leading-relaxed text-slate-300">
              {r.summary.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>
          {r.tables.map((t) =>
          <div key={t.title} className="mt-4">
              <h3 className="mb-1.5 text-[13px] font-semibold text-slate-200">{t.title}</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[12px]">
                  <thead>
                    <tr className="border-b border-line-strong text-2xs text-slate-500">
                      {t.head.map((h) => <th key={h} className="whitespace-nowrap px-2 py-1.5 text-start font-semibold">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {t.rows.map((row, i) =>
                  <tr key={i} className="border-b border-line/50">
                        {row.map((c, j) => <td key={j} className="px-2 py-1 text-slate-300">{c}</td>)}
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <footer className="mt-4 border-t border-line pt-2 text-2xs text-slate-500">
            {tr('منشأ داده', 'Data lineage')}: {r.sources.join(' · ')} — {tr('تولید خودکار از لایه داده یکپارچه؛ اعداد با شناسنامه شاخص‌ها محاسبه شده‌اند.', 'Generated automatically from the unified data layer; figures follow the KPI Master definitions.')}
          </footer>
        </section>
      </div>
    </>);

}

function csv(v: Cell): string {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
