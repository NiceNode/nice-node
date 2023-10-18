module.exports = {
  extends: 'erb',
  rules: {
    // Javascript can handle cycles in dependencies
    'import/no-cycle': 'off',
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'error',
    // Since React 17 and typescript 4.1 you can safely disable the rule
    'react/react-in-jsx-scope': 'off',
    'no-console': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/lines-between-class-members': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'no-plusplus': 'off',
    'react/function-component-definition': 'off',
    'react/jsx-no-useless-fragment': 'off',
    // Unfortunately, required due to 'erb' eslint depends on airbnb js config
    'no-unused-vars': 'off',
    // also caused by airbnb js config?
    'no-shadow': 'off',
    'lines-between-class-members': 'off',
    'react/jsx-no-script-url': 'off',
    camelcase: 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'react/jsx-filename-extension': [2, { extensions: ['.jsx', '.tsx'] }],
    'array-callback-return': 'off',
    'prefer-destructuring': [
      'error',
      {
        // This is unnatural: [ someVar ] = array; someVar = array[0] is much more readable
        VariableDeclarator: {
          array: false,
        },
        AssignmentExpression: {
          array: false,
        },
      },
    ],
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.ts'),
      },
      typescript: {},
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
