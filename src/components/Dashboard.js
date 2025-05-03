import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import '../Styles/PersonalAccount.css'

const Dashboard = () => {
	// Получаем пользователя и список заявлений из контекста аутентификации
	const { user, orders } = useAuth()

	// Если пользователь не авторизован, перенаправляем на страницу входа
	if (!user) {
		return <Navigate to='/LoginPage' replace />
	}

	// Функция для отображения значения с проверкой на пустоту или "Не заполнено"
	const renderValue = (value) => {
		if (!value || value === 'Не заполнено') {
			return <span className='not-specified'>не указан</span>
		}
		return value
	}

	return (
		<div className='personal-account'>
			<div className='account-container'>
				{/* Боковая панель с навигацией */}
				<aside className='account-sidebar'>
					<nav>
						<ul>
							<li className='active'>Уведомления</li>
							<li>Настройки</li>
							<li>Мои данные</li>
							<li className='user-name'>
								{user?.firstName || user?.email || 'Пользователь'}
							</li>
						</ul>
					</nav>
				</aside>

				{/* Основной контент личного кабинета */}
				<main className='account-content'>
					<div className='top-row'>
						{/* Основная информация пользователя */}
						<section className='main-info-block'>
							<h2>Основная информация</h2>
							<div className='info-table'>
								<div className='info-row'>
									<span className='info-label'>ФИО</span>
									<span className='info-value'>
										{renderValue(
											`${user?.lastName || ''} ${user?.firstName || ''} ${user?.middleName || ''}`.trim() || 'Не заполнено'
										)}
									</span>
								</div>
								<div className='info-row'>
									<span className='info-label'>Дата рождения</span>
									<span className='info-value'>01.01.2023</span>
								</div>
								<div className='info-row'>
									<span className='info-label'>Пол</span>
									<span className='info-value'>Мужской</span>
								</div>
							</div>
						</section>

						{/* Информация о документах */}
						<section className='documents-block'>
							<h2>Мои документы</h2>
							<div className='info-section'>
								<h3>Тип документа</h3>
								<p className='info-value'>{renderValue('Не заполнено')}</p>
							</div>

							<div className='info-section'>
								<h3>Серия и номер</h3>
								<p className='info-value'>{renderValue('Не заполнено')}</p>
							</div>

							<div className='info-section'>
								<h3>Дата выдачи</h3>
								<p className='info-value'>{renderValue('Не заполнено')}</p>
							</div>

							<div className='info-section'>
								<h3>Кем выдан</h3>
								<p className='info-value'>{renderValue('Не заполнено')}</p>
							</div>

							<div className='info-section'>
								<h3>СНИЛС</h3>
								<p className='info-value'>{renderValue('Не заполнено')}</p>
							</div>
						</section>
					</div>

					{/* Адрес регистрации */}
					<section className='address-block'>
						<h2>Адрес регистрации</h2>
						<div className='address-grid'>
							<div className='address-item'>
								<span>Населённый пункт</span>
								<p className='info-value'>{renderValue('Не заполнено')}</p>
							</div>
							<div className='address-item'>
								<span>Улица</span>
								<p className='info-value'>{renderValue('Не заполнено')}</p>
							</div>
							<div className='address-item'>
								<span>Дом</span>
								<p className='info-value'>{renderValue('Не заполнено')}</p>
							</div>
							<div className='address-item'>
								<span>Корпус</span>
								<p className='info-value'>{renderValue('Не заполнено')}</p>
							</div>
							<div className='address-item'>
								<span>Квартира</span>
								<p className='info-value'>{renderValue('Не заполнено')}</p>
							</div>
						</div>
					</section>

					{/* Секция с заявлениями, динамически отображаемыми из orders */}
					<section className='applications-block'>
						<h2>Мои заявления</h2>
						<div className='applications-list'>
							{orders && orders.length > 0 ? (
								orders.map((order) => (
									<div key={order.id} className='application-item'>
										<div className='application-info'>
											<p className='service-name'>{order.tariff?.name || 'Не указано'}</p>
											<p className='registration-date'>
												{order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Не указано'}
											</p>
											<p className='total-check'>{order.tariff?.price ? `${order.tariff.price} ₽` : 'Не указано'}</p>
										</div>
										<div className='application-actions'>
											<button className='status-btn'>Статус</button>
											<button className='cancel-btn'>Отменить заявку</button>
										</div>
									</div>
								))
							) : (
								<p>Заявлений пока нет</p>
							)}
						</div>
					</section>
				</main>
			</div>
		</div>
	)
}

export default Dashboard
