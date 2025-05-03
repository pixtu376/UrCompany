import React, { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import '../Styles/Tariffs.css'

	function Tariffs() {
		const [tariffs, setTariffs] = useState([])
		const [loading, setLoading] = useState(true)
		const [error, setError] = useState(null)
		const location = useLocation()
		let clientType = location.state?.clientType

		console.log('Tariffs clientType:', clientType)  // Added for debugging

		// Маппинг clientType для соответствия backend
		if (clientType === 'juridical' || clientType === 'legal') {
			clientType = 'corporate'
		} else if (clientType !== 'individual') {
			clientType = null
		}

	useEffect(() => {
		const fetchTariffs = async () => {
			try {
				let fetchUrl = 'http://localhost:8000/tariffs/'
				if (clientType) {
					fetchUrl += `?client_type=${clientType}`
				}
				const response = await fetch(fetchUrl)
				if (!response.ok) {
					const text = await response.text()
					throw new Error(`Ошибка сервера: ${response.status} ${text}`)
				}
				const data = await response.json()
				setTariffs(data)
				setError(null)
			} catch (error) {
				console.error('Error fetching tariffs:', error)
				setError(error.message)
			} finally {
				setLoading(false)
			}
		}

		fetchTariffs()
	}, [clientType])

	if (loading) return <div className='loading'>Загрузка тарифов...</div>
	if (error) return <div className='error'>Ошибка загрузки тарифов: {error}</div>

	return (
		<div className={`tariffs-page ${clientType === 'individual' ? 'individual' : 'corporate'}`}>
			<h1>
				{clientType === 'individual'
					? 'Тарифы для физических лиц'
					: 'Тарифы для юридических лиц'}
			</h1>

			<div className='tariffs-grid'>
				{tariffs.map(tariff => (
					<div key={tariff.id} className='tariff-card'>
						<h2>{tariff.name}</h2>
						<p className='description'>{tariff.short_description}</p>
						<div className='tariff-footer'>
							<p className='price'>{tariff.price} ₽</p>
							<Link to={`/tariff/${tariff.id}`} className='details-button'>
								Подробнее
							</Link>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default Tariffs
