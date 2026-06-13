import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs'
import 'prismjs/components/prism-java'
import { useAppStore } from './store/useAppStore'

useAppStore.getState().incrementSessionCount()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
