import { defineConfig, loadEnv, ServerOptions, UserConfigFnObject } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
const configFn: UserConfigFnObject = ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const serverConfig: ServerOptions = {
    port: 3000,
    host: true,
    open: "http://sc.webdev",
    allowedHosts: true,
  };
  return defineConfig({
    mode,
    base: process.env.VITE_BASE_PATH,
    server: serverConfig,
    preview: serverConfig,
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

export default configFn;
