/**
 * @description 描述
 * @author minjie
 * @Date 2021-10-26 16:49
 * @LastEditTime 2021-11-03 11:49
 * @LastEditors minjie
 * @copyright Copyright © 2021 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import { TableColumnProps } from 'antd'

export type ValueType = 'text' | 'time' | 'money' | 'number'

/**
 * 权限选中的值
 * @param {any[]} excludedId 全选的时候：排除的ID
 * @param {any[]} excludedObj 全选的时候：排除的对象
 * @param {any[]} includedId 未全选的时候：选中的ID
 * @param {any[]} includedObj 未全选的时候：选中的对象
 * @param {number} total 选中的总条数
 */
export interface CheckValueProps {
  /** 全选的时候：排除的ID */
  excludedId: any[]
  /** 全选的时候：排除的对象 */
  excludedObj: any[]
  /** 未全选的时候：选中的ID */
  includedId: any[]
  /** 未全选的时候：选中的对象 */
  includedObj: any[]
  /** 选中的总条数 */
  total: number
}

/**
 * 全选的配置
 * @param {boolean} checkAll 全选的状态
 * @param {string} checkId  选中的Id的值： 默认是 table => rowKey
 * @param {(value:CheckValueProps) => void} onCheckValue 返回选中的状态的值
 */
export interface CheckConfigProps {
  /** 全选的状态 */
  checkAll: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 清除数据 */
  clear?: boolean
  /** 自定义主键的时候，指定选择的键 */
  rowKey?: string
  /** 清空数据 */
  onClear?: (clear: boolean) => void
  /** 设置checkAll */
  onChageCheckAll?: (checkAll: boolean) => void
  /**
   * 返回选中的状态的值
   * @param {CheckValueProps} value
   */
  onCheckValue?: (value: CheckValueProps) => void
}

/** 表格改变的时候使用 */
export interface TableChangeProps {
  /** 筛选 */
  filters: any
  /** 排序 */
  sorter: any
  /** 类型： 筛选还是排序 */
  extra: any
}

export interface TableDataProps {
  currentPage: number
  data: any[]
  pageSize: number
  totalNum: number
  totalPage: number
}

export interface TableColumnMixsProps<T = any> extends TableColumnProps<T> {
  /**
   * 当前的列展示格式
   * ```tsx
   * 'text'|'time'|'money'|'number'
   * ```
   */
  type?: ValueType
  /** 当type为time的时候 formatTime 生效 */
  formatTime?: string
  /**
   * 当type为 (number|money) 的时候
   * ```
   * type: 'number', defaultValue: '0'
   * type: 'money', defaultValue: '0'
   * ```
   */
  defaultValue?: string|number
}
