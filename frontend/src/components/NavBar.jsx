import React, { useState, useEffect, useRef, useContext } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const NavBar = () => {
    const { token, userData, logout } = useContext(ShopContext)
    const isAuthenticated = !!token
    const [profileDropdown, setProfileDropdown] = useState(false)
    const navigate = useNavigate()
    const dropdownRef = useRef(null)

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setProfileDropdown(false)
            }
        }

        if (profileDropdown) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }

        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [profileDropdown])

    const handleItemsClick = (e) => {
        if (!isAuthenticated()) {
            e.preventDefault()
            navigate('/login')
        }
    }

    const handleBrowseItemsClick = (e) => {
        if (!isAuthenticated()) {
            e.preventDefault()
            navigate('/login')
        }
    }

    const handlePostItemsClick = (e) => {
        if (!isAuthenticated()) {
            e.preventDefault()
            navigate('/login')
        }
    }

    const handleLogout = () => {
        logout()
        setProfileDropdown(false)
        navigate('/login')
    }

    return (
        <nav className='flex items-center justify-between px-8 py-6 bg-white relative z-50'>
            {/* Logo */}
            <div className='text-2xl font-bold text-orange-500'>
                TRASH TO TREASURE
            </div>

            {/* Navigation Links */}
            <div className='hidden md:flex items-center space-x-12'>
                <NavLink to="/" className={({ isActive }) => `text-lg transition-colors ${isActive ? 'text-indigo-400 font-semibold' : 'text-gray-400 hover:text-indigo-400'}`}>
                    Home
                </NavLink>
                <NavLink to="/about" className={({ isActive }) => `text-lg transition-colors ${isActive ? 'text-indigo-400 font-semibold' : 'text-gray-400 hover:text-indigo-400'}`}>
                    About
                </NavLink>
                <NavLink to="/browse-items" onClick={handleBrowseItemsClick} className={({ isActive }) => `text-lg transition-colors ${isActive ? 'text-indigo-400 font-semibold' : 'text-gray-400 hover:text-indigo-400'}`}>
                    Browse Items
                </NavLink>
                <NavLink to="/post-items" onClick={handlePostItemsClick} className={({ isActive }) => `text-lg transition-colors ${isActive ? 'text-indigo-400 font-semibold' : 'text-gray-400 hover:text-indigo-400'}`}>
                    Post Items
                </NavLink>
            </div>

            {/* Right Icons */}
            <div className='flex items-center space-x-4 relative'>
                {/* User Icon + Dropdown */}
                <div className='relative' ref={dropdownRef}>
                    <button
                        onClick={() => setProfileDropdown(!profileDropdown)}
                        className='p-2 text-gray-400 hover:text-indigo-400 transition-colors'
                    >
                        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                        </svg>
                    </button>

                    {profileDropdown && (
                        <div className='absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50'>
                            {isAuthenticated ? (
                                <>
                                    <Link to="/profile" onClick={() => setProfileDropdown(false)} className='block px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border-b border-gray-100'>
                                        My Profile
                                    </Link>
                                    <Link to="/requests" onClick={() => setProfileDropdown(false)} className='block px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border-b border-gray-100'>
                                        Requests
                                    </Link>
                                    <button onClick={handleLogout} className='block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors'>
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setProfileDropdown(false)} className='block px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border-b border-gray-100'>
                                        Login
                                    </Link>
                                    <Link to="/login?mode=signup" onClick={() => setProfileDropdown(false)} className='block px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors'>
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default NavBar