import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0d9aff'
      }
    }
  },
  daisyui: {
    themes: [
      {
        // Extends Light: https://github.com/saadeghi/daisyui/blob/master/src/theming/themes.js#L190
        mytheme: {
          "color-scheme": "light",
          "primary": "#0d9aff",
          "secondary": "oklch(69.71% 0.329 342.55)",
          "secondary-content": "oklch(98.71% 0.0106 342.55)",
          "accent": "oklch(76.76% 0.184 183.61)",
          "neutral": colors.slate['500'],
          "neutral-content": "#D7DDE4",
          "base-100": "oklch(100% 0 0)",
          "base-200": "#F2F2F2",
          "base-300": "#E5E6E6",
          "base-content": "#1f2937",
        },
      },
      "dark"
    ],
  },
  plugins: [
    require('@tailwindcss/forms'),
    require("daisyui"),
  ],
}
export default config
