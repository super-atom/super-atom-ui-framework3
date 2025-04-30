import fs from "fs";
import path from "path";
import PATH from "../config/path.js";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import { WebpackManifestPlugin } from "webpack-manifest-plugin";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlPlugins = generateHtmlPlugins("../src/views/pages");

export default {
  entry: {
    style: "./src/js/style.js",
    common: "./src/js/common.js",
    component: "./src/js/component.js",
  },
  target: ["web", "es5"],
  output: {
    path: PATH.dist,
    filename: "[name].bundle.js",
    chunkFilename: "[name].bundle.js",
    clean: true,
    globalObject: "self",
  },
  resolve: {
    extensions: [".js", ".css", ".scss"],
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[name][ext]",
        },
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/,
        type: "asset",
        generator: {
          filename: "assets/fonts/[name].[ext]",
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.hbs$/,
        use: [
          {
            loader: "handlebars-loader",
            options: {
              precompileOptions: {
                knownHelpersOnly: false,
              },
              helperDirs: path.join(__dirname, "../src/views/helpers"),
            },
          },
        ],
      },
    ],
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },

  plugins: [
    new WebpackManifestPlugin({
      fileName: "assets.json",
      basePath: "/",
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "src", to: "./" }],
    }),
  ].concat(htmlPlugins),
};

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map((item) => {
    const parts = item.split(".");
    const name = parts[0];
    const extension = parts[1];

    let json = null;
    if (
      fs.existsSync(path.resolve(__dirname, `../src/views/data/${name}.json`))
    ) {
      const jsonFile = fs.readFileSync(
        path.resolve(__dirname, `../src/views/data/${name}.json`),
        "utf8"
      );
      json = JSON.parse(jsonFile);
    }

    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      templateParameters: json,
      minify: false,
      chunks: ["style", "common", "component"],
    });
  });
}
