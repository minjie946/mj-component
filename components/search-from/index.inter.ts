/**
 * @description 搜索组件的接口值等定义
 * @author minjie
 * @Date 2021-06-04 14:06
 * @LastEditTime 2021-10-15 12:03
 * @LastEditors minjie
 * @copyright Copyright © 2021 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import { FormItemProps } from 'antd'

export interface ItemProps extends FormItemProps {
  /** 标题的最小的宽度 */
  labelminwidth?: number
}

/** 表单的样式的 */
export const inlineformlabelCol = {
  labelCol: { span: 4, sm: 6, lg: 8, xl: 8, xxl: 8 },
  wrapperCol: { span: 19, sm: 18, lg: 18, xl: 18, xxl: 18 }
}
export const horizontalformlabelCol = {
  labelCol: { span: 4, sm: 4, lg: 4, xl: 4, xxl: 4 },
  wrapperCol: { span: 19, sm: 18, lg: 18, xl: 18, xxl: 18 }
}

/** 表单的样式的 */
export const formnolabelCol = {
  wrapperCol: { span: 24, sm: 24, lg: 24, xl: 24, xxl: 24 }
}

export type FinishType = 'submit' | 'reset'

export interface FieldDataFromatProps {
  /** 字段名称 */
  name: string
  /** 类型 */
  type?: 'time' | 'string' | 'number'
}
