const config = {
	darkMode: 'class', // Enable dark mode using the 'class' strategy
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
	  extend: {}
	},
	plugins: [
	  require('@tailwindcss/typography'),
	  require("flowbite/plugin")
	]
  };
  
  module.exports = config;