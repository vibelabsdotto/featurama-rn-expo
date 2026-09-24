module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          alias: {
            '@': './',
            '@components': './src/components',
            '@constants': './src/constants',
            '@hooks': './src/hooks',
            '@locales': './src/locales',
            '@providers': './src/providers',
            '@services': './src/services',
            '@stores': './src/stores',
            '@apptypes': './src/types',
            '@utils': './src/utils',
            '@assets': './assets',
          },
        },
      ],
    ],
  };
};
