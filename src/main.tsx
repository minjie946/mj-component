import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { default as BaseSpan } from '../components/span-text'
import './index.css'

BaseSpan.config = {
  power: ['aaa'],
  powerData: ['22']
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
