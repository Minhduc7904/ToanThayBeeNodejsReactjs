const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const babelLoader = webpackConfig.module.rules.find(
        (rule) => rule.oneOf
      ).oneOf.find(
        (rule) =>
          rule.loader &&
          rule.loader.includes("babel-loader")
      );

      // Thêm các thư viện cần transpile
      babelLoader.include = [
        path.resolve("src"), // Mã nguồn của bạn
        path.resolve("node_modules/socket.io-client"),
        path.resolve("node_modules/react-to-print"),
        path.resolve("node_modules/rehype-katex"),
        path.resolve("node_modules/remark-math"),
      ];

      return webpackConfig;
    },
  },
};
