module.exports = {
  root: true,

  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },

  env: {
    browser: true
  },

  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/strongly-recommended'
  ],

  // required to lint *.vue files
  plugins: [
    'vue',
    'sort-keys-fix'
  ],

  globals: {
    'ga': true, // Google Analytics
    'cordova': true,
    '__statics': true,
    'process': true
  },

  // add your custom rules here
  rules: {
    'vue/array-bracket-spacing' : 'warn',
    'vue/arrow-spacing':'warn',
    'vue/camelcase':'off',
    'vue/eqeqeq':'warn',
    'vue/object-curly-spacing':'warn',

    // allow async-await
    'generator-star-spacing': 'off',
    // allow paren-less arrow functions
    'arrow-parens': 'off',
    'one-var': 'off',
    // 'sort-keys' :'warn',
    'vue/order-in-components' : 'off',
    "sort-keys-fix/sort-keys-fix": "off",
    'vue/require-prop-types': 'off',
    'vue/require-default-prop': 'off',

    'import/first': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'prefer-promise-reject-errors': 'off',

    // allow console.log during development only
    //'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
