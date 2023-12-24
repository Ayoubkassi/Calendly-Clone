import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CalendarDetails from './pages/CalendarDetails.jsx'
import Summit from './pages/Summit.jsx'
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
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
