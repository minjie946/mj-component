/**
 * @description 搜索的组件
 * @author minjie
 * @Date 2021-01-29 15:08
 * @LastEditTime 2022-03-16 17:11
 * @LastEditors minjie
 * @copyright Copyright © 2021 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import React, { useEffect, useState, forwardRef, useRef } from 'react'
import { Form, FormProps, FormInstance, Space, Button } from 'antd'
import { ItemProps, inlineformlabelCol, horizontalformlabelCol, formnolabelCol, FinishType, FieldDataFromatProps } from './index.inter'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { isFunction, isEmpty } from 'mj-tools'
import { cloneDeep } from 'lodash-es'
import classNames from 'classnames'
import moment from 'moment'
import './index.less'

/** 表单项 */
export const Item = ({ label, labelminwidth = 60, children, ...props }: ItemProps) => {
  let cusLable = label
  if (cusLable && typeof cusLable === 'string') {
    cusLable = <span style={{ minWidth: labelminwidth }}>{label}</span>
  }
  return <Form.Item label={cusLable} {...props}>{children}</Form.Item>
}

/** str 是否是时间的字符串 */
const strIsDate = (value: any) => {
  return isNaN(value) && !isNaN(Date.parse(value))
}

/**
 * 当保存的时候获取值
 * @param key 保存的session的key
 * @param obj 额外的值 可以不传默认 {}
 * @param fristValue 默认的初始值重置的时候使用
 */
export const getSearchSaveParam = (key: string, obj: any = {}, fristValue?: any): any => {
  if (fristValue) {
    window.sessionStorage.setItem('search-from-values', JSON.stringify(cloneDeep(fristValue)))
  }
  const searchParamsSession = window.sessionStorage.getItem(`search_params_session_${key}`) || '{}'
  if (!isEmpty(searchParamsSession)) {
    let value = JSON.parse(searchParamsSession)
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        // 时间的转换
        if (strIsDate(value[key])) {
          value[key] = moment(value[key])
        } else if (Object.prototype.toString.call(value[key]) === '[object Array]' && value[key].length === 2) {
          const [start, end] = value[key]
          if (strIsDate(start)) {
            value[key][0] = moment(start)
            value[key][1] = moment(end)
          }
        }
      }
    }
    value = Object.assign(value, obj)
    return cloneDeep(value)
  }
  return obj
}

export interface SearchFromProps extends FormProps {
  /** 是否收起：默认是收起的(false) */
  collapsed?: boolean
  /** 是否去除label: 默认false 不去除 */
  nolabel?: boolean
  /** 每行显示多少个: 默认4个 */
  collapsedlen?: number
  /** 隐藏重置按钮 */
  hiddenReset?: boolean
  /** 字段的格式化 */
  fielddatafromat?: FieldDataFromatProps[]
  /** 搜索按钮的文案：默认查询 */
  searchText?: string
  /** 重置按钮的文案：默认重置 */
  resetText?: string
  /** 保存搜索的值: 传递唯一sessionkey */
  savesearchparam?: string
  /** 请直接使用: ref */
  forwardRef?: React.RefObject<FormInstance>
  /**
   * 当前的父容器的： 用来计算宽度的
   * * 默认 document.documentElement.clientWidth - 200： - 200 减去的是侧边栏的宽度
   */
  containerDom?: HTMLElement
  /**
  * 查询按钮和重置按钮的时候触发
  * @param {*}          value 表单值
  * @param {FinishType} type  提交的类型（'submit'|'reset'）
  */
  onFinishData?: (value: any, type?: FinishType) => void
  /**
  * 表单值改变的时候
  */
  onValuesChange?: (changeValue: any, allvalue: any) => void
}

/** 计时的防重复的变更 */
let timeDebounce: any = null

