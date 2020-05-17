const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        app: './src/index.js'
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        alias: {
            PIXI: path.resolve(__dirname, './node_modules/')
        }
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: 'resources',
            to: 'resources'
        }]),
        new HtmlWebpackPlugin()
    ]
};

