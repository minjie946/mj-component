/**
 * @description 详情
 * @author minjie
 * @Date 2021-10-15 14:28
 * @LastEditTime 2022-03-16 17:16
 * @LastEditors minjie
 * @copyright Copyright © 2021 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import React from 'react'
import { Content } from '../../../components/index'
import { RouteComponentProps } from 'react-router-dom'
import { Button } from 'antd'

export default ({ history }:RouteComponentProps) => {
  return <Content isfooter>
    <Content.Footer>
      <Button type='primary' onClick={() => history.goBack()}>返回</Button>
    </Content.Footer>
  </Content>
}
