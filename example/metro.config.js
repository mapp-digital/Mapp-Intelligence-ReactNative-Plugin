const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const fs = require('fs');
const path = require('path');
const escape = require('escape-string-regexp');
const exclusionList =
  require('metro-config/private/defaults/exclusionList').default;
const libraryPackage = require('../package.json');

const root = path.resolve(__dirname, '..');
const localNodeModules = path.join(__dirname, 'node_modules');
const rootNodeModules = path.join(root, 'node_modules');
const localTransformer = path.join(
  localNodeModules,
  '@react-native',
  'metro-babel-transformer',
  'src',
  'index.js'
);
const nodeModules = fs.existsSync(localTransformer)
  ? localNodeModules
  : rootNodeModules;
const inactiveNodeModules =
  nodeModules === localNodeModules ? rootNodeModules : localNodeModules;
const modules = Object.keys({ ...libraryPackage.peerDependencies });

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  watchFolders: [root],

  // We need to make sure that only one version is loaded for peerDependencies
  // So we block them at the root, and alias them to the versions in example's node_modules
  resolver: {
    blockList: exclusionList(
      modules.map(
        (m) =>
          new RegExp(`^${escape(path.join(inactiveNodeModules, m))}\\/.*$`)
      )
    ),

    extraNodeModules: modules.reduce((acc, name) => {
      acc[name] = path.join(nodeModules, name);
      return acc;
    }, {}),
  },

  transformer: {
    babelTransformerPath: path.join(
      nodeModules,
      '@react-native',
      'metro-babel-transformer',
      'src',
      'index.js'
    ),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
