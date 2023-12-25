import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CalendarDetails from './pages/CalendarDetails.jsx'
import Summit from './pages/Summit.jsx'
import Dashboard from './pages/Dashboard.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "details",
    element: <CalendarDetails />
  },
  {
    path: "summit",
    element: <Summit />
  },
  {
    path: "dashboard",
    element: <Dashboard />
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
