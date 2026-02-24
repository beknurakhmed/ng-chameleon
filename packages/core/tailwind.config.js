/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,html}'],
  theme: {
    extend: {
      colors: {
        'ch-primary': 'var(--ch-primary)',
        'ch-primary-hover': 'var(--ch-primary-hover)',
        'ch-primary-subtle': 'var(--ch-primary-subtle)',
        'ch-secondary': 'var(--ch-secondary)',
        'ch-success': 'var(--ch-success)',
        'ch-warning': 'var(--ch-warning)',
        'ch-error': 'var(--ch-error)',
        'ch-info': 'var(--ch-info)',
        'ch-bg': 'var(--ch-bg)',
        'ch-bg-subtle': 'var(--ch-bg-subtle)',
        'ch-bg-elevated': 'var(--ch-bg-elevated)',
        'ch-text': 'var(--ch-text)',
        'ch-text-subtle': 'var(--ch-text-subtle)',
        'ch-text-muted': 'var(--ch-text-muted)',
        'ch-border': 'var(--ch-border)',
      },
      borderRadius: {
        'ch-sm': 'var(--ch-radius-sm)',
        'ch-md': 'var(--ch-radius-md)',
        'ch-lg': 'var(--ch-radius-lg)',
        'ch-xl': 'var(--ch-radius-xl)',
        'ch-full': 'var(--ch-radius-full)',
      },
      boxShadow: {
        'ch-sm': 'var(--ch-shadow-sm)',
        'ch-md': 'var(--ch-shadow-md)',
        'ch-lg': 'var(--ch-shadow-lg)',
      },
      fontFamily: {
        'ch-body': 'var(--ch-font-body)',
        'ch-heading': 'var(--ch-font-heading)',
        'ch-mono': 'var(--ch-font-mono)',
      },
      transitionTimingFunction: {
        'ch': 'var(--ch-transition)',
      },
    },
  },
  plugins: [],
};
