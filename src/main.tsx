import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {Provider} from 'react-redux'
import store from './redux/app/store.ts'
import { Toaster } from 'sonner'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
  <React.StrictMode>
    <Toaster position='top-center' richColors />
    <App />
  </React.StrictMode>,
  </Provider>
)
