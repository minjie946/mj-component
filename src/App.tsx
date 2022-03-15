import { useEffect, useState } from 'react'
import { Row, Col, Button } from 'antd'
import Content from '../components/content'
import { default as BaseSpan, SpanText } from '../components/span-text'
import './App.css'

function App () {
  const [show, setShow] = useState<boolean>(false)

  const changePower = () => {
    BaseSpan.config = {
      power: ['aaa', 'bbb'],
      powerData: ['22', '11'],
      passDev: false
    }
    setShow(true)
  }

  return (<Content>
    <Row gutter={[10, 10]}>
      <Col>
        <Button type='primary' onClick={changePower}>改变</Button>
      </Col>
      <Col>
        <SpanText powerCode='aaa'>sss</SpanText>
        {show && <SpanText powerCode='bbbb'>cbbbs</SpanText>}
      </Col>
    </Row>
  </Content>)
}

export default App
