import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Axios } from './axios'
import { setSpanConfig, setTableConfig  } from '../components/index'
import './index.css'

setSpanConfig({
  power: ['aaa'],
  powerData: ['22'],
  passDev: false
})

setTableConfig({
  axios: Axios
})

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
