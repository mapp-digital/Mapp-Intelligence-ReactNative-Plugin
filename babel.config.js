module.exports = {
  presets:
    process.env.BABEL_ENV === 'test' || process.env.NODE_ENV === 'test'
      ? [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          '@babel/preset-typescript',
          '@babel/preset-react',
        ]
      : ['module:@react-native/babel-preset'],
};
