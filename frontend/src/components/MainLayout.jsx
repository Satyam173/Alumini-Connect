import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

const MainLayout = () => {
  return (
    <div>
      <div>
        <LeftSidebar />
        <Outlet />
      </div>

    </div>
  )
}

export default MainLayout
