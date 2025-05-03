import { createContext, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)
	const [orders, setOrders] = useState([])
	const [accessToken, setAccessToken] = useState(null)
	const navigate = useNavigate()

	const login = async credentials => {
		try {
			const response = await fetch('http://localhost:8000/auth/token/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(credentials),
			})
			if (!response.ok) {
				throw new Error('Ошибка авторизации')
			}
			const data = await response.json()
			setAccessToken(data.access)
			await fetchUser(data.access)
			navigate('/dashboard')
		} catch (error) {
			console.error('Login error:', error)
		}
	}

	const fetchUser = async token => {
		try {
			console.log('Access token in fetchUser:', token)
			const response = await fetch('http://localhost:8000/users/', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			const data = await response.json()
			setUser(data[0] || null) // предполагается, что возвращается список пользователей, берем первого
			await fetchOrders(data[0]?.id, token)
		} catch (error) {
			console.error('Error fetching user:', error)
		}
	}

	const fetchOrders = async (userId, token) => {
		try {
			console.log('Access token in fetchOrders:', token)
			console.log('Fetching orders for userId:', userId)
			const response = await fetch(
				`http://localhost:8000/orders/?user=${userId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			const data = await response.json()
			console.log('Orders fetched:', data)
			setOrders(Array.isArray(data) ? data : [])
		} catch (error) {
			console.error('Error fetching orders:', error)
			setOrders([])
		}
	}

	const createOrder = async tariffId => {
		try {
			console.log('Access token in createOrder:', accessToken)
			const response = await fetch('http://localhost:8000/orders/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify({ tariff: tariffId }),
			})
			const newOrder = await response.json()
			setOrders([...orders, newOrder])
			return newOrder
		} catch (error) {
			console.error('Error creating order:', error)
		}
	}

	return (
		<AuthContext.Provider value={{ user, orders, login, createOrder }}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	return useContext(AuthContext)
}
