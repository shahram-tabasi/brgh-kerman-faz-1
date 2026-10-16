import type { Lang, Level } from '../types';

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toFaDigits(input: string): string {
  return input.replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

export function fmtNum(value: number, lang: Lang, digits = 0): string {
  const s = value.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
  return lang === 'fa' ? toFaDigits(s) : s;
}

export function fmtPct(value: number, lang: Lang, digits = 1): string {
  return `${fmtNum(value, lang, digits)}${lang === 'fa' ? '٪' : '%'}`;
}

/* ---------- Gregorian → Jalali (Persian calendar) ---------- */
function div(a: number, b: number) {
  return Math.floor(a / b);
}

export function toJalali(date: Date): {jy: number;jm: number;jd: number;} {
  const gy = date.getFullYear();
  const gm = date.getMonth() + 1;
  const gd = date.getDate();
  const gdm = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = gy <= 1600 ? 0 : 979;
  const gy2 = gy <= 1600 ? gy - 621 : gy - 1600;
  const gy3 = gm > 2 ? gy2 + 1 : gy2;
  let days =
  365 * gy2 +
  div(gy3 + 3, 4) -
  div(gy3 + 99, 100) +
  div(gy3 + 399, 400) -
  80 +
  gd +
  gdm[gm - 1];
  jy += 33 * div(days, 12053);
  days %= 12053;
  jy += 4 * div(days, 1461);
  days %= 1461;
  if (days > 365) {
    jy += div(days - 1, 365);
    days = (days - 1) % 365;
  }
  const jm = days < 186 ? 1 + div(days, 31) : 7 + div(days - 186, 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return { jy, jm, jd };
}

const JALALI_MONTHS = [
'فروردین',
'اردیبهشت',
'خرداد',
'تیر',
'مرداد',
'شهریور',
'مهر',
'آبان',
'آذر',
'دی',
'بهمن',
'اسفند'];


const EN_MONTHS = [
'Jan',
'Feb',
'Mar',
'Apr',
'May',
'Jun',
'Jul',
'Aug',
'Sep',
'Oct',
'Nov',
'Dec'];


export function fmtDate(date: Date, lang: Lang): string {
  if (lang === 'fa') {
    const { jy, jm, jd } = toJalali(date);
    return toFaDigits(
      `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`
    );
  }
  return `${date.getDate()} ${EN_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function fmtDateLong(date: Date, lang: Lang): string {
  if (lang === 'fa') {
    const { jy, jm, jd } = toJalali(date);
    return toFaDigits(`${jd} ${JALALI_MONTHS[jm - 1]} ${jy}`);
  }
  return `${date.getDate()} ${EN_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function fmtTime(date: Date, lang: Lang, withSeconds = true): string {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  const s = withSeconds ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`;
  return lang === 'fa' ? toFaDigits(s) : s;
}

export function fmtClock(value: string, lang: Lang): string {
  return lang === 'fa' ? toFaDigits(value) : value;
}

/* ---------- status styling ---------- */
export const levelColor: Record<Level, string> = {
  OK: '#34d399',
  WARN: '#f59e0b',
  CRIT: '#ef4444'
};

export const levelTone: Record<Level, 'ok' | 'warn' | 'crit'> = {
  OK: 'ok',
  WARN: 'warn',
  CRIT: 'crit'
};

/** Compact money in billion IRR, e.g. 1,240.5 */
export function fmtBn(value: number, lang: Lang): string {
  return fmtNum(value, lang, value >= 100 ? 0 : 1);
}
