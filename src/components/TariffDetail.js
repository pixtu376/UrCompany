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
				const response = await fetch(`/api/tariffs/${id}/`)
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

	if (loading) return <div className='loading'>Загрузка...</div>
	if (!tariff) return <div className='error'>Тариф не найден</div>

	return (
		<div className='tariff-detail'>
			<h1>{tariff.name}</h1>
			<div className='tariff-content'>
				<div className='tariff-info'>
					<h2>Описание</h2>
					<p>{tariff.detailed_description}</p>

					<h2>Характеристики</h2>
					<ul>
						<li>
							<strong>Тип клиента:</strong>{' '}
							{tariff.client_type === 'individual'
								? 'Физическое лицо'
								: 'Юридическое лицо'}
						</li>
						<li>
							<strong>Цена:</strong> {tariff.price} ₽
						</li>
					</ul>

					<button onClick={handleOrder} className='order-button'>
						Оформить заказ
					</button>
				</div>
			</div>
		</div>
	)
}

export default TariffDetail
