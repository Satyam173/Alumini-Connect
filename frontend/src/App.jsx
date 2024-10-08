import './App.css'
import React, { useEffect } from 'react'
import Signup from '@/components/Signup'
import Login from '@/components/Login'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import MainLayout from '@/components/MainLayout'
import Home from '@/components/Home'
import Profile from '@/components/Profile'
import EditProfile from './components/EditProfile'
import { io } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux' // Import useDispatch
import { setSocket } from './redux/socketSlice.js' // Make sure this is correct
import { setOnlineSocket } from './redux/chatSlice' // Import setOnlineSocket

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
  const dispatch = useDispatch(); // Get dispatch from useDispatch
  const { user } = useSelector(store => store.auth);

  useEffect(() => {
    let socketio; // Declare socketio here

    if (user) {
      socketio = io('http://localhost:8000', {
        query: {
          userId: user?.id,
        },
        transports: ['websocket'],
      });
      dispatch(setSocket(socketio));

      // Listen to all the events
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineSocket(onlineUsers)); // Dispatch the online users
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }
    } else {
      if (socketio) {
        socketio.close();
        dispatch(setSocket(null));
      }
    }
  }, [user, dispatch]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App;
