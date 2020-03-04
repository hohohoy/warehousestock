const path = require('path');
    module.exports = {
        mode:'development',   //  webpack4.x版本中需要加入这个属性
        entry:'./src/main.js',  //  入口文件
        output:{  //  出口文件
            path:path.resolve(__dirname,'dist'),  //  指定将要打包好的文件应该要输出到哪个地方去（注意：路径必须是绝对地址）
            filename: 'bundle.js' //  指定输出文件的文件名
        },
        module:{
            rules:[
            {test:/\.css$/ , use:['style-loader' , 'css-loader','poscss-loader']}
            ]
        },
        // configureWebpack: {
        //     //支持jquery
        //     plugins: [
        //         new webpack.ProvidePlugin({
        //             $:"jquery",
        //             jQuery:"jquery",
        //             "windows.jQuery":"jquery"
        //         })
        //     ]
        // },
    }