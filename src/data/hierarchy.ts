import type { Tx } from '../types';
import { regions } from './regions';
import { rng } from './common';

export type NodeLevel = 'company' | 'region' | 'district' | 'feeder' | 'equipment' | 'event';

export interface DrillNode {
  id: string;
  level: NodeLevel;
  name: Tx;
  customers: number;
  outages: number;
  outageMin: number;
  loadMW: number;
  detail?: Tx;
  children: DrillNode[];
}

export const levelLabel: Record<NodeLevel, Tx> = {
  company: { fa: 'شرکت', en: 'Company' },
  region: { fa: 'منطقه', en: 'Region' },
  district: { fa: 'ناحیه', en: 'District' },
  feeder: { fa: 'فیدر', en: 'Feeder' },
  equipment: { fa: 'تجهیز', en: 'Equipment' },
  event: { fa: 'رخداد', en: 'Event' }
};

const DISTRICTS: Record<string, [string, string][]> = {
  JRF: [['مرکزی', 'Central'], ['اسلام‌آباد', 'Eslamabad'], ['ساردوئیه', 'Sarduiyeh'], ['جبالبارز', 'Jebalbarez']],
  ANB: [['مرکزی', 'Central'], ['اسماعیلی', 'Esmaili'], ['جبالبارز جنوبی', 'South Jebalbarez']],
  KHN: [['مرکزی', 'Central'], ['کوهستان', 'Kuhestan']],
  RJN: [['مرکزی', 'Central'], ['جازموریان', 'Jazmurian'], ['نهضت‌آباد', 'Nehzatabad']],
  QGJ: [['مرکزی', 'Central'], ['چاه‌دادخدا', 'Chah Dadkhoda']],
  MNJ: [['مرکزی', 'Central'], ['آسمینون', 'Asminun']],
  FRB: [['مرکزی', 'Central'], ['حتکن', 'Hatkan']],
  ARZ: [['مرکزی', 'Central'], ['صوغان', 'Soghan']]
};

const EQUIP: [string, string, string][] = [
['T', 'ترانسفورماتور توزیع', 'Distribution transformer'],
['R', 'ریکلوزر', 'Recloser'],
['C', 'کابل / خط هوایی', 'Cable / overhead line'],
['S', 'سکسیونر', 'Sectionaliser']];

const CAUSES: [string, string][] = [
['اضافه‌بار', 'Overload'], ['گرد و غبار', 'Dust'], ['فرسودگی', 'Ageing'], ['برخورد پرنده', 'Bird contact'],
['اتصال کوتاه', 'Short circuit'], ['عوامل جوی', 'Weather']];

const DAYS: [string, string][] = [['امروز', 'today'], ['دیروز', 'yesterday'], ['۲ روز پیش', '2 days ago'], ['۴ روز پیش', '4 days ago'], ['هفته گذشته', 'last week']];

/** Split an integer total into n parts by random weights. */
function split(total: number, n: number, r: () => number): number[] {
  const w = Array.from({ length: n }, () => 0.4 + r());
  const s = w.reduce((a, b) => a + b, 0);
  const parts = w.map((x) => Math.floor(total * x / s));
  parts[0] += total - parts.reduce((a, b) => a + b, 0);
  return parts;
}

