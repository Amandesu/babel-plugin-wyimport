'use strict'

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const path = require('path');
const paths = require("./paths");
const fs = require('fs');
const webpack = require("webpack");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { WebPlugin } = require('web-webpack-plugin');


module.exports = {
    output: {
        path: paths.build,
        filename: '[name].js',
        chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
        publicPath: "/"
    },
    entry: {
        "app":[path.resolve(paths.src, "index.js")]
    },
    resolve:{
        extensions:[".js", ".json"],
        modules: ["node_modules", paths.src]
    },
    devtool:"cheap-module-eval-source-map",
    module: {
        rules: [
            {
                test:/\.css$/,
                //include:paths.src,
                use:[
                    require.resolve('style-loader'),
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            root: path.resolve(paths.src, "images")
                        },
                    },
                ]
            },
            {
                test:/\.less$/,
                //include:paths.src,
                use:[
                    require.resolve('style-loader'),
                    {
                        loader:require.resolve('css-loader'),
                        options:{
                            root: path.resolve(paths.src, "images")
                        }
                    },
                    {
                        loader: require.resolve('less-loader')
                    }
                ]
            },
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: require.resolve('url-loader'),
                options: {
                  limit: 1000,
                  name: 'static/images/[name].[hash:8].[ext]',
                },
            },
            {
                test:/\.(js|jsx)$/,
                include:paths.src,
                loader: require.resolve("babel-loader"),
                options:{
                    presets:["react-app"],
                    plugins:[
                        ["import", {
                                "libraryName": "antd-mobile",
                                "style":true
                            }
                        ]
                    ],
                    compact: true,
                    cacheDirectory: true
                }
            },
            {
                exclude: [
                  /\.html$/,
                  /\.(js|jsx)$/,
                  /\.css$/,
                  /\.less$/,
                  /\.json$/,
                  /\.bmp$/,
                  /\.gif$/,
                  /\.jpe?g$/,
                  /\.png$/,
                  /\.svg$/
                ],
                loader: require.resolve('file-loader'),
                options: {
                  name: 'static/[name].[hash:8].[ext]',
                },
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('[name].css'),
        new webpack.HotModuleReplacementPlugin(),
        new WebPlugin({
            //输出的html文件名称
            filename: 'index.html',
            //这个html依赖的`entry`
            requires:["app"],
            template:path.resolve(paths.src, "template.html")
        }),
    ]
}
