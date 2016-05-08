var path=require("path");
var webpack=require("webpack");

module.exports={
    devtool:'cheap-module-eval-source-map',
    entry:[
        'webpack-hot-middleware/client',
        './app/root'
    ],
    output:{
        path:path.join(__dirname,'dist'),
        filename:'bundle.js',
        publicpath:'/static/'
    },
    plugins:[
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module:{
        loaders:[
            {test:/\.js$/,loaders:['babel'],exclude:/node_module/},
            {test:/bootstrap\/js\//,loader:'imports?jQuery=jquery'},
            {test:/\.less$/,loader:'style-loader!css-loader!less-loader'},
            {test: /\.(png|woff|woff2|eot|ttf|svg)$/,loader: 'url-loader?limit=100000'},
            {test:/\.css/,loader:'style-loader!css-loader'},
            {test:/\.html$/,loader:"file?name=[name].[ext]"}
        ]
    }
}