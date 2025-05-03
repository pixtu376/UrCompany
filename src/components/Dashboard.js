import React, { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import '../Styles/Dashboard.css'

function Dashboard() {
	const { user, orders } = useAuth()

	if (!user) {
		return <Navigate to='/login' />
	}

	return (
		<div className='dashboard'>
			<h1>Личный кабинет</h1>
			<div className='user-info'>
				<h2>Ваши данные</h2>
				<p>
					<strong>Имя:</strong> {user.first_name || 'Не указано'}
				</p>
				<p>
					<strong>Фамилия:</strong> {user.last_name || 'Не указано'}
				</p>
				<p>
					<strong>Email:</strong> {user.email}
				</p>
			</div>

			<div className='orders-section'>
				<h2>Ваши заказы</h2>
				{orders.length === 0 ? (
					<p>У вас пока нет заказов</p>
				) : (
					<div className='orders-list'>
						{orders.map(order => (
							<div key={order.id} className='order-card'>
								<h3>{order.tariff.name}</h3>
								<p>
									<strong>Статус:</strong> {order.status}
								</p>
								<p>
									<strong>Дата:</strong>{' '}
									{new Date(order.created_at).toLocaleDateString()}
								</p>
								<p>
									<strong>Сумма:</strong> {order.tariff.price} ₽
								</p>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default Dashboard
