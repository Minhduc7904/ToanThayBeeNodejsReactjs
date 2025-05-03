const path = require("path");

module.exports = {
    entry: "./src/index.js", // Điểm vào chính của ứng dụng
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/, // Áp dụng cho các tệp .js và .jsx
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            [
                                "@babel/preset-env",
                                {
                                    targets: {
                                        ios: "12", // Hỗ trợ iOS 12 trở lên
                                    },
                                    useBuiltIns: "usage",
                                    corejs: "3.30",
                                },
                            ],
                            "@babel/preset-react", // Để hỗ trợ React
                        ],
                        plugins: [
                            "@babel/plugin-transform-named-capturing-groups-regex", // Thêm dòng này
                        ],
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: [".js", ".jsx"],
    },
};