import eslint from "@eslint/js";
import { globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default tseslint.config(
  globalIgnores(["dist/", "node_modules/", "public/libs/"]),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintConfigPrettier,
);
