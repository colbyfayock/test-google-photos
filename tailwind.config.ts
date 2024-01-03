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
        mytheme: {
          "primary": "#0d9aff",
          "neutral": colors.slate['500']
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
