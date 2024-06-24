/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', 'node_modules/preline/dist/*.js'],
  darkMode: 'class',
  theme: {
    fontSize: {
      '2xs': ['0.75rem', { lineHeight: '1.25rem' }],
      xs: ['0.8125rem', { lineHeight: '1.5rem' }],
      sm: ['0.875rem', { lineHeight: '1.5rem' }],
      base: ['1rem', { lineHeight: '1.75rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],
    },

    extend: {
      fontFamily: {
        jinbu: '"DingTalk_JinBuTi_Regular", sans-serif',
        nunito: '"Nunito", sans-serif',
      },
      maxWidth: {
        lg: '33rem',
        '2xl': '40rem',
        '3xl': '50rem',
        '5xl': '66rem',
        '8xl': '88rem',
      },
      colors: {
        primary: '#00A76F',
        'primary-1': '#C9FAD6',
        'primary-2': '#5CE49B',
        'primary-3': '#007868',
        'primary-4': '#004B51',
        secondary: '#8F33FF',
        'secondary-1': '#EFD6FF',
        'secondary-2': '#C685FF',
        'secondary-3': '#5119B7',
        'secondary-4': '#27097A',
        'grey-100': '#F9FAFB',
        'grey-200': '#F5F6F8',
        'grey-300': '#DFE3E8',
        'grey-400': '#C5CDD5',
        'grey-500': '#919EAB',
        'grey-600': '#637381',
        'grey-700': '#454F5B',
        'grey-800': '#212B37',
        'grey-900': '#161C24',
        tertiary: '#4B5563',
        quaternary: '#E4E7EB',
        'hight-class-gray': '#202937',
        'hight-class-gray-1': '#4B5563',
        'hight-class-green': '#0B9488',
        'hight-class-green-1': '#15B8A6',
      },
      opacity: {
        1: '0.01',
        2.5: '0.025',
        7.5: '0.075',
        15: '0.15',
      },
      scale: {
        175: '1.75',
      },
      backgroundImage: {
        'world-map': "url('/src/assets/svg/world-map.svg')",
        dot: "url('/src/assets/svg/dot.svg')",
        'hero-blur': "url('/src/assets/images/background-newsletter.488a0204.jpg')",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('preline/plugin'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
  ],
}
