/**
 * @description 描述
 * @author minjie
 * @Date 2022-03-07 18:03
 * @LastEditTime 2022-03-17 12:04
 * @LastEditors minjie
 * @copyright Copyright © 2021 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import { ServerConfig } from '../config/config'
import { createHashHistory } from 'history'
import { Modal } from 'antd'

import { Axios as BaseAxios, isEmpty } from 'mj-tools'

const token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjdXJyZW50VGltZU1pbGxpcyI6IjE2NDc0MDY0OTIzNjciLCJwcm9qZWN0TmFtZSI6IkJQTyIsImFjY291bnQiOiIxNTE4MTQ4MjYyOSIsInBsYXRmb3JtIjoid2ViIn0.j1wChm24nGxc6Wu5AYikVo_N7fJ3e9SqlSfid9bHL-Q'
const traceid = 'WebPage_20c45707-7e6a-43cf-8dc1-c2de0f0d90fa_1647423223532_10004928'

/** 动态的请求头的信息 */
const requertDynamicHeader = () => {
  return {
    token: token || 'tk', // 存在token 则发送token
    Authorization: token || '',
    traceId: traceid
  }
}

/** 业务的请求头的处理 */
const handleResponseData = (response: any, config: any, obj: any) => {
  return new Promise((resolve, reject) => {
    if (response) {
      const {
        headers: { authorization, Authorization },
        config: { responseType },
        data: { code, data, message, msg, token }
      } = response // 获取到token
      if (!isEmpty(authorization) || !isEmpty(Authorization) || !isEmpty(token)) {
        // SysUtil.setLocalStorage(globalEnum.token, authorization || Authorization || token, 5)
      }
      if (isEmpty(response.data)) {
        const errorObj = { msg: '未返回响应数据' }
        reject(errorObj)
      } else {
        // 根据不同的响应类型返回不同的
        if (responseType && responseType === 'blob') {
          resolve(response.data)
        } else {
          const a: any = { code: code, msg: message || msg, data: data }
          if (a.msg && a.msg.length === 0 && code === 400) a.msg = ['未知错误']
          switch (code) {
            case 200: resolve(a); break
            case 401: // token 失效
            case -1000: // token 失效
            case 1015: // 中心 用户未登录
              if (message[0] === '服务器调用异常' || msg === '服务器调用异常') {
                obj.onCancelRequestAll()
                a.msg = '【接口】：' + a.msg
                reject(a)
              } else {
                if (config.isGlobal) {
                  Modal.destroyAll()
                  obj.onCancelRequestAll()
                  if (!(window as any).__POWERED_BY_QIANKUN__) {
                    Modal.warning({
                      title: '提示',
                      content: `登录失效，请重新登录!`, // message || msg,
                      maskClosable: false,
                      onOk: () => {
                        // SysUtil.clearLocalStorageAsLoginOut()
                        const history = createHashHistory()
                        history.replace('/') // 跳转到登录的界面
                      }
                    })
                  } else {
                    // SysUtil.clearLocalStorageAsLoginOut()
                    // EventEmitter.emit('token_invalid', a) // 发布消息
                  }
                } else {
                  reject(a)
                }
              }
              break
            default: reject(a); break
          }
        }
      }
    } else {
      resolve(response)
    }
  })
}

export const Axios = new BaseAxios({
  requestConfig: ServerConfig.requestConfig,
  project: ServerConfig.project,
  timeout: ServerConfig.timeout,
  requertDynamicHeader: requertDynamicHeader,
  handleResponseData: handleResponseData
})