function build(): DrillNode {
  const r = rng(9001);
  const regionNodes: DrillNode[] = regions.map((reg) => {
    const dNames = DISTRICTS[reg.id];
    const dCust = split(reg.customers, dNames.length, r);
    const dOut = split(reg.outages, dNames.length, r);
    const dLoad = split(reg.peakMW * 10, dNames.length, r);
    let feederNo = 1;
    const districts: DrillNode[] = dNames.map(([fa, en], di) => {
      const nf = 3 + Math.floor(r() * 2);
      const fCust = split(dCust[di], nf, r);
      const fOut = split(dOut[di], nf, r);
      const fLoad = split(dLoad[di], nf, r);
      const feeders: DrillNode[] = Array.from({ length: nf }, (_, fi) => {
        const code = `${reg.id}-F${String(feederNo++).padStart(2, '0')}`;
        const ne = 3;
        const eCust = split(fCust[fi], ne, r);
        const eOut = split(fOut[fi], ne, r);
        const eLoad = split(fLoad[fi], ne, r);
        const equipment: DrillNode[] = Array.from({ length: ne }, (_, ei) => {
          const [k, efa, een] = EQUIP[Math.floor(r() * EQUIP.length)];
          const eid = `${k}-${code.replace('-F', '')}${ei + 1}`;
          const shown = Math.min(eOut[ei], 4);
          const events: DrillNode[] = Array.from({ length: shown }, (_, xi) => {
            const [cfa, cen] = CAUSES[Math.floor(r() * CAUSES.length)];
            const [dfa, den] = DAYS[Math.min(DAYS.length - 1, xi + Math.floor(r() * 2))];
            const mins = 10 + Math.floor(r() * 110);
            return {
              id: `${eid}-E${xi + 1}`,
              level: 'event' as const,
              name: { fa: `${cfa} — ${dfa}`, en: `${cen} — ${den}` },
              customers: Math.round(eCust[ei] * (0.3 + r() * 0.7)),
              outages: 1,
              outageMin: mins,
              loadMW: 0,
              detail: { fa: `مدت ${mins} دقیقه`, en: `${mins} min duration` },
              children: []
            };
          });
          return {
            id: eid,
            level: 'equipment' as const,
            name: { fa: `${efa} ${eid}`, en: `${een} ${eid}` },
            customers: eCust[ei],
            outages: eOut[ei],
            outageMin: Math.round(eOut[ei] * reg.restoreMin * (0.7 + r() * 0.6)),
            loadMW: eLoad[ei] / 10,
            detail: eOut[ei] > shown ? { fa: `${shown} رخداد اخیر از ${eOut[ei]}`, en: `latest ${shown} of ${eOut[ei]} events` } : undefined,
            children: events
          };
        });
        return {
          id: code, level: 'feeder' as const, name: { fa: `فیدر ${code}`, en: `Feeder ${code}` },
          customers: fCust[fi], outages: fOut[fi], loadMW: fLoad[fi] / 10,
          outageMin: equipment.reduce((a, e) => a + e.outageMin, 0), children: equipment
        };
      });
      return {
        id: `${reg.id}-D${di + 1}`, level: 'district' as const,
        name: { fa: `ناحیه ${fa}`, en: `${en} district` },
        customers: dCust[di], outages: dOut[di], loadMW: dLoad[di] / 10,
        outageMin: feeders.reduce((a, f) => a + f.outageMin, 0), children: feeders
      };
    });
    return {
      id: reg.id, level: 'region' as const, name: reg.name,
      customers: reg.customers, outages: reg.outages, loadMW: reg.peakMW,
      outageMin: districts.reduce((a, d) => a + d.outageMin, 0), children: districts
    };
  });
  return {
    id: 'SKED', level: 'company', name: { fa: 'شرکت توزیع برق جنوب کرمان', en: 'South Kerman EDC' },
    customers: regionNodes.reduce((a, x) => a + x.customers, 0),
    outages: regionNodes.reduce((a, x) => a + x.outages, 0),
    outageMin: regionNodes.reduce((a, x) => a + x.outageMin, 0),
    loadMW: regionNodes.reduce((a, x) => a + x.loadMW, 0),
    children: regionNodes
  };
}

export const networkTree: DrillNode = build();

export function findPath(root: DrillNode, ids: string[]): DrillNode[] {
  const path: DrillNode[] = [root];
  let cur = root;
  for (const id of ids) {
    const next = cur.children.find((c) => c.id === id);
    if (!next) break;
    path.push(next);
    cur = next;
  }
  return path;
}
