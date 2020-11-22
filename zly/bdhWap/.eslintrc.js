// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  extends: ['plugin:vue/essential'],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 1 : 0,
    'no-console': process.env.NODE_ENV === 'production' ? 1 : 0,
    'block-scoped-var': 2,
    'default-case': 2,
    'eqeqeq': 2,
    'no-eq-null': 2,
    'no-multi-spaces': 2,
    'no-multi-str': 2,
    'no-new-wrappers': 2,
    'no-redeclare': 2,
    'no-unused-vars': 2,
    'no-use-before-define': 2,
    'max-statements-per-line': ["error",{ "max": 1 }],
    "indent": ["error", "tab"],
    'no-mixed-spaces-and-tabs': ["error"],
    'key-spacing': ["error", { "beforeColon": false,"afterColon": true }]
  }
}

