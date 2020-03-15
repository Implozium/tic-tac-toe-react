const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const babel = require("./babel.config");

const outputDir = path.resolve(__dirname, "../dist");

console.log(outputDir);

const webpackOption = (env, argv) => ({
    entry: "./src/index.js",
    output: {
        path: outputDir,
        publicPath: '/',
        filename: argv.mode === 'production' ? '[name].[chunkhash].js' : '[name].js',//"[name].[chunkhash].js",
    },
    devtool: argv.mode === 'production' ? false : 'source-map',//'source-map', //"cheap-module-eval-source-map",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: babel,
                }
            },
            {
                test: /\.html$/,
                use: {
                    loader: "html-loader"
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                }),
                //loader: ExtractTextPlugin.extract('css'),
                //use: ['style-loader', 'css-loader'],
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("styles.css"),
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html",
            chunks: ['main', 'vendors'],
            hash: true,
        }),
        new CompressionPlugin({
            algorithm: 'gzip'
        }),
        ...['css', 'img', 'fonts', 'js'].map(type => new CopyWebpackPlugin([{
            context: __dirname + "/static/" + type + "/",
            from: '**/*',
            to: outputDir + "/" + type + "/"
        }]))
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    devServer: {
        contentBase: outputDir,
        watchContentBase: true,
        port: 8081,
        historyApiFallback: true,
    }
});

module.exports = webpackOption;