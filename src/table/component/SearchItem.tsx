/**
 * @description 账户管理搜索
 * @author minjie
 * @createTime 2019/11/26
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import React from 'react'
import { Input, DatePicker } from 'antd'
import { SearchForm, SearchFormProps } from '../../../components/index'

const { Item } = SearchForm

interface SearchItemProps extends SearchFormProps {
  searchParam: any
}

export default class SearchItem extends React.Component<SearchItemProps> {
  onFinish = (values: any, type?: any) => {
    const { onFinishData } = this.props
    if (onFinishData) onFinishData(values, type)
  }

  render () {
    const { savesearchparam, searchParam } = this.props
    return (
      <SearchForm
        initialValues={searchParam}
        onFinishData={this.onFinish}
        savesearchparam={savesearchparam}
        collapsed
      >
        <Item label="账户姓名" name='userName'>
          <Input allowClear placeholder='请输入' autoComplete='off' />
        </Item>
        <Item label="手机号码" name='userPhone'>
          <Input allowClear placeholder='请输入' autoComplete='off' />
        </Item>
        <Item label="日期" name='time'>
          <DatePicker allowClear placeholder='请输入' style={{ width: '100%' }} />
        </Item>
      </SearchForm>
    )
  }
}
