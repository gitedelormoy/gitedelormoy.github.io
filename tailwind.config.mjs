/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Cormorant Garamond', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: 'hsl(150, 25%, 28%)',
          foreground: 'hsl(40, 30%, 97%)',
        },
        background: 'hsl(40, 30%, 97%)',
        foreground: 'hsl(150, 20%, 15%)',
        muted: {
          DEFAULT: 'hsl(40, 20%, 93%)',
          foreground: 'hsl(150, 10%, 45%)',
        },
        accent: 'hsl(38, 50%, 75%)',
        border: 'hsl(40, 20%, 88%)',
        card: 'hsl(40, 25%, 98%)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
