/** @type {import('next').NextConfig} */
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  reactStrictMode: true,
  webpack: config => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          { from: "cpp_out/*.wasm", to: "static/chunks/pages/[name][ext]"}
        ]
      })
    )
    config.resolve.fallback = { fs: false };
    return config
  },
}
