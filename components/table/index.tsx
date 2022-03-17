/**
 * @description 表格
 * @author minjie
 * @Date 2021-10-09 14:10
 * @LastEditTime 2022-03-17 15:37
 * @LastEditors minjie
 * @copyright Copyright © 2021 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import React, { useEffect, useState, useRef } from 'react'
import { TableChangeProps, TableDataProps, CheckConfigProps, CheckValueProps, TableColumnMixsProps } from './index.d'
import { Row, Col, Space, Table, TableProps, Pagination, PaginationProps, Modal } from 'antd'
import { SpanText } from '../span-text'
import { doubleFormat, isEmpty, isFunction, throttle, URLInterface, Axios as AxiosProps } from 'mj-tools'
import { debounce, cloneDeep } from 'lodash-es'
import moment from 'moment'
// import 'antd/lib/table/style/index.less';
// import 'antd/lib/modal/style/index.less';
import './index.less'

/** 定时的 */
let timeObj:any = null

/** 全局的请求实体类 */
let globeAxios:AxiosProps

export interface TableConfigProps {
  /** 请求的实体 */
  axios: AxiosProps
}

/** 配置 */
export function setTableConfig (config:TableConfigProps) {
  globeAxios = config.axios
}


// https://ant.design/components/pagination-cn/
const GlobalTabelPagination: PaginationProps = {
  current: 1,
  defaultCurrent: 1,
  defaultPageSize: 15,
  pageSize: 15,
  pageSizeOptions: ['5', '10', '15', '20', '25', '30'],
  showQuickJumper: true,
  showLessItems: true,
  showSizeChanger: true,
  showTitle: true,
  size: 'small',
  showTotal: (total: number) => `共${total}条`,
  total: 0
}

export interface TableItemProps<T = any> extends TableProps<T> {
  /** 加载数据 */
  loading: boolean
  /** 请求的接口 */
  action?: URLInterface
  /** 参数: (POST) 请求的时候的参数 默认：{} */
  params?: any
  /** 参数: (GET) 请求的时候的参数 默认：{} */
  getParams?: any
  /** 当前的页数 默认： 15 */
  pageSize?: number
  /** 表格列的配置描述，具体项见下表: https://ant.design/components/table-cn/#Column */
  columns: TableColumnMixsProps<T>[]
  /** columns 中type 格式化时 不存在值的显示占位 */
  columnIsNull?: string
  /** 需要额外减去的高度， 默认 0 */
  reduceHeight?: number
  /** 自定义主键 */
  cusindex?: boolean
  /** 复选框 */
  checkConfig?: CheckConfigProps
  /** 表格高度 y 默认: 450 */
  tableMinHeight?: number
  /** 是否在没有数据的时候也显示底部的导航 */
  isnoDatafooter?: boolean
  /** 是否显示分页：默认 true */
  isshowPagination?: boolean
  /** 请求的实体 */
  axios?:AxiosProps
  /**
   * 数据加载完成之后的回调
   * @param {boolean} loading 加载的状态
   * @param {number}  total 总的条数
   */
  onLoading: (loading: boolean, total: number) => void
  /**
   * 数据加载完成之后还需要单独加工的
   * @param {Array<*>} dataSource
   * @param {(dataSource:any[]) => void} callback
   */
  onLoadingDataAfter?: (dataSource: any[], callback: (dataSource: any[]) => void) => void
  /**
   * 底部的操作的显示
   * @param {*} currentPageData 当前表格的数据列表
   */
  footerRender?: (currentPageData?: any) => any
  /**
   * 顶部的操作的显示
   * @param {*} currentPageData 当前表格的数据列表
   */
  titleRender?: (currentPageData?: any) => any
  /**
   * 展示区域：全选右侧、分页左侧
   */
  footerPageRender?: () => any
  /**
   * 表格的改变事件: 处理对应的搜索的条件
   * @param pagination 分页改变
   * @param filters    筛选
   * @param sorter     搜索的
   * @param extra      当前改变的值{ currentDataSource：[], action: 'paginate'|'sort'|'filter' } （currentDataSource：数据数组, action：动作类型）
   */
  onTableChange?: (option: TableChangeProps) => Promise<T>
  /**
   * 表格加载错误的函数
   */
  onError?: (err: any) => void
}

