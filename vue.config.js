const webpack = require('webpack');
module.exports={
    publicPath:  './',
    devServer:{
        proxy:{
            '/mobilestockproxy.ashx':{
                target:'http://tm.lilanz.com/qywx/api/mobilestockproxy.ashx',
                ws:true,
                changeOrigin: true,
            }
        }
},
    configureWebpack: {
           plugins: [
              new webpack.ProvidePlugin({
                $:"jquery",
                jQuery:"jquery",
                "windows.jQuery":"jquery"
              })
            ]
        }
    }