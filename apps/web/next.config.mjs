import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __ui = resolve(__dirname, "../../packages/ui/src");

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@2pm/ui/components": resolve(__ui, "Components"),
      "@2pm/ui/layouts": resolve(__ui, "Layouts"),
      "@2pm/ui/plot-points": resolve(__ui, "PlotPoints"),
    };
    config.module.exprContextCritical = false;
    return config;
  },
};

export default nextConfig;
