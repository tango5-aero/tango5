// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

/** @type {import("prettier").Config} */
const config = {
    bracketSameLine: true,
    plugins: ['prettier-plugin-tailwindcss'],
    printWidth: 180,
    semi: true,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'none',
    useTabs: false
};

export default config;
