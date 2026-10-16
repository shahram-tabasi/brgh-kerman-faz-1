import type { Tx } from '../types';

/** Deterministic PRNG so demo data is stable between reloads. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = s + 0x6d2b79f5 >>> 0;
    let t = s;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export function round(v: number, digits = 1) {
  const f = 10 ** digits;
  return Math.round(v * f) / f;
}

/** Rolling 12-month window ending Mehr 1405. */
export const MONTHS: Tx[] = [
{ fa: 'آبان ۰۴', en: 'Aban 04' },
{ fa: 'آذر ۰۴', en: 'Azar 04' },
{ fa: 'دی ۰۴', en: 'Dey 04' },
{ fa: 'بهمن ۰۴', en: 'Bahman 04' },
{ fa: 'اسفند ۰۴', en: 'Esfand 04' },
{ fa: 'فروردین ۰۵', en: 'Farvardin 05' },
{ fa: 'اردیبهشت ۰۵', en: 'Ordibehesht 05' },
{ fa: 'خرداد ۰۵', en: 'Khordad 05' },
{ fa: 'تیر ۰۵', en: 'Tir 05' },
{ fa: 'مرداد ۰۵', en: 'Mordad 05' },
{ fa: 'شهریور ۰۵', en: 'Shahrivar 05' },
{ fa: 'مهر ۰۵', en: 'Mehr 05' }];


/** Seasonal shape of South Kerman demand (hot summer, agricultural wells). */
export const SEASON = [0.62, 0.55, 0.52, 0.54, 0.6, 0.68, 0.8, 0.92, 1.0, 0.98, 0.88, 0.74];

/** Build a 12-month series around a base value with seasonality and noise. */
export function series(base: number, seed: number, opts: {season?: number;noise?: number;drift?: number;} = {}) {
  const r = rng(seed);
  const { season = 0, noise = 0.05, drift = 0 } = opts;
  return SEASON.map((s, i) => {
    const seasonal = 1 + season * (s - 0.74);
    const d = 1 + drift * (i - 11) / 11;
    return round(base * seasonal * d * (1 + (r() - 0.5) * 2 * noise), 2);
  });
}

export const DATA_AS_OF: Tx = { fa: '۱۴۰۵/۰۷/۲۳ — ۰۸:۰۰', en: '2026-10-15 08:00' };
