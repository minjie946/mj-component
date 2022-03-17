import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import typescript from '@rollup/plugin-typescript'
import styleImport from 'vite-plugin-style-import'
import { theme } from './antd-theme'

const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  mode: 'development',
  base: '/',
  css: {
    preprocessorOptions: {
      less: { // 1. antd 按需加载需要处理的
        exclude: /node_modules/,
        modifyVars: theme,
        javascriptEnabled: true,
      }
    }
  },
  plugins: [
    react({
      exclude: [/\.stories\.(t|j)sx?$/, /node_modules/],
      include: ['**/*.tsx', '**/*.ts']
    }),
    typescript({ tsconfig: path.resolve('config/dev/tsconfig.json') }),
    styleImport({
      root: '',
      libs: [
        {
          // 2. antd 按需加载需
          libraryName: 'antd',
          esModule: true,
          resolveStyle: (name) => `antd/es/${name}/style/index`
        }
        // {
        //   // 3. mj-tools 按需加载需
        //   libraryName: 'mj-tools',
        //   esModule: true,
        //   resolveStyle: (name) => `mj-tools/es/${name}/style/index`
        // }
      ]
    })
  ],
  esbuild: {
    loader: 'tsx'
  },
  server: {
    port: 20101,
    host: '127.0.0.1',
    open: true,
    hmr: true
  }
})
