import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Navigate, useNavigate } from 'react-router-dom'
import DashboardRedact from './DashboardRedact'
import ChatList from './ChatList'
import Chat from './Chat'
import '../Styles/PersonalAccount.css'

const Dashboard = () => {
  const { user, orders, fetchUser, accessToken } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Мои данные')
  const [localOrders, setLocalOrders] = useState([])
  const [selectedChatId, setSelectedChatId] = useState(null)

  const statusLabels = {
    pending: 'В обработке',
    in_progress: 'Выполняется',
    under_review: 'На проверке',
    cancelled: 'Отменен',
    completed: 'Завершен',
    failed: 'Неудача',
    refunded: 'Возврат',
  }

  const handleCancel = (tab) => {
    if (tab) {
      setActiveTab(tab)
    } else {
      setActiveTab('Мои данные')
    }
  }

  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = React.useState([])

  useEffect(() => {
    if (accessToken && loading) {
      fetchUser(accessToken).then(() => setLoading(false))
    }
  }, [accessToken, fetchUser, loading])

  useEffect(() => {
    setLocalOrders(orders)
  }, [orders])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:8000/notifications/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        if (!response.ok) {
          throw new Error('Ошибка загрузки уведомлений')
        }
        const data = await response.json()
        setNotifications(data)
      } catch (error) {
        console.error('Error fetching notifications:', error)
      }
    }
    if (accessToken) {
      fetchNotifications()
    }
  }, [accessToken])

  useEffect(() => {
    if (activeTab === 'Уведомления' && notifications.length > 0) {
      const unreadNotificationIds = notifications
        .filter(notification => !notification.is_read)
        .map(notification => notification.id)

      if (unreadNotificationIds.length > 0) {
        const markNotificationsRead = async () => {
          try {
            await Promise.all(
              unreadNotificationIds.map(id =>
                fetch(`http://localhost:8000/notifications/${id}/`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                  },
                  body: JSON.stringify({ is_read: true }),
                })
              )
            )
            // Обновить локальное состояние уведомлений
            setNotifications(prevNotifications =>
              prevNotifications.map(notification =>
                unreadNotificationIds.includes(notification.id)
                  ? { ...notification, is_read: true }
                  : notification
              )
            )
          } catch (error) {
            console.error('Error marking notifications as read:', error)
          }
        }
        markNotificationsRead()
      }
    }
  }, [activeTab, notifications, accessToken])

  if (!user && !loading) {
    return <Navigate to='/login' replace />
  }

  // Move statusLabels outside component render to avoid redeclaration

  const renderValue = (value) => {
    if (!value || value === 'Не заполнено') {
      return <span className='not-specified'>не указан</span>
    }
    return value
  }

  const formatFullName = () => {
    const lastName = user?.last_name || ''
    const firstName = user?.first_name || ''
    const middleName = user?.middle_name || ''
    const fullName = `${lastName} ${firstName} ${middleName}`.trim()
    return fullName || 'Не заполнено'
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab)
    if (tab !== 'Чаты') {
      setSelectedChatId(null)
    }
  }

  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId)
    navigate(`/chat/${chatId}`)
  }

  if (activeTab === 'Настройки') {
    return <DashboardRedact onCancel={handleCancel} />
  }

  return (
		<div className='personal-account'>
			<div className='account-container'>
				<aside className='account-sidebar'>
					<nav>
						<ul>
							<li
								className={activeTab === 'Мои данные' ? 'active' : ''}
								onClick={() => handleTabClick('Мои данные')}
								style={{ cursor: 'pointer' }}
							>
								Мои данные
							</li>
							<li
								className={activeTab === 'Настройки' ? 'active' : ''}
								onClick={() => handleTabClick('Настройки')}
								style={{ cursor: 'pointer' }}
							>
								Настройки
							</li>
							<li
								className={activeTab === 'Уведомления' ? 'active' : ''}
								onClick={() => handleTabClick('Уведомления')}
								style={{
									cursor: 'pointer',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
								}}
							>
								<span>Уведомления</span>
								<span className='notification-counter'>
									{
										notifications.filter(notification => !notification.is_read)
											.length
									}
								</span>
							</li>
							<li
								className={activeTab === 'Чаты' ? 'active' : ''}
								onClick={() => handleTabClick('Чаты')}
								style={{ cursor: 'pointer' }}
							>
								Чаты
							</li>
							<li className='user-name'>{user?.email || 'Пользователь'}</li>
						</ul>
					</nav>
				</aside>

				<main className='account-content'>
					{activeTab === 'Уведомления' && (
						<section>
							<h2>Уведомления</h2>
							{notifications.length === 0 ? (
								<p>Уведомлений нет</p>
							) : (
								<ul className='notifications-list'>
									{notifications.map(notification => (
										<li
											key={notification.id}
											className={notification.is_read ? 'read' : 'unread'}
										>
											<p>{notification.message}</p>
											<small>
												{new Date(notification.created_at).toLocaleString()}
											</small>
										</li>
									))}
								</ul>
							)}
						</section>
					)}
					{activeTab === 'Чаты' && !selectedChatId && (
						<section>
							<h2>Чаты</h2>
							<ChatList
								accessToken={accessToken}
								onSelectChat={handleSelectChat}
							/>
						</section>
					)}
					{activeTab === 'Чаты' && selectedChatId && (
						<section>
							<button
								className='back-chat-button'
								onClick={() => setSelectedChatId(null)}
							>
								Назад к списку чатов
							</button>
							<Chat chatId={selectedChatId} accessToken={accessToken} />
						</section>
					)}

					{activeTab === 'Мои данные' && (
						<>
							<div className='top-row'>
								<section className='main-info-block'>
									<h2>Основная информация</h2>
									<div className='info-table'>
										<div className='info-row'>
											<span className='info-label'>ФИО</span>
											<span className='info-value'>
												{renderValue(formatFullName())}
											</span>
										</div>
										<div className='info-row'>
											<span className='info-label'>Дата рождения</span>
											<span className='info-value'>
												{renderValue(user?.birthDate || 'Не заполнено')}
											</span>
										</div>
										<div className='info-row'>
											<span className='info-label'>Пол</span>
											<span className='info-value'>
												{renderValue(user?.gender || 'Не заполнено')}
											</span>
										</div>
									</div>
								</section>

								<section className='documents-block'>
									<h2>Мои документы</h2>
									<div className='info-section'>
										<h3>Тип документа</h3>
										<p className='info-value'>
											{renderValue(user?.document_type || 'Не заполнено')}
										</p>
									</div>

									<div className='info-section'>
										<h3>Серия и номер</h3>
										<p className='info-value'>
											{renderValue(user?.document_number || 'Не заполнено')}
										</p>
									</div>

									<div className='info-section'>
										<h3>Дата выдачи</h3>
										<p className='info-value'>
											{renderValue(user?.document_issue_date || 'Не заполнено')}
										</p>
									</div>

									<div className='info-section'>
										<h3>Кем выдан</h3>
										<p className='info-value'>
											{renderValue(user?.document_issuer || 'Не заполнено')}
										</p>
									</div>

									<div className='info-section'>
										<h3>СНИЛС</h3>
										<p className='info-value'>
											{renderValue(user?.snils || 'Не заполнено')}
										</p>
									</div>
								</section>
							</div>

							<section className='address-block'>
								<h2>Адрес регистрации</h2>
								<div className='address-grid'>
									<div className='address-item'>
										<span>Населённый пункт</span>
										<p className='info-value'>
											{renderValue(user?.address_city || 'Не заполнено')}
										</p>
									</div>
									<div className='address-item'>
										<span>Улица</span>
										<p className='info-value'>
											{renderValue(user?.address_street || 'Не заполнено')}
										</p>
									</div>
									<div className='address-item'>
										<span>Дом</span>
										<p className='info-value'>
											{renderValue(user?.address_house || 'Не заполнено')}
										</p>
									</div>
									<div className='address-item'>
										<span>Корпус</span>
										<p className='info-value'>
											{renderValue(user?.address_building || 'Не заполнено')}
										</p>
									</div>
									<div className='address-item'>
										<span>Квартира</span>
										<p className='info-value'>
											{renderValue(user?.address_apartment || 'Не заполнено')}
										</p>
									</div>
								</div>
							</section>

							<section className='applications-block'>
								<h2>Мои заявления</h2>
								<div className='applications-list'>
									{localOrders && localOrders.length > 0 ? (
										localOrders.map(order => (
											<div key={order.id} className='application-item'>
												<div className='application-info'>
													<p className='service-name'>
														{order.tariff?.name || 'Не указано'}
													</p>
													<p className='registration-date'>
														{order.created_at
															? new Date(order.created_at).toLocaleDateString()
															: 'Не указано'}
													</p>
													<p className='total-check'>
														{order.tariff?.price
															? `${order.tariff.price} ₽`
															: 'Не указано'}
													</p>
												</div>
												<div className='application-actions'>
													<span className='status-label'>
														Статус: {statusLabels[order.status] || 'Не указан'}
													</span>
													<button
														className='cancel-btn'
														onClick={async () => {
															if (!window.confirm('Вы уверены, что хотите отменить заявку?')) return;
															try {
																const response = await fetch(`http://localhost:8000/orders/${order.id}/`, {
																	method: 'DELETE',
																	headers: {
																		Authorization: `Bearer ${accessToken}`,
																	},
																});
																if (!response.ok) {
																	throw new Error('Ошибка при удалении заказа');
																}
																// Обновляем локальное состояние заказов
																setLocalOrders((prevOrders) => prevOrders.filter(o => o.id !== order.id));
															} catch (error) {
																console.error('Error deleting order:', error);
																alert('Ошибка при удалении заказа');
															}
														}}
													>
														Отменить заявку
													</button>
												</div>
											</div>
										))
									) : (
										<p>Заявлений пока нет</p>
									)}
								</div>
							</section>
						</>
					)}
				</main>
			</div>
		</div>
	)
}
export default Dashboard