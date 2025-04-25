import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ files: ["**/*.{js,mjs,cjs,ts}"] },
	{ languageOptions: { globals: globals.browser } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	{
		ignores: [
			"**/node_modules/**",
			"**/dist/**",
			"**/server/public/dist/**",
			"**/luckysheet-source-private/**",
			"**/build/**",
			"**/logs/**",
			"**public/**",
			"**/server/wwwroot/**",
			"**/server/scripts/**",
		],
	},
	{
		rules: {},
	},
];
