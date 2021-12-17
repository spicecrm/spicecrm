const TerserPlugin = require("terser-webpack-plugin");
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");

require('./gulpfile_globals.js');
const moment = require("moment");
const now = Date.now();
const buildDate = moment().format('YYYY-MM-DD HH:mm:ss');
const aacService = `© 2015 -  ${moment().format('YYYY')} aac services k.s. All rights reserved.`;

const generateOptions = (file) => ({
    filename: file.name,
    template: file.template,
    hash: true,
    minify: false,
    aacServices: aacService,
    buildNumber: `${global.build.releaseNumber}.${now}`,
    chunksSortMode: (a) => a === 'scripts' ? -1 : 1
});

module.exports = {
    mode: "production",
    output: {
        publicPath: "app/",
        chunkFilename: (pathData) => {
            const path = pathData.chunk.id.split('_');
            if (path[0] === 'default-src') {
                return pathData.chunk.id.replace(/_ts$/, '') + '.js';
            }
            return path[['include', 'modules', 'custom'].indexOf(path[1]) > -1 ? 3 : 2] + '.js';
        }
    },
    optimization: {
        chunkIds: 'named',
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    mangle: true,
                    keep_classnames: true
                },
            }),
            new webpack.BannerPlugin({
                banner: () => {
                    return `
                    aacService \n
                    release: ${global.build.releaseNumber} \n
                    date: ${buildDate} \n
                    build: ${global.build.releaseNumber}.${now}
                    `;
                },
            }),
            new CssMinimizerPlugin(),
            new HtmlMinimizerPlugin()
        ],
    },
    plugins: [
        new HtmlWebpackPlugin(
            generateOptions({name: "../index.html", template: "assets/index.html"})
        ),
        new HtmlWebpackPlugin(
            generateOptions({name: "../outlook.html", template: "assets/outlook/outlook.html"})
       ),
        new HtmlWebpackPlugin(
            generateOptions({name: "../outlookcrm.html", template: "assets/outlook/outlookcrm.html"})
        )
    ],
};
