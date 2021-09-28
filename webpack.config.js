const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: ["./src/index.js"],
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.EnvironmentPlugin({
            SOUNDCLOUD_CLIENT_ID: "",
            SOUNDCLOUD_REDIRECT_URI: "",
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash:8].css",
        }),
        new HtmlWebpackPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
        ],
    },
    optimization: {
        minimizer: ["...", new CssMinimizerPlugin()],
    },
    output: {
        filename: "[name].[contenthash:8].js",
        path: path.resolve(__dirname, "dist"),
    },
    devServer: {
        host: "0.0.0.0",
        port: 80,
        allowedHosts: [process.env.HOST],
    },
};
