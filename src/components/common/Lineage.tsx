import { Link } from 'react-router-dom';
import { DatabaseIcon } from 'lucide-react';
import { sourceById, sourceScore } from '../../data/sources';
import { DATA_AS_OF } from '../../data/common';
import { LevelDot } from './Badge';
import { useLocale } from '../../contexts/LocaleContext';

/** Traceability strip: which integrated sources feed this view and their freshness (spec §8.7). */
export function Lineage({ ids }: {ids: string[];}) {
  const { tr, tx, n } = useLocale();
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border border-line bg-ink-900/60 px-3 py-2 text-2xs text-slate-500">
      <span className="flex items-center gap-1.5 font-semibold uppercase tracking-[0.12em] text-slate-400">
        <DatabaseIcon size={12} />
        {tr('منشأ داده', 'Data lineage')}
      </span>
      {ids.map((id) => {
        const s = sourceById(id);
        if (!s) return null;
        return (
          <Link
            key={id}
            to="/sources"
            title={`${tx(s.lastSync)} · ${tr('کیفیت', 'quality')} ${sourceScore(s)}`}
            className="flex items-center gap-1.5 border border-line px-1.5 py-0.5 transition-colors duration-150 hover:border-elec-400/40 hover:text-elec-300">
            
            <LevelDot level={s.pipeline} />
            <span className="font-mono">{id.replace('SRC-', '')}</span>
            <span className="text-slate-600">{n(sourceScore(s))}</span>
          </Link>);

      })}
      <span className="ms-auto">
        {tr('به‌روزرسانی لایه یکپارچه', 'Unified layer refreshed')}: <span className="font-mono text-slate-400">{tx(DATA_AS_OF)}</span>
      </span>
    </div>);

}
