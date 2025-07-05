
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
import Chat from './Pages/Chat.jsx';
import ChatHome from './Components/ChatHome.jsx';
import ChatHistory from './Components/ChatHistory.jsx';
import { Navigate } from 'react-router-dom';
import Settings from './Pages/Settings.jsx';
import  EditProfile  from './Components/EditProfile.jsx';
import Apperance from './Components/Apparence.jsx';
import Language from './Components/Language.jsx';
import ManageFriends from './Components/ManageFriends.jsx';

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
      {
        path: '/chat',
        element: <Chat />,
        children:[
          {index: true, element: <ChatHome/>},
          {path: 'friends', element: <ManageFriends />},
          {path: ':chatId', element: <ChatHistory />},
        ]
      },
      {
        path: '/settings',
        element:<Settings />,
        children:[
          {index: true, element: <Navigate to="/settings/profile" replace />},
          {path: 'profile', element: <EditProfile />},
          {path: 'apparence' , element: <Apperance />},
          {path: 'language' , element: <Language />},
        ]
      }
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />,
)
