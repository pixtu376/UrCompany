import React, { useState, useEffect } from 'react'
import '../Styles/Tariffs.css'
import { useAuth } from '../contexts/AuthContext'

function AdminTariffsPage() {
  const { accessToken } = useAuth()
  const [tariffs, setTariffs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    id: null,
    name: '',
    short_description: '',
    detailed_description: '',
    price: '',
    client_type: 'individual',
    service_info: '',
    category: '',
    task_type: '',
    payment_form: '',
  })
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (accessToken) {
      fetchTariffs()
    }
  }, [accessToken])

  const fetchTariffs = async () => {
    try {
      const response = await fetch('http://localhost:8000/tariffs/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      if (!response.ok) {
        throw new Error('Ошибка загрузки тарифов')
      }
      const data = await response.json()
      setTariffs(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const method = isEditing ? 'PUT' : 'POST'
      const url = isEditing
        ? `http://localhost:8000/tariffs/${form.id}/`
        : 'http://localhost:8000/tariffs/'
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: form.name,
          short_description: form.short_description,
          detailed_description: form.detailed_description,
          price: parseFloat(form.price),
          client_type: form.client_type,
          service_info: form.service_info,
          category: form.category,
          task_type: form.task_type,
          payment_form: form.payment_form,
        }),
      })
      if (!response.ok) {
        throw new Error('Ошибка при сохранении тарифа')
      }
      setForm({
        id: null,
        name: '',
        short_description: '',
        detailed_description: '',
        price: '',
        client_type: 'individual',
        service_info: '',
        category: '',
        task_type: '',
        payment_form: '',
      })
      setIsEditing(false)
      fetchTariffs()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = tariff => {
    setForm({
      id: tariff.id,
      name: tariff.name,
      short_description: tariff.short_description,
      detailed_description: tariff.detailed_description,
      price: tariff.price,
      client_type: tariff.client_type,
      service_info: tariff.service_info || '',
      category: tariff.category || '',
      task_type: tariff.task_type || '',
      payment_form: tariff.payment_form || '',
    })
    setIsEditing(true)
  }

  const handleDelete = async id => {
    if (!window.confirm('Удалить тариф?')) return
    try {
      const response = await fetch(`http://localhost:8000/tariffs/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      if (!response.ok) {
        throw new Error('Ошибка при удалении тарифа')
      }
      fetchTariffs()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div>Загрузка...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="admin-tariffs-page">
      <h1>Управление тарифами</h1>
      <form onSubmit={handleSubmit} className="tariff-form">
        <input
          type="text"
          name="name"
          placeholder="Название"
          value={form.name}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="short_description"
          placeholder="Краткое описание"
          value={form.short_description}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="detailed_description"
          placeholder="Подробное описание"
          value={form.detailed_description}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Цена"
          value={form.price}
          onChange={handleInputChange}
          required
          step="0.01"
        />
        <select name="client_type" value={form.client_type} onChange={handleInputChange}>
          <option value="individual">Физическое лицо</option>
          <option value="corporate">Юридическое лицо</option>
        </select>
        <input
          type="text"
          name="service_info"
          placeholder="Информация о сервисе"
          value={form.service_info}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Категория"
          value={form.category}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="task_type"
          placeholder="Тип задачи"
          value={form.task_type}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="payment_form"
          placeholder="Форма оплаты"
          value={form.payment_form}
          onChange={handleInputChange}
        />
        <button type="submit">{isEditing ? 'Сохранить' : 'Добавить'}</button>
      </form>

      <div className="tariffs-list">
        {tariffs.map(tariff => (
          <div key={tariff.id} className="tariff-card">
            <h2>{tariff.name}</h2>
            <p>{tariff.short_description}</p>
            <p>Цена: {tariff.price} ₽</p>
            <p>Тип клиента: {tariff.client_type === 'individual' ? 'Физическое лицо' : 'Юридическое лицо'}</p>
            <button onClick={() => handleEdit(tariff)}>Редактировать</button>
            <button onClick={() => handleDelete(tariff.id)}>Удалить</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminTariffsPage
