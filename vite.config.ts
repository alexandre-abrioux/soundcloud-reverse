import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  // https://vitejs.dev/config/
  return defineConfig({
    base: process.env.VITE_BASE_PATH,
    server: { port: 3000, host: true, open: "http://sc.webdev" },
    preview: { port: 3000, host: true, open: "http://sc.webdev" },
    plugins: [
      react({
        jsxImportSource: "@emotion/react",
        babel: {
          plugins: ["@emotion/babel-plugin"],
        },
      }),
    ],
  });
};
