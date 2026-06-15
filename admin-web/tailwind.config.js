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
        primary: {
          50:  '#F0F4FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          DEFAULT: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        success: { DEFAULT: '#10B981', soft: '#D1FAE5' },
        warning: { DEFAULT: '#F59E0B', soft: '#FEF3C7' },
        error:   { DEFAULT: '#EF4444', soft: '#FEE2E2' },
        dark: {
          bg: '#09090B', surf: '#18181B', card: '#27272A',
          elev: '#3F3F46', border: '#3F3F46', text: '#FAFAFA', sub: '#A1A1AA',
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", 'sans-serif'],
        serif: ["'DM Serif Display'", 'serif'],
      },
      borderRadius: {
        xs: '4px', sm: '6px', md: '8px', base: '10px',
        lg: '12px', xl: '14px', '2xl': '16px', '3xl': '20px',
      },
    },
  },
  plugins: [],
}
