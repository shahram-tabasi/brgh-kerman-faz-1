export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#04060b',
          900: '#070a11',
          850: '#0a0e17',
          800: '#0d121d',
          750: '#111827',
          700: '#18202f',
          650: '#1f2937',
          600: '#2a3547',
        },
        navy: {
          900: '#081221',
          800: '#0b1a2e',
          700: '#102541',
          600: '#16334f',
        },
        line: {
          DEFAULT: 'rgba(148,163,184,0.14)',
          strong: 'rgba(148,163,184,0.28)',
        },
        elec: {
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
        signal: {
          ok: '#34d399',
          warn: '#f59e0b',
          crit: '#ef4444',
          off: '#64748b',
          forecast: '#a78bfa',
        },
      },
      fontFamily: {
        fa: ['"B Nazanin"', 'BNazanin', 'Vazirmatn', 'Tahoma', 'sans-serif'],
        en: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'Vazirmatn', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '70%': { transform: 'scale(1.6)', opacity: '0' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        flowDash: {
          to: { strokeDashoffset: '-24' },
        },
      },
      animation: {
        pulseRing: 'pulseRing 2s cubic-bezier(0.23, 1, 0.32, 1) infinite',
        scanline: 'scanline 2.4s linear infinite',
        flowDash: 'flowDash 1s linear infinite',
      },
    },
  },
}
