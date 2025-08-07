// tailwind.config.ts

import type { Config } from 'tailwindcss'; // Виправлений рядок!

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}', // ЗМІНЕНО: додано './src/'
    './src/components/**/*.{js,ts,jsx,tsx,mdx}', // ЗМІНЕНО: додано './src/'
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',     // ЗМІНЕНО: додано './src/'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;