import typescript from "@rollup/plugin-typescript";
// 清空文件夹
import clear from 'rollup-plugin-clear';
import json from "rollup-plugin-json";
import { nodeResolve } from '@rollup/plugin-node-resolve'; // 帮助查找以及转化外部模块
import commonjs from "@rollup/plugin-commonjs"; // 帮助查找以及转化外部模块
// 可以处理组件中import图片的方式，将图片转换成base64格式，但会增加打包体积，适用于小图标
import image from '@rollup/plugin-image';
import styles from 'rollup-plugin-styles'
// 处理css less 等的样式
import autoprefixer from "autoprefixer";
// 处理less 嵌套样式写法
import nested from "postcss-nested";
// 转换新的特性
import postcsspresetenv from "postcss-preset-env";
// 压缩css 代码
import cssnano from "cssnano";
import { babel } from '@rollup/plugin-babel'
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { terser } from "rollup-plugin-terser"; // 压缩
import filesize from "rollup-plugin-filesize"; // 文件大小
import path from 'path'
import pkg from  '../../package.json'

const globalsObject = {
  react: 'react',
  antd: 'antd',
  axios: 'axios',
  moment: 'moment',
  classnames: 'classnames',
  'mj-tools': 'mj-tools',
  'lodash-es': 'lodash-es',
  'react-dom': 'react-dom',
  'react-router-dom': 'react-router-dom',
  '@ant-design/icons': '@ant-design/icons'
}

const baseOutPutConfig = {
  globals: globalsObject,
  exports: 'named', 
  sourcemap: true,
  preserveModules: true,
  preserveModulesRoot: 'components',
  assetFileNames: ({ name }) => { // 处理资源样式的
    const { dir, base } = path.parse(name)
    return `${dir ? dir + '/' : ''}style/${base}`
  }
}

export default {
  input: path.resolve('components/index.ts'),
  output: { 
    dir: 'lib', format: 'esm', name: pkg.name,
    ...baseOutPutConfig
  },
  plugins: [
    image(),
    styles({
      use: ['less'],
      mode: 'extract',
      extract: true,
      sourcemap: true,
      extensions: [".css", '.less'],
      less: { javascriptEnabled: true },
      plugins: [
        nested(), 
        postcsspresetenv(), 
        cssnano(),
        autoprefixer()
      ]
    }),
    json(),
    commonjs({ include: /node_modules/ }),
    nodePolyfills(),
    terser(),
    filesize(),
    nodeResolve(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      extensions: ['.tsx', 'ts'],
      presets: [
        ["@babel/env", {
          "targets": { "browsers": ["> 1%", "last 2 versions", "not ie <= 8"] },
          "useBuiltIns": "usage",
          "corejs": 3
        }],
        "@babel/react",
        "@babel/typescript"
      ],
      plugins: [
        ["import", { "libraryName": "antd", "style": true }, "antd"],
        ["import", { "libraryName": "lodash-es", "libraryDirectory": "", "camel2DashComponentName": false }, "lodash-es"]
      ]
    }),
    typescript({ tsconfig: path.resolve('config/pro/tsconfig.json') }),
    clear({ targets: ['lib'] })
  ],
  context: 'window', // 解决this is undifind 的问题
  external: Object.keys(globalsObject)
};