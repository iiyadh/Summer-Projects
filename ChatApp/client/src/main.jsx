
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Login from './Pages/Login.jsx';
import Register from './Pages/Register.jsx';
import ForgotPassword from './Pages/ForgetPassword.jsx';
import NotFound from './Pages/NotFound.jsx';
import Home from './Pages/Home.jsx';
import ResetPassword from './Pages/ResetPassword.jsx';

const router = createBrowserRouter([
  {
    path:'/',
    element:<App />,
    children:[
      {index: true, element: <Home />},
      {path: 'login', element: <Login />},
      {path: 'register', element: <Register/>},
      {path: 'forgot-password', element: <ForgotPassword />},
      {path: 'reset-password/:token', element: <ResetPassword />},
      {path: '*', element: <NotFound/>},
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />,
)
