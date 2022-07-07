/* 
  Explore configuration options docs https://tailwindcss.com/docs/configuration#configuration-options
  Or check the default configuration https://unpkg.com/browse/tailwindcss@latest/stubs/defaultConfig.stub.js
*/

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {
        '1/5': '20%',
        '1/2': '50%',
        '1/1': '100%'
      },
      width: {
        '1/2vw': '50vw'
      },
      height: {
        '1/4vw': '40vw'
      },
      maxHeight: {
        '9/10vh': '90vh'
      },
      colors: {
        'deep-purple': '#1a065b'
      }
    }
  },
  plugins: []
}
