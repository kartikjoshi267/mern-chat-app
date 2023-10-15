import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ChatProvider from './context/ChatProvider.jsx'
import { BrowserRouter } from 'react-router-dom'
import NotificationProvider from './context/NotificationProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <ChatProvider>
  <NotificationProvider>
    <App />
  </NotificationProvider>
  </ChatProvider>,
  </BrowserRouter>
)
