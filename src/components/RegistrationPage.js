// src/components/RegistrationPage.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from '../contexts/AuthContext'
import { TextInput } from './FormInputs'
import '../Styles/Login.css'

const schema = yup.object().shape({
	email: yup
		.string()
		.email('Неверный формат email')
		.required('Email обязателен'),
	password: yup
		.string()
		.min(6, 'Минимум 6 символов')
		.required('Пароль обязателен'),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref('password'), null], 'Пароли должны совпадать')
		.required('Подтверждение пароля обязательно'),
})

function RegistrationPage() {
	const { login } = useAuth()
	const [activeTab, setActiveTab] = useState('juridical')
	const navigate = useNavigate()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	})

	const onSubmit = data => {
		console.log({ ...data, userType: activeTab })
		login({ ...data, userType: activeTab })
		navigate('/dashboard')
	}

	return (
		<div className='login-page'>
			<div className='login-container'>
				<h1>Регистрация</h1>

				<div className='auth-options'>
					<div className='auth-buttons'>
						<button
							type='button'
							className={`auth-button ${
								activeTab === 'physical' ? 'active' : ''
							}`}
							onClick={() => setActiveTab('physical')}
						>
							Зарегистрироваться как физ. лицо
						</button>
						<button
							type='button'
							className={`auth-button ${
								activeTab === 'juridical' ? 'active' : ''
							}`}
							onClick={() => setActiveTab('juridical')}
						>
							Зарегистрироваться как юр. лицо
						</button>
					</div>
					<Link to='/login' className='register-link'>
						Войти
					</Link>
				</div>

				<div className='divider'></div>

				<form onSubmit={handleSubmit(onSubmit)} className='login-form'>
					<TextInput
						label='Email'
						name='email'
						type='email'
						placeholder='Введите email'
						register={register}
						required
						errors={errors}
					/>

					<TextInput
						label='Пароль'
						name='password'
						type='password'
						placeholder='Введите пароль'
						register={register}
						required
						errors={errors}
					/>

					<TextInput
						label='Подтверждение пароля'
						name='confirmPassword'
						type='password'
						placeholder='Подтвердите пароль'
						register={register}
						required
						errors={errors}
					/>

					<button type='submit' className='login-button'>
						Зарегистрироваться
					</button>
				</form>
			</div>
		</div>
	)
}

export default RegistrationPage
