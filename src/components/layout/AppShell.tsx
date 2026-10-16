import React, { useState } from 'react';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { useLocale } from '../../contexts/LocaleContext';

export function AppShell({ children }: {children: React.ReactNode;}) {
  const [collapsed, setCollapsed] = useState(false);
  const { tr } = useLocale();
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-ink-950 text-slate-200">
      <TopBar />
      <div className="flex items-center gap-2 border-b border-line bg-signal-warn/[0.06] px-4 py-1 print:hidden">
        <span className="h-1.5 w-1.5 shrink-0 bg-signal-warn" />
        <p className="truncate text-2xs uppercase tracking-[0.12em] text-signal-warn/90">
          {tr(
            'داده‌های نمایشی / مصنوعی — ساختار مطابق شرح خدمات پروژه؛ مقادیر عددی واقعی نیستند',
            'DEMO / SYNTHETIC DATA — structure follows the project scope; figures are not real'
          )}
        </p>
      </div>
      <div className="flex min-h-0 flex-1">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
        <main className="min-w-0 flex-1 overflow-y-auto grid-noise">
          <div className="mx-auto flex min-h-full w-full max-w-[1920px] flex-col gap-3 p-3">{children}</div>
        </main>
      </div>
    </div>);

}
