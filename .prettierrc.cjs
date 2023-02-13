module.exports = {
  trailingComma: "all",
  tabWidth: 2,
  semi: false,
  singleQuote: false,
  printWidth: 110,
  plugins: [require.resolve("prettier-plugin-astro"), require.resolve("prettier-plugin-tailwindcss")],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
}
