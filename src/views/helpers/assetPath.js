export default function assetPath(type, path, options) {
  const { depth = 0 } = options.data.root;
  const basePath = '../'.repeat(depth + 1) + 'assets/';

  const typePaths = {
    js: 'js/',
    css: 'css/',
    lib: 'libs/',
    image: 'images/',
    font: 'fonts/',
  };

  const fullPath = typePaths[type]
    ? basePath + typePaths[type] + path
    : basePath + path;
  return fullPath;
}
