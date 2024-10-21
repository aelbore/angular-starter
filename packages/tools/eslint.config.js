import oxlint from 'eslint-plugin-oxlint'
import eslintImport from 'eslint-plugin-import-x'
import lit from 'eslint-plugin-lit'
import tseslint from 'typescript-eslint'
import tsPlugin from '@typescript-eslint/eslint-plugin'

/** @type {import('eslint').Linter.Config[]} */
export default [
  oxlint.configs['flat/recommended'],
  oxlint.configs['flat/import'],
  tseslint.configs.eslintRecommended,
  ...tseslint.configs.recommended,
  {
    ...lit.configs['flat/recommended'],
    files: [ 
      'packages/components/src/**/*.ts',
      'packages/storybook/stories/**/*.ts'
    ]
  },
  {
    files: [ '**/*.ts' ],
    plugins: {
      "import": eslintImport,
      '@typescript-eslint': tsPlugin
    },
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      "no-tabs": ["error", { "allowIndentationTabs": false } ],
      "semi": [ "error", "never" ],
      "quotes": ["error", "single"],
      "no-restricted-syntax": [
        "error",
        {
          "selector": ":matches(PropertyDefinition, MethodDefinition)[accessibility='private']",
          "message": "Use #<your-private-property | your-private-method> instead"
        }
      ],
      "no-console": [ "error", { "allow": [ "info", "error" ] } ],
      "no-var": "error",
      'no-debugger': "error",
      "no-unused-vars": "off",
      "keyword-spacing": [ "error", { "before": true, "after": true } ],
      "template-curly-spacing": ["error", "never"],
      "template-tag-spacing": ["error", "always"],
      "max-lines": ["error", 400],
      "eol-last": ["error", "never"],
      "indent": [ "error", 2, { "ignoredNodes": ["TemplateLiteral *"], "SwitchCase": 1  }  ],
      "function-paren-newline": [ "error", "consistent" ],
      "comma-dangle": ["error", "never"],
      "import/no-duplicates": ["error", {"considerQueryString": true}],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-member-accessibility": [ "error", { "accessibility": "no-public" } ],
      "@typescript-eslint/prefer-optional-chain": "error",
      '@typescript-eslint/prefer-function-type': "off",
      "@typescript-eslint/promise-function-async": "error",
      "@typescript-eslint/unified-signatures": [ "error", { "ignoreDifferentlyNamedParameters": true } ],
      "@typescript-eslint/no-for-in-array": "error",
      "@typescript-eslint/no-unused-vars": [ "error", { "argsIgnorePattern": "^_" } ]
    }
  },
  {
    ignores: [ 
      "packages/tests/**",
      "node_modules/**",
      "packages/components/dist/**/*" 
    ]
  }
]