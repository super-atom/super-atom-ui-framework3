export default {
  plugins: {
    'postcss-preset-env': {
      stage: 0,
      features: { 'nesting-rules': false },
    },
    'postcss-import': {},
    'postcss-mixins': {},
    'postcss-extend-rule': {},
    'postcss-flexbugs-fixes': {},
    'postcss-sort-media-queries': {},
    '@tailwindcss/postcss': {},
    'postcss-nested': {},
    'css-declaration-sorter': { order: 'concentric-css' },
    autoprefixer: {},
  },
};
