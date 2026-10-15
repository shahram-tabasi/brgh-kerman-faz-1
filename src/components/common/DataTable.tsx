import React from 'react';

export interface Column<T> {
  key: string;
  label: string;
  align?: 'start' | 'end' | 'center';
  width?: string;
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  activeKey?: string;
  dense?: boolean;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  activeKey,
  dense = false
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-[12px]">
        <thead>
          <tr className="border-b border-line-strong">
            {columns.map((c) =>
            <th
              key={c.key}
              scope="col"
              style={{ width: c.width }}
              className={`whitespace-nowrap px-2.5 py-2 text-2xs font-semibold uppercase tracking-[0.1em] text-slate-500 ${
              c.align === 'end' ?
              'text-end' :
              c.align === 'center' ?
              'text-center' :
              'text-start'}`
              }>
              
                {c.label}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const key = rowKey(row);
            const active = key === activeKey;
            return (
              <tr
                key={key}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={
                onRowClick ?
                (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onRowClick(row);
                  }
                } :
                undefined
                }
                className={`border-b border-line/60 transition-colors duration-150 ${
                onRowClick ? 'cursor-pointer hover:bg-elec-400/[0.06] focus:bg-elec-400/[0.08] focus:outline-none' : ''} ${
                active ? 'bg-elec-400/[0.1]' : ''}`}>
                
                {columns.map((c) =>
                <td
                  key={c.key}
                  className={`whitespace-nowrap px-2.5 ${dense ? 'py-1.5' : 'py-2'} text-slate-300 ${
                  c.align === 'end' ?
                  'text-end' :
                  c.align === 'center' ?
                  'text-center' :
                  'text-start'}`
                  }>
                  
                    {c.render(row)}
                  </td>
                )}
              </tr>);

          })}
        </tbody>
      </table>
    </div>);

}