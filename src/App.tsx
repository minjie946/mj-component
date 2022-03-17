import { useEffect, useState } from 'react'
import { Row, Col, Button } from 'antd'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import Table from './table/index'
import TableDetail from './table/subpage/detail'

function App () {
  return (<Router>
    <Switch>
      <Route path="/" exact component={Table} />
      <Route path="/errorPage" exact component={TableDetail}/>
    </Switch>
  </Router>)
}

export default App
