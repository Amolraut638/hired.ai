import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>  {/* it enables client-side routing — meaning, it lets your React app behave like a multi-page application while actually being a single-page app (SPA).  */} 
    <App />
  </BrowserRouter>,
)
