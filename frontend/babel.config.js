module.exports = {
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
};
