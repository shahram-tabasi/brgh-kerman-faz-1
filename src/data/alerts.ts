import type { Level, Tx } from '../types';
import { kpiLevel, kpis } from './kpis';
import { regions } from './regions';
import { sensitiveAssets } from './operations';
import { projects } from './projects';
import { sources } from './sources';
import { monthlyCost } from './finance';
import { fmtNum } from '../utils/format';

export type AlertCategory = 'outage' | 'equipment' | 'cost' | 'project' | 'region' | 'quality' | 'incident' | 'source' | 'kpi';
export type AlertState = 'NEW' | 'ACK' | 'RESOLVED';

export interface Alert {
  id: string;
  level: Exclude<Level, 'OK'>;
  category: AlertCategory;
  title: Tx;
  detail: Tx;
  rule: string;
  regionId?: string;
  time: Tx;
  state: AlertState;
  owner: Tx;
  link: string;
}

export const categoryLabel: Record<AlertCategory, Tx> = {
  outage: { fa: 'افزایش غیرعادی خاموشی', en: 'Abnormal outage rise' },
  equipment: { fa: 'عبور بار از حد', en: 'Equipment overload' },
  cost: { fa: 'افزایش غیرعادی هزینه', en: 'Abnormal cost rise' },
  project: { fa: 'تأخیر پروژه', en: 'Project delay' },
  region: { fa: 'افت عملکرد منطقه', en: 'Region under-performance' },
  quality: { fa: 'کاهش کیفیت داده', en: 'Data-quality drop' },
  incident: { fa: 'افزایش رخدادها', en: 'Incident surge' },
  source: { fa: 'عدم به‌روزرسانی منبع', en: 'Source not refreshed' },
  kpi: { fa: 'انحراف شاخص', en: 'KPI deviation' }
};

const ops = { fa: 'معاونت بهره‌برداری', en: 'Operations Deputy' };
const it = { fa: 'دفتر فناوری اطلاعات', en: 'IT Office' };
const T = (fa: string, en: string): Tx => ({ fa, en });
const f = (v: number, d = 0) => fmtNum(v, 'en', d);
const ff = (v: number, d = 0) => fmtNum(v, 'fa', d);

