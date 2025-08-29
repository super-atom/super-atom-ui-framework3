<!-- https://code.visualstudio.com/docs/copilot/copilot-customization -->

# Code Conventions

## Styling

- All styling uses TailwindCSS utility classes.
- Class order: smacss.
- Use px as unit via TailwindCSS's feature 'arbitrary variants'.
- If there are CSS variables defined in @theme , the set variables will be used instead of 'arbitrary variants'.
- Use the values ​​defined in @theme as the highest priority, but use them according to tailwindCSS syntax. For example, write text-\[var(--color-gray-50)\] as text-gray-50.
- When using colors, do not use the TailwindCSS default colors, but use those defined for @theme.
- Use TailwindCSS class merging via `twMerge` helper for conditional styling.

## Documentation

- When answering questions about frameworks, libraries, or APIs, use Context7 to retrieve current documentation rather than relying on training data.

## File Structure & Naming

- Use kebab-case for file and directory names.
- Template files use `.hbs` extension for Handlebars.
- Place page-specific data in `src/views/data/{pageName}.json`.
- Organize templates: `pages/` for main templates, `partials/` and `components/` for reusable components, `layouts/` for page layouts.
- Helper functions go in `src/views/helpers/` and must be exported as default functions.

## Template Development

- Use semantic HTML5 elements.
- Include proper meta tags via `{{> ../partials/meta}}` partial.
- Load assets via `{{> ../partials/link}}` and `{{> ../partials/script}}` partials.
- Handlebars helpers should handle one specific task and be reusable.
- Use `{{#each}}` for iterations and `{{#if}}` for conditionals.

## JavaScript

- Use ES6+ features and modules.
- Organize code: `common.js` for shared functionality, `component.js` for UI components.
- Use descriptive variable and function names.
- Add console logs for debugging but remove in production code.
- When writing comments, please write them in Korean.
- When writing functions, add jsdoc comments.

## CSS & Styling

- Avoid custom CSS when TailwindCSS utilities are available.
- Use CSS custom properties for dynamic values.
- Use logical properties when appropriate (e.g., `margin-inline` instead of `margin-left/right`).

## Performance & Optimization

- Optimize images and use appropriate formats (WebP when possible).
- Minimize bundle size by code splitting when necessary.
- Use semantic chunk names in webpack configuration.

## Code Quality

- Follow ESLint configuration rules.
- Use meaningful commit messages.
- Write self-documenting code with clear variable names.
- Avoid deeply nested conditions (max 3 levels).
- Extract reusable logic into helper functions.

## Environment & Build

- Use environment-specific configurations via `config/env.js`.
- Separate development and production webpack configurations.
- Use PostCSS plugins for CSS processing and optimization.
- Enable hot module replacement in development mode.
