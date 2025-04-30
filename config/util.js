import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const cssLoaders = [
  {
    loader: "css-loader",
    options: {
      importLoaders: 1,
      sourceMap: true,
    },
  },
  {
    loader: "postcss-loader",
    options: {
      postcssOptions: {
        config: path.resolve(__dirname, "../postcss.config.mjs"),
      },
    },
  },
];
