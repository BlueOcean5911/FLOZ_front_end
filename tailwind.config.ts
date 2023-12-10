import type { Config } from "tailwindcss";
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    boxShadow: {
      sm: '0px 2px 2px rgb(15 23 42 / 0.08)',
      md: '0px 4px 4px rgba(1,1,1,0.5)',
      lg: '0 8px 15px rgb(15 23 42 / 0.08), 0 3px 6px rgb(15 23 42 / 0.08)',
      xl: '2px 11px 16px rgb(15 23 42 / 0.17), 0 1px 6px rgb(15 23 42 / 0.17), 3px 23px 24px rgb(15 23 42 / 0.17)',
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.5rem' }],
      base: ['1rem', { lineHeight: '2rem' }],
      lg: ['1.125rem', { lineHeight: '2rem' }],
      xl: ['1.25rem', { lineHeight: '2rem' }],
      '2xl': ['1.375rem', { lineHeight: '2rem' }],
      '3xl': ['1.5rem', { lineHeight: '2rem' }],
      '4xl': ['2rem', { lineHeight: '2.5rem' }],
      '5xl': ['3.5rem', { lineHeight: '1' }],
      '6xl': ['4rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],
    },
    extend: {
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
        '6xl': '5rem',
      },
      fontFamily: {
        'sans': ['Segoe UI', 'Arial', 'sans-serif'],
        // sans: 'var(--font-inter)',
        display: ['Cabinet Grotesk', ...defaultTheme.fontFamily.sans],
      },
      backgroundColor: {
        'tone': '#349989',
        'lightTone' : '#DDF1EE'
      },
      borderColor: {
        'tone': '#349989'
      },
      stroke: {
        'tone' : '#349989'
      },
      textColor: {
        'tone': '#349989',
        'link': '#0B5CAB'
      },
      boxShadow: {
        'blue' : '0px 0px 2px 2px #1B96FF',
        'dark' : '0px 0px 4px 4px #808080',
      },
      transition: {
        'width' : 'width 0.2s ease-in-out',
      }
    },
  },
} satisfies Config;
