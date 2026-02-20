const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    crypto: require.resolve('expo-crypto'),
    stream: require.resolve('readable-stream'),
    buffer: require.resolve('buffer'),
    zlib: require.resolve('browserify-zlib'),
    path: require.resolve('path-browserify'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    url: require.resolve('url'),
    events: require.resolve('events'),
    util: require.resolve('util'),
    process: require.resolve('process/browser'),
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (moduleName === 'jose' || moduleName.startsWith('jose/')) {
        return {
            filePath: path.join(__dirname, 'node_modules/jose/dist/browser/index.js'),
            type: 'sourceFile',
        };
    }
    // Chain to default resolver
    return context.resolveRequest(context, moduleName, platform);
};

config.resolver.conditionNames = ['browser', 'require', 'import'];
config.resolver.resolverMainFields = ['browser', 'react-native', 'main'];

module.exports = config;
