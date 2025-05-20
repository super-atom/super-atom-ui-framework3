import fs from 'fs';
import path from 'path';
import PATH from '../config/path.js';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlPlugins = generateHtmlPlugins('../src/views/pages');

export default {
  entry: {
    style: './src/js/style.js',
    common: './src/js/common.js',
    component: './src/js/component.js',
    guide: './src/js/guide.js',
  },
  target: ['web', 'es5'],
  output: {
    path: PATH.dist,
    filename: 'js/[name].bundle.js',
    chunkFilename: 'js/[name].bundle.js',
    clean: true,
    globalObject: 'self',
  },
  resolve: {
    extensions: ['.js', '.css', '.scss'],
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]',
        },
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/,
        type: 'asset',
        generator: {
          filename: 'assets/fonts/[name].[ext]',
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.hbs$/,
        use: [
          {
            loader: 'handlebars-loader',
            options: {
              precompileOptions: {
                knownHelpersOnly: false,
              },
              helperDirs: [path.join(__dirname, '../src/views/helpers')],
            },
          },
        ],
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
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
      fileName: 'assets.json',
      basePath: '/',
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/views/index.html', to: 'index.html' },
        { from: 'src/public', to: 'public' },
      ],
    }),
  ].concat(htmlPlugins),
};

function generateHtmlPlugins(templateDir) {
  function getAllHbsFiles(dir, fileList = []) {
    const files = fs.readdirSync(path.resolve(__dirname, dir));
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const absolutePath = path.resolve(__dirname, filePath);
      if (fs.statSync(absolutePath).isDirectory()) {
        getAllHbsFiles(filePath, fileList);
      } else if (file.endsWith('.hbs')) {
        fileList.push(filePath);
      }
    });
    return fileList;
  }

  const templateFiles = getAllHbsFiles(templateDir);
  return templateFiles.map((filePath) => {
    const name = path.basename(filePath, '.hbs');
    const jsonFilePath = path.resolve(
      __dirname,
      `../src/views/data/${name}.json`,
    );
    let json = null;
    if (fs.existsSync(jsonFilePath)) {
      try {
        const content = fs.readFileSync(jsonFilePath, 'utf8');
        json = content.trim() ? JSON.parse(content) : {};
      } catch (e) {
        console.warn(`Invalid JSON in ${jsonFilePath}:`, e.message);
        json = {};
      }
    }
    // 하위 디렉토리 구조를 filename에 반영
    const relativePath = filePath
      .replace(/^.*pages[\\/]/, '')
      .replace(/\.hbs$/, '.html');
    // guide 디렉토리 하위면 guide 번들 포함
    const isGuide = /[\\/]guide[\\/]/.test(filePath);
    const chunks = isGuide
      ? ['style', 'common', 'component', 'guide']
      : ['style', 'common', 'component'];
    return new HtmlWebpackPlugin({
      filename: `html/${relativePath}`,
      template: path.resolve(__dirname, filePath),
      templateParameters: json,
      minify: false,
      chunks,
    });
  });
}
