declare module '*.less' {
  const content: any
  export = content
}

declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
declare module '*.pdf'

declare module '@loadable/component';

// 添加自定义的环境的变量
declare module 'process' {
  global {
    namespace NodeJS {
      export interface ProcessEnv {
        tag: 'des' | 'dev' | 'tes' | 'pre' | 'pro'
        version: string
      }
    }
  }
}
