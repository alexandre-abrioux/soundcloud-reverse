const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DotenvPlugin = require("dotenv-webpack");

module.exports = {
    mode: "development",
    entry: ["./src/index.js"],
    plugins: [
        new DotenvPlugin({
            path: "./.env.local",
            defaults: "./.env",
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].[contenthash:8].css",
        }),
        new webpack.ProvidePlugin({
            "window.jQuery": "jquery",
        }),
        new HtmlWebpackPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                type: "asset/resource",
                generator: {
                    filename: "fonts/[name].[contenthash:8][ext][query]",
                },
            },
        ],
    },
    optimization: {
        minimizer: ["...", new CssMinimizerPlugin()],
    },
    output: {
        filename: "js/[name].[contenthash:8].js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    devServer: {
        host: "0.0.0.0",
        port: 80,
        allowedHosts: [process.env.HOST],
    },
};
