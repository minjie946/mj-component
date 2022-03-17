/**
 * @description 服务的配置
 * @author minjie
 * @Date 2021-09-30 11:27
 * @LastEditTime 2022-03-16 17:32
 * @LastEditors minjie
 * @copyright Copyright © 2021 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
// 请求域名的
import { RequestConfigProps } from 'mj-tools'

interface ServerConfigProps {
  /** 请求的域名等 */
  requestConfig: RequestConfigProps
  /** 当前的项目名称 */
  project: string
  /** 超时的时间 */
  timeout: number
}

/** 基础的请求 */
const baseHeader = {
  device: 'WebPage',
  platform: 'web'
}

const baseCoreProject = ['address/', 'flick/', 'jack/', 'mario/', 'james/', 'stallone/', 'aladdin/', 'powell/', 'arnold/', 'flash/', 'joseph/', 'methuselah/']

const ServerConfigBase: ServerConfigProps = {
  requestConfig: {
    domainName: 'https://hfw2t-api.sj56.com.cn',
    headers: baseHeader,
    domainAry: [{ domainName: 'https://coret-api.sj56.com.cn', serviceName: baseCoreProject }]
  },
  project: 'css',
  timeout: 30000
}

// if (process.env.tag === 'dev') { // 开发环境
// } else if (process.env.tag === 'tes') { // 测试环境
//   ServerConfigBase.requestConfig.headers = { ...baseHeader, 'X-Ca-Stage': 'TEST' }
// } else if (process.env.tag === 'pre') { // 预发环境
//   ServerConfigBase.requestConfig.headers = { ...baseHeader, 'X-Ca-Stage': 'PRE' }
// } else if (process.env.tag === 'pro') { // 正式环境
//   ServerConfigBase.requestConfig.domainName = 'https://hfw2-api.sj56.com.cn'
//   const { domainAry = [] } = ServerConfigBase.requestConfig
//   domainAry[0].domainName = 'https://core-api.sj56.com.cn'
//   ServerConfigBase.requestConfig.domainAry = domainAry
// }

export const ServerConfig = ServerConfigBase
