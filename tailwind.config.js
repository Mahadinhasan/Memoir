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
        memoir: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
          teal: '#52A5B8',
          dusk: '#355C7D',
          midnight: '#0b1329',
          paper: '#faf7f2',
          clay: '#f3f4f8'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['Space Mono', 'JetBrains Mono', 'monospace'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        // Neomorphism
        'neo-raised': '6px 6px 14px rgba(163, 177, 198, 0.45), -6px -6px 14px rgba(255, 255, 255, 0.85)',
        'neo-raised-dark': '6px 6px 14px rgba(5, 10, 24, 0.7), -6px -6px 14px rgba(30, 42, 70, 0.25)',
        'neo-pressed': 'inset 4px 4px 8px rgba(163, 177, 198, 0.5), inset -4px -4px 8px rgba(255, 255, 255, 0.85)',
        'neo-pressed-dark': 'inset 4px 4px 8px rgba(3, 7, 18, 0.8), inset -4px -4px 8px rgba(30, 42, 70, 0.3)',
        // Claymorphism
        'clay-card': 'inset -6px -6px 12px rgba(0, 0, 0, 0.08), inset 6px 6px 12px rgba(255, 255, 255, 0.7), 10px 14px 28px rgba(0, 0, 0, 0.08)',
        'clay-btn': 'inset -3px -3px 6px rgba(0, 0, 0, 0.1), inset 3px 3px 6px rgba(255, 255, 255, 0.8), 4px 8px 16px rgba(14, 165, 233, 0.25)',
        // Brutalism
        'brutal': '4px 4px 0px 0px #000000',
        'brutal-lg': '6px 6px 0px 0px #000000',
        'brutal-sm': '2px 2px 0px 0px #000000',
        'brutal-color': '4px 4px 0px 0px #0284c7',
        // Skeuomorphism (polaroid realistic physical drop shadow)
        'skeuo-photo': '0 1px 3px rgba(0,0,0,0.12), 0 8px 24px -4px rgba(0,0,0,0.18), 0 20px 40px -8px rgba(0,0,0,0.15)',
        // Liquid Glass
        'liquid-glow': '0 8px 32px 0 rgba(82, 165, 184, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.6)',
        'spatial-float': '0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      },
      borderRadius: {
        'clay': '28px',
        'squircle': '22px',
      }
    },
  },
  plugins: [],
}
