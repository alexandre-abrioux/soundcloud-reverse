const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['./src/index.js'],
    optimization: {
        minimizer: [
            new TerserJSPlugin({}),
            new OptimizeCSSAssetsPlugin({})
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.EnvironmentPlugin([
            'SOUNDCLOUD_CLIENT_ID',
            'SOUNDCLOUD_REDIRECT_URI'
        ]),
        new MiniCssExtractPlugin({
            filename: '[name].[hash:8].css',
        }),
        new HtmlWebpackPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ],
            },
        ],
    },
    output: {
        filename: '[name].[hash:8].js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        public: process.env.HOST,
        host: '0.0.0.0',
        contentBase: [
            path.join(__dirname, 'dist'),
            path.join(__dirname, 'public'),
        ],
        index: 'index.html',
        port: 80
    }
};
