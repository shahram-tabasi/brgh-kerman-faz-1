import { regions } from '../../data/regions';
import { useLocale } from '../../contexts/LocaleContext';

export function RegionFilter({ value, onChange }: {value: string;onChange: (v: string) => void;}) {
  const { tr, tx } = useLocale();
  return (
    <label className="flex items-center gap-2 text-2xs text-slate-500">
      {tr('منطقه', 'Region')}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-line bg-ink-850 px-2 py-1 text-[12px] text-slate-200 outline-none focus-visible:border-elec-400/60">
        
        <option value="ALL">{tr('کل شرکت', 'Whole company')}</option>
        {regions.map((r) =>
        <option key={r.id} value={r.id}>{tx(r.name)}</option>
        )}
      </select>
    </label>);

}
