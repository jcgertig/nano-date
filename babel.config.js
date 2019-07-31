module.exports = (api) => {
  const isTest = api.env('test');
  return {
    presets: [
      ['@babel/preset-env', { targets: { node: 'current' }}],
      '@babel/preset-typescript'
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-object-rest-spread'
    ],
    ignore: isTest ? [] : ['**/__tests__', '**/*.test.ts']
  };
};
