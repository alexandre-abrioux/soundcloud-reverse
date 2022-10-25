import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const LoginHtmlPlugin = {
  name: "loginMiddleware",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.originalUrl.indexOf("/login") === 0) {
        req.url = "/login/index.html";
      }
      next();
    });
  },
};

export default ({ mode }) => {
  console.log(mode);
  console.log(loadEnv(mode, process.cwd()));
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  // https://vitejs.dev/config/
  return defineConfig({
    base: process.env.VITE_BASE_PATH,
    server: { port: 80 },
    preview: { port: 80 },
    plugins: [
      LoginHtmlPlugin,
      react({
        jsxImportSource: "@emotion/react",
        babel: {
          plugins: ["@emotion/babel-plugin"],
        },
      }),
    ],
    optimizeDeps: {
      include: ["soundcloud"],
    },
  });
};
