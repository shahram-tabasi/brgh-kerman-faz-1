import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BookOpenIcon, LinkIcon, SearchIcon } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Panel } from '../components/common/Panel';
import { LevelBadge, Tag } from '../components/common/Badge';
import { useLocale } from '../contexts/LocaleContext';
import { dictionary } from '../data/dictionary';
import { kpis } from '../data/kpis';
import { sourceById } from '../data/sources';

const Q = { GOOD: ['OK', 'مناسب', 'Good'], MEDIUM: ['WARN', 'متوسط', 'Medium'], POOR: ['CRIT', 'ضعیف', 'Poor'] } as const;

export function Dictionary() {
  const { tr, tx } = useLocale();
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const selId = params.get('id') ?? dictionary[0].id;
  const setSelId = (id: string) => setParams({ id });
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return dictionary;
    return dictionary.filter((e) => [e.id, e.name.fa, e.name.en, e.definition.fa, e.definition.en, e.source].some((x) => x.toLowerCase().includes(s)));
  }, [q]);
  const sel = dictionary.find((e) => e.id === selId) ?? dictionary[0];
  const usedBy = dictionary.filter((e) => e.relations.includes(sel.id));

  return (
    <>
      <PageHeader
        section="6"
        title={tr('مدل یکپارچه اطلاعات و فرهنگ داده', 'Unified information model & data dictionary')}
        subtitle={tr(
          'چه داده‌ای موردنیاز است، از کجا می‌آید، مالک آن کیست، مرجع اصلی کدام است، ارتباط داده‌ها و شاخص‌های وابسته',
          'Which data is needed, where it comes from, who owns it, which system is authoritative, relations and dependent KPIs'
        )}
        actions={
        <label className="flex items-center gap-2 border border-line bg-ink-850 px-2 py-1">
            <SearchIcon size={13} className="text-slate-500" />
            <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={tr('جستجو در فرهنگ داده…', 'Search dictionary…')}
            className="w-48 bg-transparent text-[12px] text-slate-200 outline-none placeholder:text-slate-600" />
          
          </label>
        } />
      

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <Panel className="xl:col-span-7" title={tr('عناصر داده کلیدی', 'Key data elements')} icon={<BookOpenIcon size={14} />} bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-line-strong text-2xs uppercase tracking-[0.08em] text-slate-500">
                  <th className="px-2.5 py-2 text-start font-semibold">{tr('کد', 'ID')}</th>
                  <th className="px-2.5 py-2 text-start font-semibold">{tr('نام داده', 'Element')}</th>
                  <th className="px-2.5 py-2 text-start font-semibold">{tr('حوزه', 'Domain')}</th>
                  <th className="px-2.5 py-2 text-start font-semibold">{tr('منبع مرجع', 'Golden source')}</th>
                  <th className="px-2.5 py-2 text-start font-semibold">{tr('دوره', 'Refresh')}</th>
                  <th className="px-2.5 py-2 text-start font-semibold">{tr('کیفیت', 'Quality')}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((e) =>
                <tr
                  key={e.id}
                  tabIndex={0}
                  onClick={() => setSelId(e.id)}
                  onKeyDown={(ev) => {if (ev.key === 'Enter') setSelId(e.id);}}
                  className={`cursor-pointer border-b border-line/60 transition-colors duration-150 hover:bg-elec-400/[0.06] focus:outline-none ${sel.id === e.id ? 'bg-elec-400/[0.1]' : ''}`}>
                  
                    <td className="whitespace-nowrap px-2.5 py-1.5 font-mono text-2xs text-slate-500">{e.id}</td>
                    <td className="px-2.5 py-1.5 text-slate-200">{tx(e.name)}</td>
                    <td className="px-2.5 py-1.5"><Tag>{tx(e.domain)}</Tag></td>
                    <td className="px-2.5 py-1.5 font-mono text-2xs text-elec-300">{e.source}</td>
                    <td className="whitespace-nowrap px-2.5 py-1.5 text-slate-400">{tx(e.refresh)}</td>
                    <td className="px-2.5 py-1.5"><LevelBadge level={Q[e.quality][0]} size="xs" label={tr(Q[e.quality][1], Q[e.quality][2])} /></td>
                  </tr>
                )}
              </tbody>
            </table>
            {!rows.length && <p className="p-3 text-[12px] text-slate-500">{tr('موردی یافت نشد.', 'Nothing found.')}</p>}
          </div>
        </Panel>

        <Panel className="xl:col-span-5" title={`${sel.id} — ${tx(sel.name)}`} subtitle={tr('مشخصات ثبت‌شده برای هر داده کلیدی', 'Attributes recorded for every key data element')} icon={<BookOpenIcon size={14} />} accent="elec">
          <dl className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-1.5 text-[12px]">
            <dt className="text-slate-500">{tr('نام داده', 'Name')}</dt><dd className="text-slate-200">{tx(sel.name)}</dd>
            <dt className="text-slate-500">{tr('تعریف', 'Definition')}</dt><dd className="text-slate-300">{tx(sel.definition)}</dd>
            <dt className="text-slate-500">{tr('نوع', 'Type')}</dt><dd className="font-mono text-slate-300">{sel.type}</dd>
            <dt className="text-slate-500">{tr('واحد', 'Unit')}</dt><dd className="text-slate-300">{tx(sel.unit)}</dd>
            <dt className="text-slate-500">{tr('منبع', 'Source')}</dt><dd className="text-slate-300">{sourceById(sel.source) ? tx(sourceById(sel.source)!.name) : sel.source}</dd>
            <dt className="text-slate-500">{tr('مالک', 'Owner')}</dt><dd className="text-slate-300">{tx(sel.owner)}</dd>
            <dt className="text-slate-500">{tr('دوره به‌روزرسانی', 'Refresh cycle')}</dt><dd className="text-slate-300">{tx(sel.refresh)}</dd>
            <dt className="text-slate-500">{tr('سطح کیفیت', 'Quality level')}</dt><dd><LevelBadge level={Q[sel.quality][0]} size="xs" label={tr(Q[sel.quality][1], Q[sel.quality][2])} /></dd>
            <dt className="text-slate-500">{tr('قواعد اعتبارسنجی', 'Validation rules')}</dt><dd className="font-mono text-2xs text-elec-300" dir="ltr">{sel.rules}</dd>
            <dt className="text-slate-500">{tr('ارتباط با سایر داده‌ها', 'Relations')}</dt>
            <dd className="flex flex-wrap gap-1">
              {sel.relations.map((r) => {
                const isKpi = r.startsWith('KPI');
                const label = isKpi ? kpis.find((k) => k.id === r) : null;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => (isKpi ? navigate(`/kpi?id=${r}`) : setSelId(r))}
                    title={label ? tx(label.name) : undefined}
                    className={`flex items-center gap-1 border px-1.5 py-0.5 text-2xs transition-colors duration-150 ${isKpi ? 'border-signal-forecast/30 text-signal-forecast' : 'border-elec-400/30 text-elec-300 hover:bg-elec-400/10'}`}>
                    
                    <LinkIcon size={10} />{r}
                  </button>);

              })}
            </dd>
            {usedBy.length > 0 &&
            <>
                <dt className="text-slate-500">{tr('ارجاع‌شده در', 'Referenced by')}</dt>
                <dd className="flex flex-wrap gap-1">{usedBy.map((u) => <button key={u.id} type="button" onClick={() => setSelId(u.id)} className="border border-line px-1.5 py-0.5 text-2xs text-slate-400 hover:text-elec-300">{u.id}</button>)}</dd>
              </>
            }
          </dl>
        </Panel>
      </div>
    </>);

}
