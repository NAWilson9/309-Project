var path = require('path');
var webpack = require("webpack");


module.exports = {
    entry: {
        app: "./client/js/index.js",
        vendor: [
            'react',
            'react-dom',
            'react-router',
            'semantic-ui-react'
        ]
    },
    output: {
        path: "./client/",
        filename: "app.js"
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            'name': 'vendor',
            'filename': 'vendor.js'
        })
    ],
    devtool: 'source-map'
};