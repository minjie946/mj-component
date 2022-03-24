/**
 * @description table
 * @author minjie
 * @Date 2021-01-27 19:58
 * @LastEditTime 2022-03-18 15:26
 * @LastEditors minjie
 * @copyright Copyright © 2021 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import React from 'react'
import { CheckValueProps, TableColumnMixsProps, TableItem, SearchForm, Content, SpanText } from '../../components/index'
import { Row, Col, Space, Button } from 'antd'
import SearchItem from './component/SearchItem'
import moment from 'moment'

const { SearchContent } = Content

const userQuery = { // 查询用户列表（分页）接口
  path: 'stallone/user/findUserPageList/{projectName}'
}

interface TabelState {
  /** 加载表格数据 */
  loading: boolean
  /** 搜索条件 */
  searchParam: any
  /** 是否全选 */
  checkAll: boolean
  /** 清空数据 */
  clear: boolean
  /** 全选的数据 */
  checkData?: CheckValueProps
}
export default class Tabel extends React.Component<any, TabelState> {
  constructor (props: any) {
    super(props)
    this.searchParam = SearchForm.getSearchSaveParam('dome_table', { time: moment() })
    this.state = {
      searchParam: this.searchParam,
      checkAll: false,
      clear: false,
      loading: true
    }
  }

  /** 搜索的条件 */
  private searchParam: any = {}

  /** 搜索 */
  onFinishData = (value: any, type: any) => {
    this.searchParam = value
    if (type === 'submit') {
      this.onLoading(true)
    }
  }

  /** 加载数据 */
  onLoading = (loading: boolean) => {
    this.setState({ loading, searchParam: this.searchParam })
  }

  checkAll = (checkAll: boolean) => {
    this.setState({ checkAll })
  }

  /** 顶部操作栏 */
  titleRender = () => {
    return <Row justify='space-between'>
      <Col flex='400px'>
        <Space>
          <Button type='primary'>新增</Button>
          <Button type='primary' onClick={() => this.setState({ clear: true })}>清空</Button>
        </Space>
      </Col>
    </Row>
  }

  onTableChange = ({ filters, sorter }: any) => {
    // 排序规则
    let order: any = ''
    // 排序的列名
    let orderByColumn: any
    if (sorter.order === 'ascend' || sorter.order === 'descend') {
      order = sorter.order === 'ascend' ? 'asc' : 'desc'
      orderByColumn = sorter.columnKey
      this.searchParam = { ...this.searchParam, sidx: orderByColumn, sord: order }
    } else {
      this.searchParam = { ...this.searchParam, orderByColumn: undefined, order: undefined }
    }
    return Promise.resolve(this.searchParam)
  }

  /** 选中的返回值 */
  onCheckValue = (checkData: CheckValueProps) => {
    const { excludedId, excludedObj, includedId, includedObj } = checkData
    // console.log('excluded', excludedId, excludedObj)
    console.log('included', includedId, includedObj)
    this.setState({ checkData })
  }

  render () {
    const { checkAll, loading, searchParam, clear } = this.state
    const columnData: TableColumnMixsProps<any>[] = [
      {
        title: '账户ID',
        dataIndex: 'userID',
        key: 'userID',
        sorter: (a, b) => a.userID - b.userID
      },
      { title: '账户姓名', dataIndex: 'userName', key: 'userName' },
      { title: '手机号', dataIndex: 'userPhone', type: 'money', key: 'userPhone' },
      {
        title: '账号状态',
        dataIndex: 'userProjs',
        key: 'userProjs',
        render: (userProjsAry: any) => {
          const { userEnabled } = userProjsAry[0]
          return userEnabled ? '已启用' : '已停用'
        }
      },
      { title: '创建时间', dataIndex: 'userCtime', key: 'userCtime', align: 'center', render: (text: string) => text },
      {
        title: '操作',
        key: 'tags',
        fixed: 'right',
        align: 'center',
        width: 120,
        className: 'tabele-header-flxed',
        render: (recond: any) => {
          return <Space size={10}>
            <SpanText cursor='pointer' to='/home/table/detail' type='info'>查看</SpanText>
          </Space>
        }
      }
    ]
    return (
      <div>
        <SearchContent>
          <SearchItem savesearchparam='dome_table' onFinishData={this.onFinishData} searchParam={searchParam} />
        </SearchContent>
        <Content style={{ marginTop: 10 }}>
          <TableItem
            rowKey='userID'
            action={userQuery}
            params={searchParam}
            columns={columnData}
            checkConfig={{
              checkAll,
              clear,
              onClear: (clear: boolean) => this.setState({ clear }),
              onChageCheckAll: this.checkAll,
              onCheckValue: this.onCheckValue
            }}
            rowSelection={{
              getCheckboxProps: () => ({ disabled: checkAll }) // 必须放在 rowSelection 中全选禁用 才会生效
            }}
            loading={loading}
            onLoading={this.onLoading}
            scroll={{ x: 600 }}
            onTableChange={this.onTableChange}
            titleRender={this.titleRender}
          />
        </Content>
      </div>
    )
  }
}
