/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Flattens nested CSS (the stageshow kit and the homepage demos use it)
    // before Tailwind, so every browser and the production minifier get
    // plain rules.
    "tailwindcss/nesting": {},
    tailwindcss: {},
  },
};

export default config;
