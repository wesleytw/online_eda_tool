module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{jsx,html,js}',
    './src/components/**/*.{jsx,html,js}',
    './node_modules/flowbite/**/*.js',
    './node_modules/tw-elements/dist/js/**/*.js'
  ],
  theme: {
    extend: {
      screens: {
        mf: "990px",
      },
      keyframes: {
        "slide-in": {
          "0%": {
            "-webkit-transform": "translateX(120%)",
            transform: "translateX(120%)",
          },
          "100%": {
            "-webkit-transform": "translateX(0%)",
            transform: "translateX(0%)",
          },
        },
      },
      animation: {
        "slide-in": "slide-in 0.5s ease-out",
      },
      fontFamily: {
        display: ["Open Sans", "sans-serif"],
        body: ["Open Sans", "sans-serif"],
        PlasticBeach: ["PlasticBeach", "sans-serif"],
        BADABB: ["BADABB", "sans-serif"]
      },
    },
  },
  ///add from project_web3///
  variants: {
    extend: {},
  },

  plugins: [
    // require("@tailwindcss/forms")
    // require('flowbite/plugin'),
    // require('tw-elements/dist/plugin')
    require('daisyui')
  ],
  daisyui: {
    base: false,
    themes: [
      {
        mytheme: {
          "primary": "#000",
          "secondary": "#c9384b",
          "accent": "#444",
          "neutral": "#e4e7eb",
          "base-100": "#EAE5EB",
          // "info": "#0057ff",
          "info": "#d2fce2",
          "success": "#15935A",
          "warning": "#F0AB0A",
          "error": "#fdd7e4",
          // "error": "#3b82f680",
          
        },
      }
    ]
  }
}
