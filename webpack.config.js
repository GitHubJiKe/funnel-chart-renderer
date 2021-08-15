const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: "production",
    entry: { funnelChartRenderer: "./src/index.ts" },
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist"),
        libraryTarget: "umd",
        library: "funnelChartRenderer",
        libraryExport: "default"
    },
    module: {
        rules: [{ test: /\.tsx?$/, exclude: /node_modules/, use: ["babel-loader", "ts-loader"] }]
    },
    plugins: [new CleanWebpackPlugin(), new webpack.HotModuleReplacementPlugin()],
    resolve: {
        extensions: [".ts", ".js"],
        alias: {
            "@": path.resolve(__dirname, "src")
        }
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()]
    }
};
