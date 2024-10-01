'use strict'

module.exports = {
  overrides: [
    {
      files: '*.{js,ts}',
      options: {
        printWidth: 80,
        semi: false,
        singleQuote: true,
        trailingComma: 'es5',
      },
    },
  ],
}
