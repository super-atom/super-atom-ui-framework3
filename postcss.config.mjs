export default {
  plugins: {
    'postcss-mixins': {},
    'postcss-preset-env': {
      stage: 0,
      features: { 'nesting-rules': false },
    },
    'postcss-import': {},
    'postcss-extend-rule': {},
    'postcss-flexbugs-fixes': {},
    'postcss-sort-media-queries': {},
    '@tailwindcss/postcss': {},
    'postcss-nested': {},
    'css-declaration-sorter': { order: 'smacss' },
    autoprefixer: {},
  },
};
