import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LocaleProvider } from './contexts/LocaleContext';
import { AppShell } from './components/layout/AppShell';
import { Executive } from './pages/Executive';
import { Operations } from './pages/Operations';
import { Projects } from './pages/Projects';
import { Finance } from './pages/Finance';
import { Customers } from './pages/Customers';
import { Drilldown } from './pages/Drilldown';
import { Alerts } from './pages/Alerts';
import { KpiMaster } from './pages/KpiMaster';
import { Sources } from './pages/Sources';
import { Quality } from './pages/Quality';
import { Dictionary } from './pages/Dictionary';
import { Architecture } from './pages/Architecture';

export function App() {
  return (
    <LocaleProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Executive />} />
            <Route path="/operations" element={<Operations />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/drilldown" element={<Drilldown />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/kpi" element={<KpiMaster />} />
            <Route path="/sources" element={<Sources />} />
            <Route path="/quality" element={<Quality />} />
            <Route path="/dictionary" element={<Dictionary />} />
            <Route path="/architecture" element={<Architecture />} />
            <Route path="*" element={<Executive />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </LocaleProvider>);

}
