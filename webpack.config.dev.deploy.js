const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
module.exports = {
    mode: "production",
    entry: "./example/index.ts",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "demo")
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: "Funnel Chart Demo",
            filename: "index.html",
            template: path.join(__dirname, "/index.html")
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        extensions: [".ts", ".js"],
        alias: {
            "@": path.resolve(__dirname, "src")
        }
    }
};
