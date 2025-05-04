import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import '../Styles/PersonalAccount.css'

const DashboardRedact = ({ onCancel }) => {
  const { user, updateUser } = useAuth()

  useEffect(() => {
    console.log('DashboardRedact mounted')
    alert('DashboardRedact mounted')
  }, [])

  const [formData, setFormData] = useState({
    lastName: user?.lastName || '',
    firstName: user?.firstName || '',
    middleName: user?.middleName || '',
    birthDate: '',
    gender: '',
    documentType: '',
    documentNumber: '',
    documentIssueDate: '',
    documentIssuer: '',
    snils: '',
    addressCity: '',
    addressStreet: '',
    addressHouse: '',
    addressBuilding: '',
    addressApartment: '',
  })

  const [showNotification, setShowNotification] = useState(false)

  if (!user) {
    return <Navigate to='/LoginPage' replace />
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    alert('handleSave called with formData: ' + JSON.stringify(formData))
    if (updateUser) {
      alert('Calling updateUser...')
      await updateUser(formData)
      alert('updateUser finished')
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 3000)
    }
  }

  return (
    <div className='personal-account'>
      <div className='account-container'>
        <aside className='account-sidebar'>
          <nav>
            <ul>
              <li onClick={onCancel} style={{ cursor: 'pointer' }}>Личный кабинет</li>
              <li className='active'>Настройки</li>
            </ul>
          </nav>
        </aside>
        <main className='account-content'>
          <div className='top-row'>
            <section className='main-info-block'>
              <h2>Основная информация</h2>
              <div className='info-table'>
                <div className='info-row'>
                  <label className='info-label' htmlFor='lastName'>Фамилия</label>
                  <input
                    type='text'
                    id='lastName'
                    name='lastName'
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
                <div className='info-row'>
                  <label className='info-label' htmlFor='firstName'>Имя</label>
                  <input
                    type='text'
                    id='firstName'
                    name='firstName'
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className='info-row'>
                  <label className='info-label' htmlFor='middleName'>Отчество</label>
                  <input
                    type='text'
                    id='middleName'
                    name='middleName'
                    value={formData.middleName}
                    onChange={handleChange}
                  />
                </div>
                <div className='info-row'>
                  <label className='info-label' htmlFor='birthDate'>Дата рождения</label>
                  <input
                    type='date'
                    id='birthDate'
                    name='birthDate'
                    value={formData.birthDate}
                    onChange={handleChange}
                  />
                </div>
                <div className='info-row'>
                  <label className='info-label' htmlFor='gender'>Пол</label>
                  <select
                    id='gender'
                    name='gender'
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value=''>Выберите пол</option>
                    <option value='Мужской'>Мужской</option>
                    <option value='Женский'>Женский</option>
                  </select>
                </div>
              </div>
            </section>

            <section className='documents-block'>
              <h2>Мои документы</h2>
              <div className='info-section'>
                <label htmlFor='documentType'>Тип документа</label>
                <input
                  type='text'
                  id='documentType'
                  name='documentType'
                  value={formData.documentType}
                  onChange={handleChange}
                />
              </div>

              <div className='info-section'>
                <label htmlFor='documentNumber'>Серия и номер</label>
                <input
                  type='text'
                  id='documentNumber'
                  name='documentNumber'
                  value={formData.documentNumber}
                  onChange={handleChange}
                />
              </div>

              <div className='info-section'>
                <label htmlFor='documentIssueDate'>Дата выдачи</label>
                <input
                  type='date'
                  id='documentIssueDate'
                  name='documentIssueDate'
                  value={formData.documentIssueDate}
                  onChange={handleChange}
                />
              </div>

              <div className='info-section'>
                <label htmlFor='documentIssuer'>Кем выдан</label>
                <input
                  type='text'
                  id='documentIssuer'
                  name='documentIssuer'
                  value={formData.documentIssuer}
                  onChange={handleChange}
                />
              </div>

              <div className='info-section'>
                <label htmlFor='snils'>СНИЛС</label>
                <input
                  type='text'
                  id='snils'
                  name='snils'
                  value={formData.snils}
                  onChange={handleChange}
                />
              </div>
            </section>
          </div>

          <section className='address-block'>
            <h2>Адрес регистрации</h2>
            <div className='address-grid'>
              <div className='address-item'>
                <label htmlFor='addressCity'>Населённый пункт</label>
                <input
                  type='text'
                  id='addressCity'
                  name='addressCity'
                  value={formData.addressCity}
                  onChange={handleChange}
                />
              </div>
              <div className='address-item'>
                <label htmlFor='addressStreet'>Улица</label>
                <input
                  type='text'
                  id='addressStreet'
                  name='addressStreet'
                  value={formData.addressStreet}
                  onChange={handleChange}
                />
              </div>
              <div className='address-item'>
                <label htmlFor='addressHouse'>Дом</label>
                <input
                  type='text'
                  id='addressHouse'
                  name='addressHouse'
                  value={formData.addressHouse}
                  onChange={handleChange}
                />
              </div>
              <div className='address-item'>
                <label htmlFor='addressBuilding'>Корпус</label>
                <input
                  type='text'
                  id='addressBuilding'
                  name='addressBuilding'
                  value={formData.addressBuilding}
                  onChange={handleChange}
                />
              </div>
              <div className='address-item'>
                <label htmlFor='addressApartment'>Квартира</label>
                <input
                  type='text'
                  id='addressApartment'
                  name='addressApartment'
                  value={formData.addressApartment}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {console.log('Rendering save button')}
          {alert('Rendering save button')}
          <button type="button" onClick={handleSave} className='save-button'>Сохранить</button>

          {showNotification && (
            <div className='notification-popup'>
              Данные сохранены
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default DashboardRedact
