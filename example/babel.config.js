const path = require('path');
const pak = require('../package.json');
const examplePackage = require('./package.json');

const pluginSource = examplePackage.dependencies[pak.name];
const usesLocalPlugin =
  pluginSource.startsWith('file:') || pluginSource.startsWith('workspace:');

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: usesLocalPlugin
    ? [
        [
          'module-resolver',
          {
            extensions: ['.tsx', '.ts', '.js', '.json'],
            alias: {
              [pak.name]: path.join(__dirname, '..', pak.source),
            },
          },
        ],
      ]
    : [],
};
