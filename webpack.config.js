var path = require('path');
var webpack = require("webpack");

module.exports = {
    entry: {
        app: path.join(__dirname, "client/js/index.js"),
    },
    output: {
        filename: "app.js",
        path: path.join(__dirname, "client")
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest'],
            filename: 'vendor.js',
            minChunks: function (module) {
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        })
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                include: path.join(__dirname, 'client')
            }
        ]
    },
    devtool: (process.env.NODE_ENV === 'production') ? 'nosources-source-map' : 'eval-source-map'
};