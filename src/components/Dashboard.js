import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import DashboardRedact from './DashboardRedact'
import '../Styles/PersonalAccount.css'

const Dashboard = () => {
  const { user, orders, fetchUser, accessToken } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (accessToken && loading) {
      fetchUser(accessToken).then(() => setLoading(false))
    }
  }, [accessToken, fetchUser, loading])

  if (!user && !loading) {
    return <Navigate to='/LoginPage' replace />
  }

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

  const handleSettingsClick = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  if (isEditing) {
    return <DashboardRedact onCancel={handleCancelEdit} />
  }

  return (
    <div className='personal-account'>
      <div className='account-container'>
        <aside className='account-sidebar'>
          <nav>
            <ul>
              <li className='active'>Уведомления</li>
              <li onClick={handleSettingsClick} style={{ cursor: 'pointer' }}>Настройки</li>
              <li>Мои данные</li>
              <li className='user-name'>
                {user?.email || 'Пользователь'}
              </li>
            </ul>
          </nav>
        </aside>

        <main className='account-content'>
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
                  <span className='info-value'>{renderValue(user?.birthDate || 'Не заполнено')}</span>
                </div>
                <div className='info-row'>
                  <span className='info-label'>Пол</span>
                  <span className='info-value'>{renderValue(user?.gender || 'Не заполнено')}</span>
                </div>
              </div>
            </section>

            <section className='documents-block'>
              <h2>Мои документы</h2>
              <div className='info-section'>
                <h3>Тип документа</h3>
                <p className='info-value'>{renderValue(user?.document_type || 'Не заполнено')}</p>
              </div>

              <div className='info-section'>
                <h3>Серия и номер</h3>
                <p className='info-value'>{renderValue(user?.document_number || 'Не заполнено')}</p>
              </div>

              <div className='info-section'>
                <h3>Дата выдачи</h3>
                <p className='info-value'>{renderValue(user?.document_issue_date || 'Не заполнено')}</p>
              </div>

              <div className='info-section'>
                <h3>Кем выдан</h3>
                <p className='info-value'>{renderValue(user?.document_issuer || 'Не заполнено')}</p>
              </div>

              <div className='info-section'>
                <h3>СНИЛС</h3>
                <p className='info-value'>{renderValue(user?.snils || 'Не заполнено')}</p>
              </div>
            </section>
          </div>

          <section className='address-block'>
            <h2>Адрес регистрации</h2>
            <div className='address-grid'>
              <div className='address-item'>
                <span>Населённый пункт</span>
                <p className='info-value'>{renderValue(user?.address_city || 'Не заполнено')}</p>
              </div>
              <div className='address-item'>
                <span>Улица</span>
                <p className='info-value'>{renderValue(user?.address_street || 'Не заполнено')}</p>
              </div>
              <div className='address-item'>
                <span>Дом</span>
                <p className='info-value'>{renderValue(user?.address_house || 'Не заполнено')}</p>
              </div>
              <div className='address-item'>
                <span>Корпус</span>
                <p className='info-value'>{renderValue(user?.address_building || 'Не заполнено')}</p>
              </div>
              <div className='address-item'>
                <span>Квартира</span>
                <p className='info-value'>{renderValue(user?.address_apartment || 'Не заполнено')}</p>
              </div>
            </div>
          </section>

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
