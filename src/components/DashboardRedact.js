import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import '../Styles/PersonalAccount.css'
import '../Styles/Login.css'

const DashboardRedact = ({ onCancel }) => {
  const { user, updateUser, fetchUser, accessToken } = useAuth()

  const [activeTab, setActiveTab] = useState('Настройки')

  const [originalData, setOriginalData] = useState(null)

  const [formData, setFormData] = useState({
    last_name: user?.last_name || '',
    first_name: user?.first_name || '',
    middle_name: user?.middle_name || '',
    birthDate: user?.birthDate || null,
    gender: user?.gender || '',
    document_type: user?.document_type || '',
    document_number: user?.document_number || '',
    document_issue_date: user?.document_issue_date || null,
    document_issuer: user?.document_issuer || '',
    snils: user?.snils || '',
    address_city: user?.address_city || '',
    address_street: user?.address_street || '',
    address_house: user?.address_house || '',
    address_building: user?.address_building || '',
    address_apartment: user?.address_apartment || '',
  })

  useEffect(() => {
    const initData = {
      last_name: user?.last_name || '',
      first_name: user?.first_name || '',
      middle_name: user?.middle_name || '',
      birthDate: user?.birthDate || null,
      gender: user?.gender || '',
      document_type: user?.document_type || '',
      document_number: user?.document_number || '',
      document_issue_date: user?.document_issue_date || null,
      document_issuer: user?.document_issuer || '',
      snils: user?.snils || '',
      address_city: user?.address_city || '',
      address_street: user?.address_street || '',
      address_house: user?.address_house || '',
      address_building: user?.address_building || '',
      address_apartment: user?.address_apartment || '',
    }
    setFormData(initData)
    setOriginalData(initData)
  }, [user])

  const [showNotification, setShowNotification] = useState(false)

  if (!user) {
    return <Navigate to='/LoginPage' replace />
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (updateUser && originalData) {
      // Prepare changed data only
      const changedData = {}
      Object.keys(formData).forEach(key => {
        // Treat null and empty string as equivalent for dates
        const originalValue = originalData[key] === null ? '' : originalData[key]
        const currentValue = formData[key] === null ? '' : formData[key]
        if (originalValue !== currentValue) {
          changedData[key] = formData[key]
        }
      })

      // Convert empty strings for dates to null
      if (changedData.birthDate === '') changedData.birthDate = null
      if (changedData.document_issue_date === '') changedData.document_issue_date = null

      if (Object.keys(changedData).length === 0) {
        // No changes to save
        onCancel()
        return
      }

      await updateUser(changedData, accessToken)
      if (fetchUser && accessToken) {
        await fetchUser(accessToken)
      }
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 3000)
      onCancel()
    }
  }

  const handleTabClick = (tab) => {
    if (tab === 'Настройки') {
      setActiveTab('Настройки')
    } else {
      onCancel(tab)
    }
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
                style={{ cursor: 'pointer' }}
              >
                Уведомления
              </li>
            </ul>
          </nav>
        </aside>
        <main className='account-content'>
          {activeTab === 'Настройки' && (
            <>
              <div className='top-row'>
                <section className='main-info-block'>
                  <h2>Основная информация</h2>
                  <div className='info-table'>
                    <div className='info-row'>
                      <label className='info-label' htmlFor='last_name'>Фамилия</label>
                      <input
                        className='input-field'
                        type='text'
                        id='last_name'
                        name='last_name'
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className='info-row'>
                      <label className='info-label' htmlFor='first_name'>Имя</label>
                      <input
                        className='input-field'
                        type='text'
                        id='first_name'
                        name='first_name'
                        value={formData.first_name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className='info-row'>
                      <label className='info-label' htmlFor='middle_name'>Отчество</label>
                      <input
                        className='input-field'
                        type='text'
                        id='middle_name'
                        name='middle_name'
                        value={formData.middle_name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className='info-row'>
                      <label className='info-label' htmlFor='birthDate'>Дата рождения</label>
                      <input
                        className='input-field'
                        type='date'
                        id='birthDate'
                        name='birthDate'
                        value={formData.birthDate || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className='info-row'>
                      <label className='info-label' htmlFor='gender'>Пол</label>
                      <select
                        className='input-field'
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
                    <label htmlFor='document_type'>Тип документа</label>
                    <input
                      className='input-field'
                      type='text'
                      id='document_type'
                      name='document_type'
                      value={formData.document_type}
                      onChange={handleChange}
                    />
                  </div>

                  <div className='info-section'>
                    <label htmlFor='document_number'>Серия и номер</label>
                    <input
                      className='input-field'
                      type='text'
                      id='document_number'
                      name='document_number'
                      value={formData.document_number}
                      onChange={handleChange}
                    />
                  </div>

                  <div className='info-section'>
                    <label htmlFor='document_issue_date'>Дата выдачи</label>
                    <input
                      className='input-field'
                      type='date'
                      id='document_issue_date'
                      name='document_issue_date'
                      value={formData.document_issue_date || ''}
                      onChange={handleChange}
                    />
                  </div>

                  <div className='info-section'>
                    <label htmlFor='document_issuer'>Кем выдан</label>
                    <input
                      className='input-field'
                      type='text'
                      id='document_issuer'
                      name='document_issuer'
                      value={formData.document_issuer}
                      onChange={handleChange}
                    />
                  </div>

                  <div className='info-section'>
                    <label htmlFor='snils'>СНИЛС</label>
                    <input
                      className='input-field'
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
                    <label htmlFor='address_city'>Населённый пункт</label>
                    <input
                      className='input-field'
                      type='text'
                      id='address_city'
                      name='address_city'
                      value={formData.address_city}
                      onChange={handleChange}
                    />
                  </div>
                  <div className='address-item'>
                    <label htmlFor='address_street'>Улица</label>
                    <input
                      className='input-field'
                      type='text'
                      id='address_street'
                      name='address_street'
                      value={formData.address_street}
                      onChange={handleChange}
                    />
                  </div>
                  <div className='address-item'>
                    <label htmlFor='address_house'>Дом</label>
                    <input
                      className='input-field'
                      type='text'
                      id='address_house'
                      name='address_house'
                      value={formData.address_house}
                      onChange={handleChange}
                    />
                  </div>
                  <div className='address-item'>
                    <label htmlFor='address_building'>Корпус</label>
                    <input
                      className='input-field'
                      type='text'
                      id='address_building'
                      name='address_building'
                      value={formData.address_building}
                      onChange={handleChange}
                    />
                  </div>
                  <div className='address-item'>
                    <label htmlFor='address_apartment'>Квартира</label>
                    <input
                      className='input-field'
                      type='text'
                      id='address_apartment'
                      name='address_apartment'
                      value={formData.address_apartment}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </section>

              <button onClick={handleSave} className='save-button'>Сохранить</button>

              {showNotification && (
                <div className='notification-popup'>
                  Данные сохранены
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default DashboardRedact
