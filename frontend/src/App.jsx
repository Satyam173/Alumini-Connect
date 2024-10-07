import './App.css'
import React from 'react'
import Signup from '@/components/Signup'
import Login from '@/components/Login'
import { createBrowserRouter} from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import MainLayout from '@/components/MainLayout'
import Home from '@/components/Home'
import Profile from '@/components/Profile'
import EditProfile from './components/EditProfile'
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/profile/:id',
        element: <Profile />,
      },
      {
        path: '/account/edit',
        element: <EditProfile />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
 
]);
function App() {
  

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
