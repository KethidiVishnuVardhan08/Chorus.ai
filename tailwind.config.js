/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        espresso: '#2A1D16',
        'espresso-dark': '#4A3426',
        latte: '#D9C3B0',
        cream: '#F3EADE',
        clay: '#D98B82',
        'clay-dark': '#C47B72',
        ink: '#1A1512',
        muted: '#6B5D52',
        plum: '#1E1A2E',
        'plum-light': '#2D2845',
      },
      fontFamily: {
        display: ['General Sans', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        pill: '999px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(42,29,22,0.08), 0 1px 3px rgba(42,29,22,0.06)',
        'card-hover': '0 8px 32px rgba(42,29,22,0.14), 0 2px 8px rgba(42,29,22,0.1)',
        'warm': '0 4px 20px rgba(217,139,130,0.15)',
      },
      spacing: {
        section: '96px',
      },
      backgroundImage: {
        'gradient-espresso': 'linear-gradient(135deg, #2A1D16 0%, #4A3426 100%)',
        'gradient-cream': 'radial-gradient(ellipse at top, #f3eade 0%, #ede5d8 100%)',
        'gradient-warm': 'radial-gradient(ellipse at center, rgba(217,139,130,0.08) 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
}
