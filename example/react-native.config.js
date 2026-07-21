const path = require('path');
const packageJson = require('./package.json');

const pluginName = 'mapp-intelligence-reactnative-plugin';
const pluginSource = packageJson.dependencies[pluginName];
const usesLocalPlugin =
  pluginSource.startsWith('file:') || pluginSource.startsWith('workspace:');

module.exports = {
  dependencies: usesLocalPlugin
    ? {
        [pluginName]: {
          root: path.join(__dirname, '..'),
        },
      }
    : {},
};
