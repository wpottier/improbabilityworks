/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Studio palette (cosmic)
        ink: {
          deep: '#050814',
          night: '#0B0E26',
        },
        portal: {
          blue: '#2B4DDB',
          violet: '#6B3FD4',
          cyan: '#8FD0FF',
        },
        gold: {
          warm: '#D4AF6A',
          bright: '#F5D98E',
        },
        silver: {
          cool: '#C9CDD6',
        },
        parchment: '#F2E8D0',
        // Velvet Door palette (speakeasy)
        velvet: {
          noir: '#0A0605',
          burgundy: '#4A1420',
          gold: '#C9A875',
          ivory: '#EDE4D0',
        },
      },
      fontFamily: {
        display: ['"Fraunces Variable"', 'Fraunces', 'ui-serif', 'Georgia', 'serif'],
        deco: ['"Cinzel"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Manrope Variable"', 'Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: {
        'display-tight': '-0.02em',
        'deco-wide': '0.18em',
      },
      screens: {
        xs: '375px',
      },
      animation: {
        'portal-breathe': 'portalBreathe 12s ease-in-out infinite alternate',
        'twinkle-slow': 'twinkle 8s ease-in-out infinite',
        'twinkle-mid': 'twinkle 11s ease-in-out infinite',
        'twinkle-fast': 'twinkle 6s ease-in-out infinite',
        'float-up': 'floatUp 700ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fadeIn 600ms ease-out both',
        'scroll-cue': 'scrollCue 2.4s ease-in-out infinite',
      },
      keyframes: {
        portalBreathe: {
          '0%': { transform: 'scale(1)', opacity: '0.85' },
          '100%': { transform: 'scale(1.035)', opacity: '1' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.15', transform: 'translateY(0)' },
          '50%': { opacity: '0.9', transform: 'translateY(-6px)' },
        },
        floatUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scrollCue: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '50%': { transform: 'translateY(6px)', opacity: '0.8' },
        },
      },
      backgroundImage: {
        'hero-portal':
          'radial-gradient(circle at 65% 45%, rgba(143,208,255,0.22) 0%, rgba(107,63,212,0.28) 25%, rgba(43,77,219,0.12) 48%, transparent 72%)',
        'ink-fade':
          'linear-gradient(180deg, #050814 0%, #070B1C 40%, #0B0E26 100%)',
        'velvet-fade':
          'linear-gradient(180deg, #0A0605 0%, #160808 45%, #1F0C10 100%)',
        'deco-stripe':
          'repeating-linear-gradient(45deg, rgba(201,168,117,0.08) 0 1px, transparent 1px 12px)',
      },
    },
  },
  plugins: [],
};
