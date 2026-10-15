import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ListChecksIcon } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Panel } from '../components/common/Panel';
import { KpiTile } from '../components/common/KpiTile';
import { Tag } from '../components/common/Badge';
import { Segmented } from '../components/common/Segmented';
import { useLocale } from '../contexts/LocaleContext';
import { requirements } from '../data/requirements';
import type { ReqStatus } from '../data/requirements';
import { toFaDigits } from '../utils/format';

const STATUS: Record<ReqStatus, {fa: string;en: string;tone: 'ok' | 'elec' | 'warn' | 'slate';}> = {
  DONE: { fa: 'پیاده‌سازی شده', en: 'Implemented', tone: 'ok' },
  DRAFT: { fa: 'پیش‌نویس — نیازمند تأیید کارفرما', en: 'Draft — needs employer sign-off', tone: 'warn' },
  PROCESS: { fa: 'فعالیت/مستند پروژه', en: 'Project activity / document', tone: 'elec' },
  OUT: { fa: 'خارج از این نسخه (هوش مصنوعی)', en: 'Excluded (AI)', tone: 'slate' }
};

export function Traceability() {
  const { tr, n, isFa } = useLocale();
  const [filter, setFilter] = useState<'ALL' | ReqStatus>('ALL');
  const all = requirements.flatMap((s) => s.items);
  const count = (st: ReqStatus) => all.filter((i) => i[3] === st).length;
  const sections = useMemo(
    () => requirements.map((s) => ({ ...s, items: s.items.filter((i) => filter === 'ALL' || i[3] === filter) })).filter((s) => s.items.length),
    [filter]
  );

  return (
    <>
      <PageHeader
        section="1–25"
        title={tr('ماتریس انطباق با شرح خدمات', 'Scope compliance matrix')}
        subtitle={tr('هر بند و هر مورد شرح خدمات و محل پیاده‌سازی آن در نرم‌افزار — روی «مشاهده» بزنید تا مستقیم به همان صفحه بروید', 'Every section and bullet of the scope and where it lives in the software — click «open» to jump there')}
        actions={
        <Segmented
          label={tr('وضعیت', 'Status')}
          value={filter}
          onChange={setFilter}
          options={[{ value: 'ALL' as const, label: tr('همه', 'All') }, ...(Object.keys(STATUS) as ReqStatus[]).map((s) => ({ value: s, label: tr(STATUS[s].fa.split(' — ')[0], STATUS[s].en.split(' — ')[0]) }))]} />
        } />
      
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        <KpiTile label={tr('کل موارد', 'Total items')} value={n(all.length)} unit={`${n(requirements.length)} ${tr('بند', 'sections')}`} tone="neutral" />
        <KpiTile label={tr('پیاده‌سازی شده', 'Implemented')} value={n(count('DONE'))} tone="ok" gauge={count('DONE') / all.length * 100} />
        <KpiTile label={tr('پیش‌نویس', 'Draft')} value={n(count('DRAFT'))} tone="warn" />
        <KpiTile label={tr('فعالیت/مستند پروژه', 'Project activity')} value={n(count('PROCESS'))} tone="elec" />
        <KpiTile label={tr('خارج از نسخه (AI)', 'Excluded (AI)')} value={n(count('OUT'))} tone="neutral" />
      </div>
      <Panel title={tr('بندها و موارد', 'Sections & items')} icon={<ListChecksIcon size={14} />} bodyClassName="p-0">
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr className="border-b border-line-strong text-2xs text-slate-500">
              <th className="w-14 px-2.5 py-2 text-start font-semibold">{tr('بند', '§')}</th>
              <th className="px-2.5 py-2 text-start font-semibold">{tr('مورد شرح خدمات', 'Scope item')}</th>
              <th className="px-2.5 py-2 text-start font-semibold">{tr('وضعیت', 'Status')}</th>
              <th className="px-2.5 py-2 text-start font-semibold">{tr('محل در نرم‌افزار', 'Where')}</th>
            </tr>
          </thead>
          <tbody>
            {sections.flatMap((s) => [
            <tr key={s.no} className="bg-ink-800/60">
                <td className="px-2.5 py-1.5 font-mono text-elec-300">{isFa ? toFaDigits(s.no) : s.no}</td>
                <td colSpan={3} className="px-2.5 py-1.5 font-semibold text-slate-100">{tr(s.fa, s.en)}</td>
              </tr>,
            ...s.items.map(([fa, en, route, st], i) =>
            <tr key={`${s.no}-${i}`} className="border-b border-line/50">
                  <td />
                  <td className="px-2.5 py-1.5 text-slate-300">{tr(fa, en)}</td>
                  <td className="whitespace-nowrap px-2.5 py-1.5"><Tag tone={STATUS[st].tone}>{tr(STATUS[st].fa, STATUS[st].en)}</Tag></td>
                  <td className="whitespace-nowrap px-2.5 py-1.5">
                    <Link to={route} className="font-mono text-2xs text-elec-300 hover:underline" dir="ltr">{route}</Link>
                  </td>
                </tr>
            )])}
          </tbody>
        </table>
      </Panel>
    </>);

}
