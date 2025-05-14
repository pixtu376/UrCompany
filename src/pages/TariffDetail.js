import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../Styles/TariffDetail.css'

function TariffDetail() {
	const { id } = useParams()
	const [tariff, setTariff] = useState(null)
	const [loading, setLoading] = useState(true)
	const { user, createOrder } = useAuth()
	const navigate = useNavigate()

	useEffect(() => {
		const fetchTariff = async () => {
			try {
				const response = await fetch(`/tariffs/${id}/`)
				const data = await response.json()
				setTariff(data)
			} catch (error) {
				console.error('Error fetching tariff:', error)
			} finally {
				setLoading(false)
			}
		}
		fetchTariff()
	}, [id])

	const handleOrder = async () => {
		if (!user) {
			navigate('/login')
			return
		}

		const order = await createOrder(id)
		if (order) {
			navigate('/dashboard')
		}
	}

	const handleBack = () => {
		navigate('/tariffs')
	}

	if (loading) return <div className='loading'>Загрузка...</div>
	if (!tariff) return <div className='error'>Тариф не найден</div>

	return (
		<div className='tariff-detail'>
			<div className='tariff-main-block'>
				<h1 className='tariff-title'>{tariff.name}</h1>
				<p className='tariff-description'>{tariff.detailed_description}</p>
			</div>
			<div className='tariff-secondary-block'>
				<h2 className='section-title'>Информация о тарифе</h2>
				<div className='tariff-data-block'>
					<div>
						<strong>Категория:</strong> {tariff.category || 'Не указана'}
					</div>
					<div>
						<strong>Тип задачи:</strong> {tariff.task_type || 'Не указан'}
					</div>
					<div>
						<strong>Форма оплаты:</strong> {tariff.payment_form || 'Не указана'}
					</div>
					<div>
						<strong>Стоимость:</strong> {tariff.price} ₽
					</div>
				</div>
				<div className='tariff-buttons-block'>
					<button className='back-button' onClick={handleBack}>
						&lt; Обратно к тарифам
					</button>
					<button className='order-button' onClick={handleOrder}>
						Оформить заказ &gt;
					</button>
				</div>
			</div>
		</div>
	)
}

export default TariffDetail
