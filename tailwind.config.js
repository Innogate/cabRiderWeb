// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        theme: {
          light: {
            primary: '#007bff', // blue
            background: '#ffffff',
            surface: '#f8f9fa',
            text: '#212529',
          },
          dark: {
            primary: '#3399ff',
            background: '#121212',
            surface: '#1e1e1e',
            text: '#f1f1f1',
          },
        }
      }
    }
  },
  plugins: [],
}
