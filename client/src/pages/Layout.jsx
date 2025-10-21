import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const Layout = () => {
  return (
    <div>
        <div className='min-h-screen bg-gray-50'>
            <Navbar/>
            <Outlet/> {/* <Outlet /> is a placeholder (a space) inside a parent route’s component where the child route components will be rendered. */}
        </div>
    </div>
  )
}

export default Layout