const SearchFromBase = ({
  collapsed: collapsedProps = false,
  nolabel = false,
  collapsedlen: collapsedlenProps = 4,
  hiddenReset = false,
  children,
  layout,
  searchText = '查询',
  resetText = '重置',
  savesearchparam,
  fielddatafromat,
  forwardRef,
  containerDom,
  onFinish,
  onValuesChange,
  onFinishData,
  ...props
}: SearchFromProps) => {
  // 表单
  const [form] = Form.useForm()
  // 是否开启和关闭
  const [collapsed, onSetCollapsed] = useState(collapsedProps)
  // 显示多少个
  const [collapsedlen, onSetCollapsedlen] = useState(collapsedlenProps)

  const ref: any = useRef()

  useEffect(() => {
    // ------组件初始的时候
    calculationColNum()
    window.addEventListener('resize', calculationColNum)
    const searchParamsSession = window.sessionStorage.getItem(`search_params_session_${savesearchparam}`)
    if (isEmpty(searchParamsSession)) {
      // 记录初始的值，然后点击重置的时候赋值, 离开销毁信息
      window.sessionStorage.setItem('search-from-values', JSON.stringify(props.initialValues || {}))
    }
    // ------组件销毁的时候
    return () => {
      if (timeDebounce) {
        clearTimeout(timeDebounce)
        timeDebounce = null
      }
      const searchParamsSession = window.sessionStorage.getItem(`search_params_session_${savesearchparam}`)
      if (isEmpty(searchParamsSession)) { // 当不为空
        window.sessionStorage.removeItem('search-from-values')
      }
      window.removeEventListener('resize', calculationColNum)
    }
  }, [])

  useEffect(() => {
    if (!ref.current) {
      ref.current = true
    } else if (containerDom) {
      calculationColNum(true)
    }
  }, [containerDom])

  /**
   * 计算一行展示几个
   * * xs 屏幕 < 576 px 响应式栅格
   * * sm 屏幕 ≥ 576 px 响应式栅格
   * * md 屏幕 ≥ 768 px 响应式栅格
   * * lg 屏幕 ≥ 992 px 响应式栅格
   * * xl 屏幕 ≥ 1200 px 响应式栅格
   * * xxl 屏幕 ≥ 1600 px 响应式栅格
   * @param {*} forcerefresh 强制刷新
   */
  const calculationColNum = (forcerefresh?: any) => {
    // 存在则返回
    if (timeDebounce && !forcerefresh) return false
    let width: number = document.documentElement.clientWidth - 200
    if (containerDom) {
      width = containerDom.clientWidth
    }
    let collapsedlenS: number = collapsedlenProps || 4
    if (width < 900) {
      collapsedlenS = collapsedlenS - 3
    } else if (width >= 900 && width < 1200) {
      collapsedlenS = collapsedlenS - 2
    } else if (width >= 1200 && width < 1450) {
      collapsedlenS = collapsedlenS - 1
    }
    if (collapsedlenS !== collapsedlen) {
      onSetCollapsedlen(collapsedlenS)
    }
    timeDebounce = setTimeout(() => {
      clearTimeout(timeDebounce)
      timeDebounce = null
    }, 300)
  }

  /** 表单重置 */
  const onReset = () => {
    // 获取的是初始化的时候的值
    const valueStr: string = window.sessionStorage.getItem('search-from-values') || '{}'
    if (!isEmpty(valueStr)) {
      const value = JSON.parse(valueStr)
      const FieldData: any[] = []
      const allValus: any = form.getFieldsValue()
      for (const key in allValus) {
        if (Object.prototype.hasOwnProperty.call(allValus, key)) {
          if (!fielddatafromat) {
            // 恭喜你找到了一个漏洞，只要是字符串的时间都会被转化
            if (isNaN(value[key]) && !isNaN(Date.parse(value[key]))) {
              value[key] = moment(value[key])
              FieldData.push({ name: key, value: moment(value[key]) })
            } else {
              FieldData.push({ name: key, value: value[key] })
            }
          } else {
            value[key] = formatValues(key, value[key])
            FieldData.push({ name: key, value: formatValues(key, value[key]) })
          }
        }
      }
      onFinishCus('reset', cloneDeep(value))
      form.setFields(FieldData)
    } else {
      form.resetFields()
    }
  }

  /** 格式化值 */
  const formatValues = (key: string, value: any): any => {
    if (fielddatafromat) {
      const obj = fielddatafromat?.find((el: FieldDataFromatProps) => el.name === key)
      if (obj?.type === 'time') {
        if (isFunction(value)) {
          return [moment(value[0]), moment(value[1])]
        }
        return moment(value)
      } else if (obj?.type === 'number') {
        return Number(value)
      }
      return value
    }
    return value
  }

  /** 提交信息 */
  const onFinishCus = (type: FinishType, value: any) => {
    if (savesearchparam) { // 保存搜索的值
      if (type === 'reset') {
        window.sessionStorage.removeItem(`search_params_session_${savesearchparam}`)
      } else {
        window.sessionStorage.setItem(`search_params_session_${savesearchparam}`, JSON.stringify(value))
      }
    }
    if (onFinishData) onFinishData(value, type)
    if (onValuesChange) onValuesChange({}, value)
  }

  /** 初始化数据 */
  const initChildrenAry = (ary: any) => {
    // 第一行展示的
    let childAry: any[] = []
    // 默认隐藏的部分
    let childHiddenAry: any[] = []
    // 是否可以展示收缩的
    let isShow: boolean = false
    let num: number = 1
    ary.forEach((child: any) => {
      if (num > collapsedlen) {
        // 存在隐藏的 那么直接添加
        if (child.props && child.props.hidden) {
          childHiddenAry.push({ child, hidden: true })
        } else {
          childHiddenAry.push({ child, hidden: false })
          isShow = true
          num++
        }
      } else {
        // 显示的
        if (child.props && child.props.hidden) {
          childAry.push({ child, hidden: true })
        } else {
          childAry.push({ child, hidden: false })
          num++
        }
      }
    })
    return [childAry, childHiddenAry, isShow]
  }

  /** 收起展开 */
  const onChangeCollapsed = () => {
    onSetCollapsed(!collapsed)
  }

  const [childAry, childHiddenAry, isShowCollapsed]: any = initChildrenAry(isFunction(children) ? children : [children])
  let formCol: any = inlineformlabelCol
  if (nolabel) { // 没有标题的
    formCol = formnolabelCol
  } else if (layout === 'horizontal') {
    formCol = horizontalformlabelCol
  }

  return <Form
    ref={forwardRef}
    form={form}
    layout={layout || 'inline'}
    onFinish={(value:any) => onFinishCus('submit', value)}
    className='search-container'
    {...formCol}
    {...props}
  >
    <div className='sj-search-content'>
      <div className='sj-search-left-content'>
        <div className='sj-search-row'>
          {childAry.map((item: any, itemkey: number) => (
            <div
              className={classNames(`sj-search-col-${collapsedlen}`, {
                'sj-search-col-hidden': item.hidden
              })}
              key={itemkey}
            >
              {item.child}
            </div>
          ))}
        </div>
        <div className={classNames('sj-search-row', {
          'search-container-collapsed-col-show': collapsed,
          'search-container-collapsed-col-hidden': !collapsed
        })}>
          {childHiddenAry.map((item: any, itemkey: number) => (
            <div
              className={classNames(`sj-search-col-${collapsedlen}`, {
                'sj-search-col-hidden': item.hidden
              })}
              key={itemkey}
            >
              {item.child}
            </div>
          ))}
        </div>
      </div>
      <div className='sj-search-right-content'>
        <Space size={10} style={{ float: 'right' }} className='search-container-collapsed-content'>
          {/** 重置按钮 */}
          {!hiddenReset && <Button onClick={onReset}>{resetText}</Button>}
          {/** 查询按钮 */}
          <Button type='primary' htmlType='submit'>{searchText}</Button>
          {/** 是否存在下拉图标 */}
          {isShowCollapsed && !collapsed && <span className='search-container-collapsed-text' onClick={onChangeCollapsed}>展开<DownOutlined /></span>}
          {isShowCollapsed && collapsed && <span className='search-container-collapsed-text' onClick={onChangeCollapsed}>收起<UpOutlined /></span>}
        </Space>
      </div>
    </div>
  </Form>
}

/**
 * antd 表单进行的二次的封装， 使用的方式和From类似
 * ```tsx
 * <SearchFrom
 *  initialValues={searchParam}
 *  onFinishData={this.onFinish}
 * >
 *   <Item label="账户姓名" name='userName'>
 *   <Input allowClear placeholder='请输入' autoComplete='off'/>
 * </Item>
 * ```
 */
const SearchFrom:any = forwardRef((props: SearchFromProps, ref: any) => {
  return <SearchFromBase {...props} forwardRef={ref} />
})

SearchFrom.Item = Item

export default SearchFrom
