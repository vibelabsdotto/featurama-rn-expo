const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Keep local SDK source edits live while forcing all runtime deps to resolve
// from this app's node_modules to avoid duplicate React/React Native instances.
const sdkPath = path.resolve(projectRoot, '..');
const appNodeModules = path.resolve(projectRoot, 'node_modules');
const reactNativeNodeModules = path.resolve(
  appNodeModules,
  'react-native/node_modules'
);
const escapePathForRegex = (value) =>
  value.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');

config.watchFolders = [sdkPath];
// Keep hierarchical lookup enabled so npm nested transitive deps still resolve.
config.resolver.disableHierarchicalLookup = false;
config.resolver.nodeModulesPaths = [appNodeModules, reactNativeNodeModules];

config.resolver.extraNodeModules = {
  react: path.resolve(appNodeModules, 'react'),
  'react-native': path.resolve(appNodeModules, 'react-native'),
  '@react-native/virtualized-lists': path.resolve(
    reactNativeNodeModules,
    '@react-native/virtualized-lists'
  ),
  '@react-native-async-storage/async-storage': path.resolve(
    appNodeModules,
    '@react-native-async-storage/async-storage'
  ),
  'react-native-svg': path.resolve(appNodeModules, 'react-native-svg'),
};

config.resolver.blockList = [
  new RegExp(
    `${escapePathForRegex(path.resolve(sdkPath, 'node_modules/react'))}\\/.*`
  ),
  new RegExp(
    `${escapePathForRegex(path.resolve(sdkPath, 'node_modules/react-native'))}\\/.*`
  ),
  new RegExp(
    `${escapePathForRegex(
      path.resolve(sdkPath, 'node_modules/@react-native-async-storage/async-storage')
    )}\\/.*`
  ),
  new RegExp(
    `${escapePathForRegex(
      path.resolve(sdkPath, 'node_modules/react-native-svg')
    )}\\/.*`
  ),
];

module.exports = config;
