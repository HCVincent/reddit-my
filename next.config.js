const removeImports = require("next-remove-imports");

module.exports = removeImports()({
  // ✅  options...
  reactStrictMode: true,
  webpack: function (config) {
    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader",
    });
    return config;
  },
});