/** All alerts come from explicit, auditable threshold rules — there is no ML / AI involved. */
function build(): Alert[] {
  const out: Alert[] = [];
  let seq = 4100;
  const id = () => `ALR-${seq++}`;

  // 1. abnormal outage rise per region: SAIDI above KPI-01 critical / warning thresholds
  const saidi = kpis.find((k) => k.id === 'KPI-01')!;
  regions.filter((r) => r.saidi > saidi.warn).forEach((r) => out.push({
    id: id(), level: r.saidi > saidi.crit ? 'CRIT' : 'WARN', category: 'outage', regionId: r.id,
    title: T(`افزایش خاموشی در ${r.name.fa}`, `Outage rise in ${r.name.en}`),
    detail: T(`SAIDI = ${ff(r.saidi)} دقیقه (حد هشدار ${ff(saidi.warn)})`, `SAIDI = ${f(r.saidi)} min (warning ${f(saidi.warn)})`),
    rule: `SAIDI(region) > ${r.saidi > saidi.crit ? saidi.crit : saidi.warn}`, time: T('امروز ۰۶:۰۰', 'Today 06:00'),
    state: r.saidi > saidi.crit ? 'NEW' : 'ACK', owner: ops, link: '/operations'
  }));

  // 2. equipment overload
  sensitiveAssets.filter((a) => a.loadingPct >= 90).forEach((a) => out.push({
    id: id(), level: a.loadingPct >= 95 ? 'CRIT' : 'WARN', category: 'equipment', regionId: a.regionId,
    title: T(`عبور بار ${a.id} از حد مجاز`, `${a.id} loading above limit`),
    detail: T(`بارگذاری ${ff(a.loadingPct)}٪ (حد ۹۰٪ / بحرانی ۹۵٪)`, `Loading ${f(a.loadingPct)}% (limit 90% / critical 95%)`),
    rule: 'loading% ≥ 90 → WARN; ≥ 95 → CRIT', time: T('امروز ۰۷:۳۰', 'Today 07:30'),
    state: 'NEW', owner: ops, link: '/operations'
  }));

  // 3. abnormal cost increase: last month actual vs plan
  const last = monthlyCost.actual.length - 1;
  const dev = (monthlyCost.actual[last] - monthlyCost.planned[last]) / monthlyCost.planned[last] * 100;
  if (dev > 5) out.push({
    id: id(), level: dev > 10 ? 'CRIT' : 'WARN', category: 'cost',
    title: T('افزایش هزینه ماه جاری نسبت به برنامه', 'Current-month cost above plan'),
    detail: T(`انحراف ${ff(dev, 1)}٪ از برنامه ماهانه`, `${f(dev, 1)}% above monthly plan`),
    rule: '(actual − plan) / plan > 5% → WARN; > 10% → CRIT', time: T('دیروز', 'Yesterday'),
    state: 'NEW', owner: T('معاونت مالی', 'Finance Deputy'), link: '/finance'
  });

  // 4. project delay
  projects.filter((p) => p.delayDays >= 30).forEach((p) => out.push({
    id: id(), level: p.delayDays >= 60 ? 'CRIT' : 'WARN', category: 'project', regionId: p.regionId,
    title: T(`تأخیر پروژه ${p.id}`, `${p.id} behind schedule`),
    detail: T(`${p.name.fa} — ${ff(p.delayDays)} روز تأخیر`, `${p.name.en} — ${f(p.delayDays)} days late`),
    rule: 'delay ≥ 30d → WARN; ≥ 60d → CRIT', time: T('امروز', 'Today'),
    state: p.delayDays >= 60 ? 'NEW' : 'ACK', owner: T('دفتر برنامه‌ریزی و پروژه‌ها', 'Planning & Projects'), link: '/projects'
  }));

  // 5. region performance drop (satisfaction below KPI-16 warning)
  regions.filter((r) => r.satisfaction < 70).forEach((r) => out.push({
    id: id(), level: r.satisfaction < 65 ? 'CRIT' : 'WARN', category: 'region', regionId: r.id,
    title: T(`افت عملکرد خدمات ${r.name.fa}`, `${r.name.en} service under-performance`),
    detail: T(`رضایت ${ff(r.satisfaction)} از ۱۰۰ و پاسخگویی ${ff(r.responseHrs)} ساعت`, `Satisfaction ${f(r.satisfaction)}/100, response ${f(r.responseHrs)} h`),
    rule: 'satisfaction < 70 → WARN; < 65 → CRIT', time: T('این هفته', 'This week'),
    state: 'ACK', owner: T('معاونت خدمات مشترکین', 'Customer Services Deputy'), link: '/customers'
  }));

  // 6. data-quality drop
  kpis.filter((k) => k.category === 'data' && kpiLevel(k) !== 'OK').forEach((k) => out.push({
    id: id(), level: kpiLevel(k) as 'WARN' | 'CRIT', category: 'quality',
    title: T(`کاهش ${k.name.fa}`, `${k.name.en} below threshold`),
    detail: T(`مقدار ${ff(k.value, k.digits ?? 1)} — حد هشدار ${ff(k.warn)}`, `Value ${f(k.value, k.digits ?? 1)} — warning ${f(k.warn)}`),
    rule: `${k.id}: value < warn(${k.warn})`, time: T('امروز ۰۸:۰۰', 'Today 08:00'),
    state: 'NEW', owner: it, link: '/quality'
  }));

  // 7. incident surge (daily incidents above 3-sigma band — simple statistical rule)
  out.push({
    id: id(), level: 'WARN', category: 'incident', regionId: 'RJN',
    title: T('افزایش تعداد رخدادها در رودبار جنوب', 'Incident surge in Rudbar-e Jonub'),
    detail: T('۱۴ رخداد در ۲۴ ساعت؛ میانگین ۶ و حد بالا ۱۱', '14 incidents in 24 h; mean 6, upper band 11'),
    rule: 'count(24h) > mean + 3σ', time: T('امروز ۰۷:۴۵', 'Today 07:45'),
    state: 'NEW', owner: ops, link: '/operations'
  });

  // 8. source not refreshed
  sources.filter((s) => s.pipeline !== 'OK').forEach((s) => out.push({
    id: id(), level: s.pipeline as 'WARN' | 'CRIT', category: 'source',
    title: T(`عدم به‌روزرسانی ${s.name.fa}`, `${s.name.en} not refreshed`),
    detail: T(`آخرین دریافت: ${s.lastSync.fa} (تناوب ${s.frequency.fa})`, `Last sync: ${s.lastSync.en} (cadence ${s.frequency.en})`),
    rule: 'now − last_sync > cadence × 1.5', time: T('امروز', 'Today'),
    state: s.pipeline === 'CRIT' ? 'NEW' : 'ACK', owner: it, link: '/sources'
  }));

  // 9. remaining KPI deviations not already covered
  kpis.filter((k) => k.category !== 'data' && kpiLevel(k) !== 'OK').forEach((k) => out.push({
    id: id(), level: kpiLevel(k) as 'WARN' | 'CRIT', category: 'kpi',
    title: T(`انحراف شاخص ${k.name.fa}`, `${k.name.en} deviation`),
    detail: T(`مقدار ${ff(k.value, k.digits ?? 1)} ${k.unit.fa} — هدف ${ff(k.target, k.digits ?? 1)}`, `Value ${f(k.value, k.digits ?? 1)} ${k.unit.en} — target ${f(k.target, k.digits ?? 1)}`),
    rule: `${k.id}: ${k.direction === 'lower' ? `value > ${k.warn}` : `value < ${k.warn}`}`, time: T('امروز ۰۸:۰۰', 'Today 08:00'),
    state: 'ACK', owner: k.owner, link: '/kpi'
  }));

  const rank = { CRIT: 0, WARN: 1 };
  return out.sort((a, b) => rank[a.level] - rank[b.level]);
}

export const alerts: Alert[] = build();
