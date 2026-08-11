/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ide: {
          bg: '#1e1e1e',
          sidebar: '#252526',
          active: '#37373d',
          hover: '#2a2d2e',
          text: '#d4d4d4',
          muted: '#858585',
          border: '#333333',
          accent: '#007acc',
        },
        dracula: {
          bg: '#282a36',
          sidebar: '#21222c',
          active: '#44475a',
          hover: '#383a59',
          text: '#f8f8f2',
          muted: '#6272a4',
          border: '#44475a',
          accent: '#bd93f9',
        },
        cyberpunk: {
          bg: '#0f051d',
          sidebar: '#1a0933',
          active: '#2e1159',
          hover: '#250d44',
          text: '#00ffcc',
          muted: '#ff007f',
          border: '#ff007f',
          accent: '#ff007f',
        },
        github: {
          bg: '#ffffff',
          sidebar: '#f6f8fa',
          active: '#eaeef2',
          hover: '#f0f3f6',
          text: '#24292e',
          muted: '#586069',
          border: '#e1e4e8',
          accent: '#0366d6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
