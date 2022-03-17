import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Axios } from './axios'
import { SpanText, TableItem  } from '../components/index'
import './index.css'

SpanText.config({
  power: ['aaa'],
  powerData: ['22'],
  passDev: false
})

TableItem.config({
  axios: Axios
})

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
