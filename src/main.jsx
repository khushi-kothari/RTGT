import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Issues from './components/pages/Issues.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <App />
  </>,
)
