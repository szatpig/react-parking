// Created by szatpig at 2020/4/26.
const path = require('path');
const { override, fixBabelImports, addLessLoader, addWebpackPlugin, addWebpackAlias  } = require('customize-cra');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

const addCustomize = () => config =>{
    if (process.env.NODE_ENV === 'production'){
        config.devtool = false; //去掉map文件
    }
    return config
}

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: { '@primary-color': '#4a8df1' },
    }),
    addWebpackAlias({
        ["@"]: path.resolve(__dirname, "src"),
    }),
    addCustomize(),
    addWebpackPlugin(
        new AntdDayjsWebpackPlugin(),
        new BundleAnalyzerPlugin()
    )
);