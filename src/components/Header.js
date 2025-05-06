import React from 'react'
import logo from '../Image/logo.png'
import userIcon from '../Image/User.png'
import logoutIcon from '../Image/logout.png' // Assuming you have a logout icon image, otherwise will use text
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../Styles/header.css'

function Header() {
	const { user, logout } = useAuth()

	return (
		<div className='header'>
			<div className='logo'>
				<img src={logo} alt='' className='imgHeader'></img>
				<p className='textLogo'>Nova</p>
			</div>
			<div className='buttons'>
				<button>
					<Link to='/calculator'>Калькулятор</Link>
				</button>
				<button>
					<Link to='/legal-clients'>Для юр. лиц</Link>
				</button>
				<button>
					<Link to='/physical-clients'>Для физ. лиц</Link>
				</button>
			</div>
			<div className='user-actions'>
				<button className={`User ${user ? 'User-authenticated' : ''}`}>
					<Link to={user ? (user.is_staff ? '/admin-tariffs' : '/dashboard') : '/login'}>
						<img className='Userlogo' src={userIcon} alt=''></img>
						<p>{user && user.email ? user.email.split('@')[0] : 'Личный кабинет'}</p>
					</Link>
				</button>
				{user && (
					<button className='logout-button' onClick={logout} title='Выйти'>
						{/* If you have a logout icon image, use it, otherwise use text */}
						<img src={logoutIcon} alt='Выйти' className='logout-icon' />
						{/* Alternatively, uncomment below to use text instead of icon */}
						{/* <span>Выйти</span> */}
					</button>
				)}
			</div>
		</div>
	)
}

export default Header
