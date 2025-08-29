import fs from 'fs';
import path from 'path';
import PATH from '../config/path.js';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlPlugins = generateHtmlPlugins('../src/views/pages');

export default {
  entry: {
    style: './src/assets/js/style.js',
    guide: './src/assets/js/guide.js',
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
        { from: 'src/views/index.css', to: 'index.css' },
        { from: 'src/views/index.js', to: 'index.js' },
        { from: 'src/assets', to: 'assets' },
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

    let chunks = ['style'];
    if (isGuide) {
      chunks = ['style', 'guide'];
    }

    // 환경변수 및 상대경로 추가
    const normalizedPath = relativePath.replace(/\\/g, '/'); // Windows 경로 구분자 정규화
    const depth = normalizedPath.includes('/')
      ? normalizedPath.split('/').length - 1
      : 0;

    // 빌드된 파일들이 html/ 폴더에 위치하므로 모든 파일에 +1 depth 적용
    const actualDepth = depth + 1;

    // 각 스크립트의 개별 경로 계산
    const scriptBasePath = '../'.repeat(actualDepth) + 'assets/js/';

    const templateParameters = {
      ...json,
      isDev: process.env.NODE_ENV === 'development',
      relativePath: relativePath,
      scriptPath: {
        common: `${scriptBasePath}common.js`,
        component: `${scriptBasePath}component.js`,
      },
    };

    return new HtmlWebpackPlugin({
      filename: `html/${relativePath}`,
      template: path.resolve(__dirname, filePath),
      templateParameters,
      minify: false,
      chunks,
    });
  });
}
