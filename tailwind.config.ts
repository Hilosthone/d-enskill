import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class', // This tells Tailwind to watch for the .dark class
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Add your custom colors here
        dark: '#1a1a1a',
        'primary-red': '#E11D48',
        'primary-blue': '#2563EB',
      },
    },
  },
  plugins: [],
}
export default config