/**
 * 表格
 * * 1. 封装请求
 * * 2. 封装columns
 * * 3. 封装多选单选
 * * 4. 封装高度的自定义
 * @param {TableItemProps} props
 * @returns {React.ReactDOM}
 */
export const TableItem = ({
  loading = false, action, params = {}, getParams = {}, pageSize = 15, columns,
  columnIsNull = '-', reduceHeight = 0, tableMinHeight = 450, cusindex = false, checkConfig, isshowPagination = true,
  scroll = {}, rowKey, isnoDatafooter = false, dataSource: dataSourceProps, rowSelection: rowSelectionProps,
  axios = globeAxios,
  onLoading, onLoadingDataAfter, footerRender, titleRender, footerPageRender, onTableChange, onError, ...props
}: TableItemProps) => {
  const [dataSource, onSetDataSource]: [any[], any] = useState([])
  const [resetColumns, onSetResetColumns]: [any[], any] = useState(columns)
  GlobalTabelPagination.pageSize = pageSize // 设置默认的分页
  const [tabelPagination, onSetPagination]: [PaginationProps, any] = useState(cloneDeep(GlobalTabelPagination))
  const [height, onSetHeight]: [string | number, any] = useState(tableMinHeight)
  // 选中的值
  const [checkValue, onSetCheckValue]: [CheckValueProps, any] = useState({
    excludedId: [],
    excludedObj: [],
    includedId: [],
    includedObj: [],
    total: 0
  })
  const [selectedRowKeys, onSetSelectedRowKeys]: [Array<any>, any] = useState([])
  const tableRef: any = useRef()

  useEffect(() => {
    initColumns(columns)
    // 容器高度自适应
    throttle('resize', 'tableResize')
    onInitHeight()
    window.addEventListener('tableResize', onInitHeight)
    return () => {
      onSetHeight(tableMinHeight) // 重置高度
      onSetDataSource([]) // 重置数据
      onSetPagination(cloneDeep(GlobalTabelPagination)) // 重置分页
      window.removeEventListener('tableResize', onInitHeight) // 移除监听
      timeObj = null
      if (axios) axios.onCancelRequestAll() // 取消请求
    }
  }, [])

  useEffect(() => {
    initColumns(columns)
  }, [columns])

  useEffect(() => {
    if (loading) onRequestData()
  }, [loading])

  useEffect(() => {
    const { clear, onClear, onChageCheckAll } = checkConfig || {}
    if (clear) {
      checkValue.excludedId = []
      checkValue.excludedObj = []
      checkValue.includedId = []
      checkValue.includedObj = []
      checkValue.total = 0
      onSetSelectedRowKeys([])
      if (onClear) onClear(false)
      if (onChageCheckAll) onChageCheckAll(false)
    }
  }, [checkConfig])

  const onInitHeight = () => {
    if (timeObj) return
    // 兼容IE: 非IE为0，IE为2
    const clientTop: number = document.documentElement.clientTop
    // 可视区域的高度
    const clientHeight = document.body.clientHeight
    // 实际的可用的高度
    let height = clientHeight - clientTop
    // 减去顶部的距离
    if (tableRef && tableRef.current) height -= tableRef.current.getBoundingClientRect().top
    // 顶部操作栏
    if (titleRender) height -= 39
    // 底部操作栏
    if (footerRender && (isnoDatafooter || dataSource.length > 0)) height -= 53
    // 分页（44）
    if (isshowPagination || footerPageRender || checkConfig) {
      height -= 44
    }
    // 减去需要减的  额外的高度 + 表头（45） + padding(32)
    height -= reduceHeight + 45 + 32
    if (height < 200) height = 220
    onSetHeight(height)
    timeObj = setTimeout(() => {
      clearTimeout(timeObj)
      timeObj = null
    }, 300)
  }

  /**
   * 格式化显示的列
   * @param {TableColumnMixsProps} columns 列的信息的修改
   */
  const initColumns = (columns: TableColumnMixsProps[] = []) => {
    if (columns && columns.length > 0) {
      // 只对存在值的进行格式化
      const columnFilter = columns.filter((column: any) => column.type)
      columnFilter.forEach((column: TableColumnMixsProps) => {
        column.render = (text: any) => columnRender(text, column)
      })
    }
    onSetResetColumns(columns)
  }

  /**
   * 值的格式化: 'text'|'date'|'dateTime'|'time'|'money'|'number'
   * @param {*} text
   * @param {TableColumnMixsProps} column
   * @returns {React.ReactDOM}
   */
  const columnRender = (text: any, { type, formatTime = 'YYYY-MM-DD HH:mm', defaultValue }: TableColumnMixsProps) => {
    if (type === 'time') {
      const flg: boolean = isNaN(text) && !isNaN(Date.parse(text))
      return !isEmpty(text) && flg ? moment(new Date(text)).format(formatTime) : (columnIsNull || '-')
    } else if (type === 'money') {
      if (typeof text !== 'number' && !text) return doubleFormat(0, 2)
      if (typeof text === 'string' && !isEmpty(text)) return text ? doubleFormat(text, 2) : (defaultValue || columnIsNull || '-')
      return typeof text === 'number' ? doubleFormat(text, 2) : (defaultValue || columnIsNull || '-')
    } else if (type === 'number') {
      const textStr: any = text ? text.toString() : text
      return !isEmpty(textStr) ? textStr : (defaultValue || columnIsNull || '-')
    }
    return text || (columnIsNull || '-')
  }

  const onRequest = (searchParams?:any, current?:number) => {
    if (action) {
      params = Object.assign({ page: tabelPagination.current, pageSize: tabelPagination.pageSize }, params)
      if (current) params.page = current
      if (searchParams) params = Object.assign(params, searchParams)
      if (axios) { // 存在请求的实体
        axios.request(action, params, { config: { params: getParams } }).then(({ data: responseData }: any) => {
          let dataSource: any = []
          // 是数组的话直接赋值
          if (isFunction(responseData)) {
            dataSource = responseData
            tabelPagination.total = responseData.length
          } else if (responseData) {
            const { currentPage, data = [], totalNum, totalPage }: TableDataProps = responseData
            // 当前页数大于总的页数 => 从新加载数据
            if (totalPage !== 0 && currentPage > totalPage) {
              tabelPagination.current = totalPage === 0 ? 1 : totalPage
              onSetPagination(tabelPagination)
              onRequest(undefined, totalPage === 0 ? 1 : totalPage)
            } else {
              dataSource = data || []
              tabelPagination.current = currentPage
              tabelPagination.total = totalNum
            }
          } else {
            tabelPagination.total = 0
          }
          // 自定义主键
          if (cusindex) {
            const { current, pageSize }: any = tabelPagination
            dataSource = dataSource.map((item: any, i: number) => ({ index: (current - 1) * pageSize + i + 1, ...item }))
          }
          // 数据加载完成之后对数据处理的
          if (onLoadingDataAfter) {
            onLoadingDataAfter(dataSource, (ary: any[]) => {
              checkAllLoadindData(ary)
              onSetDataSource(ary) // 重新设置值
            })
          } else {
            checkAllLoadindData(dataSource)
            onSetDataSource(dataSource)
          }
          onSetPagination(tabelPagination)
          onLoading(false, tabelPagination.total || 0)
        }).catch((err: any) => {
          onLoading(false, 0)
          if (onError) {
            console.log('【tableError】:' + err)
            onError(err)
          } else {
            Modal.error({
              title: '表格查询出错',
              centered: true,
              content: err.msg || err.message || err,
              onOk: () => Promise.resolve()
            })
          }
        })
      } else {
        onLoading(false, 0)
        console.error('请传入请求的实体')
      }
    } else {
      onLoading(false, 0)
      console.error('请传入请求的地址')
    }
  }

  /** 请求数据 */
  const onRequestData = debounce(onRequest, 300, {
    leading: true,
    trailing: false
  })

  /** 页码或 pageSize 改变的回调，参数是改变后的页码及每页条数 */
  const onChangePagination = (page: number, pageSize?: number) => {
    tabelPagination.current = page
    tabelPagination.pageSize = pageSize
    onRequestData()
  }

  /**
   * 表格的改变事件
   * @param pagination 分页改变
   * @param filters    筛选
   * @param sorter     搜索的
   * @param extra      当前改变的值{ currentDataSource：[], action: 'paginate'|'sort'|'filter' } （currentDataSource：数据数组, action：动作类型）
   */
  const onHandleTableChange = (pagination: PaginationProps, filters: any, sorter: any, extra: any) => {
    if (onTableChange) { // 排序的时候
      onTableChange({ filters, sorter, extra }).then((params: any) => onRequestData(params))
    }
  }

  /** ------------------------复选框的 start-------------------------- */

  const onResultKey = (): string => {
    if (rowKey && typeof rowKey === 'function' && checkConfig?.rowKey) {
      return checkConfig.rowKey
    } else if (rowKey && typeof rowKey === 'string') {
      return rowKey
    }
    return ''
  }

  /**
   * 加载完成数据之后，对全选的处理
   * @param {any[]} dataAry 表格的值
   */
  const checkAllLoadindData = (dataAry: any[]) => {
    // 设置全选的时候
    if (checkConfig) {
      const key: string = onResultKey()
      // 设置值
      if (checkConfig.checkAll) {
        const selectedRowKeys = dataAry.filter((el: any) => !checkValue.excludedId.includes(el[key])).map((el: any) => el[key])
        onSetSelectedRowKeys(selectedRowKeys)
      } else {
        const selectedRowKeys = dataAry.filter((el: any) => checkValue.includedId.includes(el[key])).map((el: any) => el[key])
        onSetSelectedRowKeys(selectedRowKeys)
      }
    }
  }

  /**
   * 单行的选择
   * @param record       是否选中
   * @param selected     当前改变的行
   * @param selectedRows 当前页所有选中的行
   */
  const onSelect = (type: 'all' | 'select' = 'select', record: any, selected: any, selectedRows?: any) => {
    if (checkConfig) {
      const { checkAll, onCheckValue }: CheckConfigProps = checkConfig
      const key: string = onResultKey()
      if (checkAll) { // 全选
        const index: number = checkValue.excludedId.indexOf(record[key])
        if (selected && index >= 0) { // 选中则删除
          checkValue.excludedId.splice(index, 1)
          checkValue.excludedObj.splice(index, 1)
        } else if (!selected && index < 0) { // 未选中则新增
          checkValue.excludedId.push(record[key])
          checkValue.excludedObj.push(record)
        }
      } else { // 没有全选的
        let index: number = checkValue.includedId.indexOf(record[key])
        if (!selected && index >= 0) { // 选中则则新增
          checkValue.includedId.splice(index, 1)
          checkValue.includedObj.splice(index, 1)
        } else if (selected && index < 0) { // 未选中则删除
          checkValue.includedId.push(record[key])
          checkValue.includedObj.push(record)
        }
      }
      // 返回值
      if (type === 'select' && onCheckValue) {
        checkValue.total = checkAll && tabelPagination.total ? tabelPagination.total - checkValue.excludedId.length : checkValue.includedId.length
        onCheckValue(checkValue)
      }
    }
  }

  /**
   * 顶部的全选
   * @param selected      是否选中
   * @param selectedRows  当前页选中
   * @param changeRows    当前页选中或取消的行
   */
  const onSelectAll = (selected: any, selectedRows: any, changeRows: any) => {
    changeRows.forEach((record: any) => {
      onSelect('all', record, selected)
    })
    if (checkConfig && checkConfig.onCheckValue) {
      checkValue.total = checkConfig.checkAll && tabelPagination.total ? tabelPagination.total - checkValue.excludedId.length : checkValue.includedId.length
      checkConfig.onCheckValue(checkValue)
    }
  }

  /** 全选和取消全选 */
  const onChageCheckAll = (checkAll: boolean) => {
    const { onChageCheckAll, onCheckValue }: CheckConfigProps = checkConfig as CheckConfigProps
    // 根据当前的值返回对应的信息
    if (onChageCheckAll) onChageCheckAll(checkAll)
    if (checkAll) {
      const key: string = onResultKey()
      if (isEmpty(key)) {
        console.error('[cus Error]: 请设置全选的时候的ID')
        return false
      } else {
        const dataSourceAry = dataSourceProps || dataSource || []
        // 存在配置
        const selectedRowKeys = dataSourceAry.map((el: any) => el[key])
        checkValue.total = checkAll && tabelPagination.total ? tabelPagination.total - checkValue.excludedId.length : checkValue.includedId.length
        onSetSelectedRowKeys(selectedRowKeys)
      }
    } else {
      checkValue.total = 0
      onSetSelectedRowKeys([])
    }
    // 清除信息
    checkValue.excludedId = []
    checkValue.excludedObj = []
    checkValue.includedId = []
    checkValue.includedObj = []
    onSetCheckValue(checkValue)
    if (onCheckValue) onCheckValue(checkValue)
  }

  /** 初始化全选的 */
  const initRowSelection = () => {
    return checkConfig ? {
      fixed: true,
      selectedRowKeys: selectedRowKeys,
      onChange: (selectedRowKeys: any) => onSetSelectedRowKeys(selectedRowKeys),
      onSelect: (record: any, selected: any, selectedRows?: any) => onSelect('select', record, selected, selectedRows),
      onSelectAll: onSelectAll,
      ...rowSelectionProps
    } : rowSelectionProps
  }
  /** ------------------------复选框的 end -------------------------- */

  return <React.Fragment>
    <Table
      ref={tableRef}
      rowKey={rowKey}
      columns={resetColumns}
      loading={loading}
      pagination={false}
      title={titleRender}
      onChange={onHandleTableChange}
      rowSelection={initRowSelection()}
      dataSource={dataSourceProps || dataSource || []}
      scroll={{ scrollToFirstRowOnChange: true, y: height, ...scroll }}
      footer={isnoDatafooter || dataSource.length > 0 ? footerRender : undefined}
      className='table-container'
      {...props}
    />
    {dataSource.length > 0 && (isshowPagination || footerPageRender || checkConfig) && <Row justify='space-between' className='sjcommon-table-pagination'>
      <Col>
        {checkConfig && <Space size={20} style={{ lineHeight: '26px', marginRight: 6, paddingLeft: 10 }}>
          <SpanText disabled={checkConfig?.disabled || checkConfig?.checkAll} cursor='pointer' onClick={() => onChageCheckAll(true)}>全选</SpanText>
          <SpanText disabled={checkConfig?.disabled || !checkConfig?.checkAll} cursor='pointer' onClick={() => onChageCheckAll(false)}>取消</SpanText>
          <SpanText type='default'>已选中：<span className='footer-pagination-num'>{checkValue.total || 0}</span> 条</SpanText>
        </Space>}
        {footerPageRender && footerPageRender()}
      </Col>
      <Col>{isshowPagination && <Pagination {...tabelPagination} onChange={onChangePagination} />}</Col>
    </Row>}
  </React.Fragment>
}
