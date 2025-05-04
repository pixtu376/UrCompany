import React from 'react'
import logo from '../Image/logo.png'
import userIcon from '../Image/User.png'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../Styles/header.css'

function Header() {
	const { user } = useAuth()

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
			<button className='User'>
				<Link to={user ? '/dashboard' : '/login'}>
					<img className='Userlogo' src={userIcon} alt=''></img>
					<p>Личный кабинет</p>
				</Link>
			</button>
		</div>
	)
}

export default Header
