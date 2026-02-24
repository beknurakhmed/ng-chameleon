/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan both the playground and library source for class usage
  content: [
    './apps/playground/src/**/*.{html,ts,scss}',
    './packages/core/src/**/*.{html,ts,scss}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Map Tailwind theme to ng-chameleon CSS variables
        primary:   'var(--ch-primary)',
        secondary: 'var(--ch-secondary, var(--ch-text-muted))',
        success:   'var(--ch-success)',
        warning:   'var(--ch-warning)',
        error:     'var(--ch-error)',
        info:      'var(--ch-info)',
      },
      borderRadius: {
        sm:  'var(--ch-radius-sm)',
        DEFAULT: 'var(--ch-radius-md)',
        md:  'var(--ch-radius-md)',
        lg:  'var(--ch-radius-lg)',
        xl:  'var(--ch-radius-xl)',
        '2xl': 'var(--ch-radius-2xl)',
        full: 'var(--ch-radius-full)',
      },
      fontFamily: {
        sans:  ['var(--ch-font-body)'],
        mono:  ['var(--ch-font-mono)'],
      },
      boxShadow: {
        sm:  'var(--ch-shadow-sm)',
        DEFAULT: 'var(--ch-shadow-md)',
        md:  'var(--ch-shadow-md)',
        lg:  'var(--ch-shadow-lg)',
        xl:  'var(--ch-shadow-xl)',
      },
      transitionTimingFunction: {
        'ch-fast': 'var(--ch-easing)',
      },
    },
  },
  plugins: [],
};
