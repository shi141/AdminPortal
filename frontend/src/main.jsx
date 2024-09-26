import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Routes_user from './route.jsx'
import './styles/index.css'
import { BrowserRouter as Router } from 'react-router-dom';

import { Provider } from 'react-redux';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
    <Routes_user />
    </Router>
  </StrictMode>,
)
