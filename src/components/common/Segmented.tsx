
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label





}: {value: T;options: {value: T;label: string;}[];onChange: (v: T) => void;label: string;}) {
  return (
    <div className="flex flex-wrap overflow-hidden border border-line" role="group" aria-label={label}>
      {options.map((o) =>
      <button
        key={o.value}
        type="button"
        onClick={() => onChange(o.value)}
        aria-pressed={value === o.value}
        className={`px-2.5 py-1 text-[11px] font-medium transition-colors duration-150 ${
        value === o.value ? 'bg-elec-400/15 text-elec-300' : 'text-slate-500 hover:text-slate-300'}`
        }>
        
          {o.label}
        </button>
      )}
    </div>);

}
