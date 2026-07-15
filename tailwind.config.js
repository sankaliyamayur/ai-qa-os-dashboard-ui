/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          card: 'var(--color-bg-card)',
        },
        text: {
          main: 'var(--color-text-main)',
          muted: 'var(--color-text-muted)',
          inverse: 'var(--color-text-inverse)',
        },
        accent: {
          primary: 'var(--color-accent-primary)',
          hover: 'var(--color-accent-hover)',
        },
        status: {
          success: 'var(--color-status-success)',
          warning: 'var(--color-status-warning)',
          error: 'var(--color-status-error)',
          info: 'var(--color-status-info)',
        }
      },
      spacing: {
        'xs': 'var(--spacing-xs)',
        'sm': 'var(--spacing-sm)',
        'md': 'var(--spacing-md)',
        'lg': 'var(--spacing-lg)',
        'xl': 'var(--spacing-xl)',
      },
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
      },
      boxShadow: {
        'flat-sm': 'var(--shadow-sm)',
        'flat-md': 'var(--shadow-md)',
        'flat-lg': 'var(--shadow-lg)',
      },
      transitionDuration: {
        'fast': 'var(--duration-fast)',
        'standard': 'var(--duration-standard)',
        'slow': 'var(--duration-slow)',
      },
      zIndex: {
        'dropdown': 'var(--z-index-dropdown)',
        'header': 'var(--z-index-header)',
        'sidebar': 'var(--z-index-sidebar)',
        'modal': 'var(--z-index-modal)',
        'tooltip': 'var(--z-index-tooltip)',
      }
    },
  },
  plugins: [],
}
