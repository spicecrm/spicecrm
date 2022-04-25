const TerserPlugin = require("terser-webpack-plugin");
const path = require('path');

module.exports = {
  entry: {
    bundle: ['./app/index.js']
  },
  output: {
    path: path.resolve(__dirname, '../'),
    filename: 'spice_bpmn_modules.js',
    library: 'SpiceBpmnModules'
  },
  mode: 'production',
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: false,
        },
      }),
    ],
  },
};
