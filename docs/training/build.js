const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType, ShadingType,
  AlignmentType, HeadingLevel, PageBreak, BorderStyle, LevelFormat, Footer, Header, PageNumber
} = require('docx');

const SHOTS = process.argv[2];
const OUT = process.argv[3];
const BRAND = process.argv[4];
const FONT = { ascii: 'Vazirmatn', hAnsi: 'Vazirmatn', cs: 'Vazirmatn', eastAsia: 'Vazirmatn' };
const C = { navy: '0B1A2E', blue: '3B6FD1', orange: 'EE7F3B', grey: '5B6472', light: 'EEF3FB', warn: 'FFF4E5' };

const run = (text, o = {}) => new TextRun({ text, font: FONT, size: o.size || 22, sizeComplexScript: o.size || 22, bold: o.bold, boldComplexScript: o.bold, color: o.color, rightToLeft: true, italics: o.italics });

// parse **bold** in a string
function runs(text, o = {}) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((p) => p.startsWith('**') ? run(p.slice(2, -2), { ...o, bold: true }) : run(p, o));
}
const P = (text, o = {}) => new Paragraph({ bidirectional: true, alignment: o.align || AlignmentType.JUSTIFIED, spacing: { after: o.after ?? 120, line: 340 }, children: runs(text, o) });
const H1 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_1, bidirectional: true, pageBreakBefore: true, spacing: { before: 120, after: 200 }, border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: C.orange, space: 4 } }, children: [run(text, { size: 34, bold: true, color: C.navy })] });
const H2 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_2, bidirectional: true, spacing: { before: 240, after: 120 }, children: [run(text, { size: 27, bold: true, color: C.blue })] });
const H3 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_3, bidirectional: true, spacing: { before: 160, after: 80 }, children: [run(text, { size: 23, bold: true, color: C.navy })] });
const B = (text, level = 0) => new Paragraph({ bidirectional: true, numbering: { reference: 'bul', level }, spacing: { after: 60, line: 320 }, children: runs(text) });
const N = (text, ref) => new Paragraph({ bidirectional: true, numbering: { reference: ref, level: 0 }, spacing: { after: 60, line: 320 }, children: runs(text) });
let numSeq = 0;
const steps = (items) => { const ref = `num${numSeq++}`; numberingConfigs.push({ reference: ref, levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.START, style: { paragraph: { indent: { left: 540, hanging: 360 } }, run: { font: FONT } } }] }); return items.map((t) => N(t, ref)); };
const numberingConfigs = [{ reference: 'bul', levels: [
  { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.START, style: { paragraph: { indent: { left: 540, hanging: 300 } } } },
  { level: 1, format: LevelFormat.BULLET, text: '◦', alignment: AlignmentType.START, style: { paragraph: { indent: { left: 1000, hanging: 300 } } } }] }];

const box = (title, lines, fill = C.light, edge = C.blue) => new Table({
  visuallyRightToLeft: true, width: { size: 9360, type: WidthType.DXA }, columnWidths: [9360],
  rows: [new TableRow({ children: [new TableCell({
    width: { size: 9360, type: WidthType.DXA }, shading: { type: ShadingType.CLEAR, fill, color: 'auto' },
    margins: { top: 100, bottom: 100, left: 160, right: 160 },
    borders: { top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }, bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }, left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }, right: { style: BorderStyle.SINGLE, size: 24, color: edge } },
    children: [new Paragraph({ bidirectional: true, spacing: { after: 60 }, children: [run(title, { bold: true, color: edge })] }), ...lines.map((l) => P(l, { after: 40 }))]
  })] })]
});
const spacer = () => new Paragraph({ spacing: { after: 80 }, children: [] });

function table(head, rows, widths) {
  const total = widths.reduce((a, b) => a + b, 0);
  const cell = (t, i, header) => new TableCell({
    width: { size: widths[i], type: WidthType.DXA },
    shading: header ? { type: ShadingType.CLEAR, fill: C.navy, color: 'auto' } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({ bidirectional: true, children: runs(String(t), { size: 19, bold: header, color: header ? 'FFFFFF' : undefined }) })]
  });
  return new Table({
    visuallyRightToLeft: true, width: { size: total, type: WidthType.DXA }, columnWidths: widths,
    rows: [new TableRow({ tableHeader: true, children: head.map((h, i) => cell(h, i, true)) }), ...rows.map((r, ri) => new TableRow({ children: r.map((c, i) => {
      const tc = cell(c, i, false);
      return ri % 2 ? new TableCell({ ...tc.options, shading: { type: ShadingType.CLEAR, fill: 'F4F6FA', color: 'auto' } }) : tc;
    }) }))]
  });
}

function img(file, caption, w = 600) {
  const p = path.join(SHOTS, file);
  const data = fs.readFileSync(p);
  const h = Math.round(w * 1000 / 1600);
  return [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 40 }, children: [new ImageRun({ type: 'png', data, transformation: { width: w, height: h }, altText: { title: caption, description: caption, name: file } })] }),
    new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER, spacing: { after: 160 }, children: [run(caption, { size: 18, italics: true, color: C.grey })] })
  ];
}

