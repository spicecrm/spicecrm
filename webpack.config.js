const TerserPlugin = require("terser-webpack-plugin");
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const fs = require('fs');

const releaseNumber = require('./package.json').version;
const moment = require("moment");
const now = Date.now();
const buildDate = moment().format('YYYY-MM-DD HH:mm:ss');
const copyright = `© 2015 -  ${moment().format('YYYY')} SpiceCRM FlexCo All rights reserved.`;

/**
 * write the environment file
 */
fs.writeFileSync('environments/environment.prod.ts', `
export const environment = {
    production: true,
    buildNumber: "${releaseNumber}.${now}",
    copyright: "${copyright}"
    }
`);

/**
 * generate options for HtmlWebpackPlugin
 * @param file
 */
const generateOptions = (file) => ({
    filename: file.name,
    template: file.template,
    hash: true,
    minify: false,
    SpiceCRM: copyright,
    buildNumber: `${releaseNumber}.${now}`,
    chunksSortMode: (a) => a === 'scripts' ? -1 : 1
});

module.exports = {
    mode: "production",

    output: {
        // needed to adjust the dynamic import path
        publicPath: "app/",
        // modify the modules file name
        chunkFilename: (pathData) => {

            if (pathData.chunk.id.startsWith('common')) return pathData.chunk.id + '.js';

            const path = pathData.chunk.id.split('_');
            if (path[0] === 'default-src') {
                return pathData.chunk.id.replace(/_ts$/, '') + '.js';
            }
            return path[['include', 'modules', 'custom'].indexOf(path[1]) > -1 ? 3 : 2] + '.js';
        },
        filename: "[name].js"
    },
    optimization: {
        chunkIds: 'named',
        splitChunks: {
            chunks: 'all'
        },
        minimize: true,
        minimizer: [
            // custom minimize to keep class names for lazy loading
            new TerserPlugin({
                parallel: true,
                extractComments: false,
                terserOptions: {
                    mangle: true,
                    keep_classnames: true,
                    compress: {
                        global_defs: {
                            ngDevMode: false
                        }
                    }
                },
            }),
            // add spice header
            new webpack.BannerPlugin({
                banner: () => {
                    return `
                    SpiceCRM \n
                    release: ${releaseNumber} \n
                    date: ${buildDate} \n
                    build: ${releaseNumber}.${now}
                    `;
                },
            }),
            new CssMinimizerPlugin()
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
        ),
        new HtmlWebpackPlugin(
            generateOptions({name: "../gsuite.html", template: "assets/gsuite/gsuite.html"})
        )
    ],
};
