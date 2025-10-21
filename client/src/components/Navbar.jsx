import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {

  const user = {name : "Amol Raut"}  // dummy user
  const navigate = useNavigate() //it gives you a function you can use to change pages (navigate) programmatically that means via code, not by clicking a <Link>.
  
  //logoutUser function for logout functinality
  const logoutUser = () => {
    navigate('/')
  }
  
  return (
    <div className='shadow bg-white'>
      <nav className='flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800 transition-all'>
        <Link to='/'>
          <img src="/logo.svg" alt="logo" className='h-8 w-auto' />
        </Link>
        <div className='flex items-center gap-4 text-sm'>
          <p className='max-sm:hidden'>Hi, {user?.name}</p> {/* “If user exists, show user.name. Otherwise, don’t crash — just return undefined.” */}
          <button onClick={logoutUser} className='bg-white hover:bg-slate-50 border border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all'>Logout</button>
        </div>
      </nav>
    </div>
  )
}

export default Navbar