const content = require('./content.js')({ P, H1, H2, H3, B, steps, box, table, img, spacer, C, run, runs });

// ---------- cover ----------
const logo = fs.readFileSync(path.join(BRAND, 'company-logo.png'));
const mascot = fs.readFileSync(path.join(BRAND, 'baba-barghi.png'));
const cover = [
  new Paragraph({ spacing: { before: 1200 }, alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: logo, transformation: { width: 120, height: 120 }, altText: { title: 'logo', description: 'company logo', name: 'logo' } })] }),
  new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER, spacing: { before: 300, after: 120 }, children: [run('شرکت توزیع نیروی برق جنوب استان کرمان', { size: 26, color: C.grey })] }),
  new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER, spacing: { after: 160 }, children: [run('راهنمای جامع آموزشی', { size: 52, bold: true, color: C.navy })] }),
  new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER, spacing: { after: 400 }, border: { bottom: { style: BorderStyle.SINGLE, size: 18, color: C.orange, space: 8 } }, children: [run('پلتفرم یکپارچه اطلاعات مدیریتی و عملیاتی', { size: 34, bold: true, color: C.blue })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200 }, children: [new ImageRun({ type: 'png', data: mascot, transformation: { width: 170, height: 170 }, altText: { title: 'Baba Barghi', description: 'mascot', name: 'mascot' } })] }),
  new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER, spacing: { before: 300 }, children: [run('ویژه مدیران، کارشناسان و راهبران سامانه — نسخه ۱٫۰ — مهر ۱۴۰۵', { size: 22, color: C.grey })] }),
  new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER, children: [run('همه اعداد نمایش‌داده‌شده در نرم‌افزار و این راهنما «نمایشی» هستند؛ مبنای آن‌ها در فصل ۹ آمده است.', { size: 19, color: C.orange })] }),
  new Paragraph({ children: [new PageBreak()] }),
  new Paragraph({ bidirectional: true, spacing: { after: 200 }, children: [run('فهرست مطالب', { size: 34, bold: true, color: C.navy })] }),
  ...[
    ['۱. معرفی نرم‌افزار', 'اصول طراحی، نقشه صفحات'],
    ['۲. نصب، اجرا و استقرار', 'اجرای محلی و روی سرور شرکت'],
    ['۳. آشنایی با محیط نرم‌افزار', 'نوار بالا، منو، زبان رنگ‌ها، اجزای تکرارشونده'],
    ['۴. داشبوردهای مدیریتی و عملیاتی (بند ۱۰)', 'مدیرعامل، بهره‌برداری، پروژه‌ها، مالی، مشترکین'],
    ['۵. پایش و تحلیل', 'شکست مسئله، هشدارها، شناسنامه شاخص، گزارش‌ها'],
    ['۶. داده و یکپارچه‌سازی', 'منابع، کیفیت داده، فرهنگ داده، معماری'],
    ['۷. پروژه', 'اجرای Pilot و ماتریس انطباق با شرح خدمات'],
    ['۸. سناریوهای کاری گام‌به‌گام', 'شش تمرین عملی'],
    ['۹. داده‌های نرم‌افزار', 'منبع و میزان واقعی بودن اعداد'],
    ['۱۰. راهنمای راهبر', 'تغییر داده‌ها، حدود و افزودن شاخص'],
    ['۱۱. واژه‌نامه', ''],
    ['۱۲. پرسش‌های متداول', ''],
    ['۱۳. چک‌لیست تسلط بر نرم‌افزار', '']].map(([t, d]) => new Paragraph({ bidirectional: true, spacing: { after: 140 }, border: { bottom: { style: BorderStyle.DOTTED, size: 4, color: 'C8CFDA', space: 4 } }, children: [run(t, { bold: true, size: 24, color: C.navy }), ...(d ? [run('   —   ' + d, { size: 20, color: C.grey })] : [])] }))
];

const doc = new Document({
  creator: 'Integrated Information Platform',
  title: 'راهنمای آموزشی پلتفرم یکپارچه اطلاعات',
  features: { updateFields: true },
  styles: {
    default: { document: { run: { font: FONT, size: 22 }, paragraph: { } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 34, bold: true, color: C.navy }, paragraph: { outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 27, bold: true, color: C.blue }, paragraph: { outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 23, bold: true, color: C.navy }, paragraph: { outlineLevel: 2 } }]
  },
  numbering: { config: numberingConfigs },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1300, bottom: 1200, left: 1270, right: 1270 } } },
    headers: { default: new Header({ children: [new Paragraph({ bidirectional: true, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.blue, space: 4 } }, children: [run('راهنمای آموزشی — پلتفرم یکپارچه اطلاعات مدیریتی و عملیاتی | توزیع برق جنوب کرمان', { size: 16, color: C.grey })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: ['صفحه ', PageNumber.CURRENT], font: FONT, size: 16, color: C.grey, rightToLeft: true })] })] }) },
    children: [...cover, ...content]
  }]
});

Packer.toBuffer(doc).then((b) => { fs.writeFileSync(OUT, b); console.log('written', OUT, b.length); });
