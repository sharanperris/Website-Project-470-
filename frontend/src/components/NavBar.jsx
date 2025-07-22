import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const NavBar = () => {
    const [visible, setVisible] = useState(false)

    const handleLogout = () => {
        localStorage.removeItem('token');
        alert('You have been logged out successfully!');
        window.location.href = '/';
    }
    
    return (
        <div className='flex items-center justify-between px-6 md:px-12 py-6 bg-white shadow-sm'>
            {/* Logo */}
            <div className='text-2xl font-bold text-green-600'>
                Trash To Treasure
            </div>
            
            {/* Desktop Navigation */}
            <div className='hidden md:flex items-center gap-8'>
                <NavLink 
                    to="/" 
                    className={({ isActive }) => 
                        `font-medium transition-all duration-200 hover:text-green-600 hover:font-semibold hover:underline ${
                            isActive ? 'text-green-600 font-semibold' : 'text-gray-800'
                        }`
                    }
                >
                    Home
                </NavLink>
                <NavLink 
                    to="/about" 
                    className={({ isActive }) => 
                        `font-medium transition-all duration-200 hover:text-green-600 hover:font-semibold hover:underline ${
                            isActive ? 'text-green-600 font-semibold' : 'text-gray-800'
                        }`
                    }
                >
                    About
                </NavLink>
                <NavLink 
                    to="/item" 
                    className={({ isActive }) => 
                        `font-medium transition-all duration-200 hover:text-green-600 hover:font-semibold hover:underline ${
                            isActive ? 'text-green-600 font-semibold' : 'text-gray-800'
                        }`
                    }
                >
                    Items
                </NavLink>
                <NavLink 
                    to="/login" 
                    className={({ isActive }) => 
                        `font-medium transition-all duration-200 hover:text-green-600 hover:font-semibold hover:underline ${
                            isActive ? 'text-green-600 font-semibold' : 'text-gray-800'
                        }`
                    }
                >
                    Log in
                </NavLink>
                <Link 
                    to="/login" 
                    className='bg-green-500 text-white px-6 py-2 rounded-full font-medium hover:bg-green-600 hover:shadow-lg transition-all duration-200'
                >
                    Sign Up
                </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
                onClick={() => setVisible(true)} 
                className='md:hidden flex flex-col gap-1 cursor-pointer'
            >
                <div className='w-6 h-0.5 bg-gray-800'></div>
                <div className='w-6 h-0.5 bg-gray-800'></div>
                <div className='w-6 h-0.5 bg-gray-800'></div>
            </button>

            {/* Mobile sidebar menu */}
            <div className={`fixed top-0 right-0 bottom-0 overflow-hidden bg-white transition-all z-50 shadow-lg ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-gray-800'>
                    <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-6 cursor-pointer border-b hover:bg-gray-50'>
                        <span className='text-xl'>←</span>
                        <p>Back</p>
                    </div>
                    <NavLink onClick={()=>setVisible(false)} className='py-4 px-6 border-b hover:bg-green-50 hover:text-green-600 transition-colors' to='/'>
                        Home
                    </NavLink>
                    <NavLink onClick={()=>setVisible(false)} className='py-4 px-6 border-b hover:bg-green-50 hover:text-green-600 transition-colors' to='/about'>
                        About
                    </NavLink>
                    <NavLink onClick={()=>setVisible(false)} className='py-4 px-6 border-b hover:bg-green-50 hover:text-green-600 transition-colors' to='/item'>
                        Items
                    </NavLink>
                    <NavLink onClick={()=>setVisible(false)} className='py-4 px-6 border-b hover:bg-green-50 hover:text-green-600 transition-colors' to='/login'>
                        Log in
                    </NavLink>
                    <Link onClick={()=>setVisible(false)} className='py-4 px-6 border-b hover:bg-green-50 hover:text-green-600 transition-colors' to='/login'>
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default NavBar