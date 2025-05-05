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
			const userData = await fetchUser(data.access)
			// Навигация в зависимости от роли пользователя
			if (userData && userData.is_staff) {
				navigate('/admin-tariffs')
			} else {
				navigate('/dashboard')
			}
		} catch (error) {
			console.error('Login error:', error)
		}
	}

	const fetchUser = async (token) => {
		try {
			console.log('Access token in fetchUser:', token)
			const response = await fetch('http://localhost:8000/users/me/', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			if (response.status === 401) {
				console.error('Unauthorized in fetchUser, redirecting to login')
				setUser(null)
				setAccessToken(null)
				navigate('/login')
				return null
			}
			const data = await response.json()
			if (data) {
				setUser(data)
				await fetchOrders(data.id, token)
				return data
			} else {
				setUser(null)
				setOrders([])
				return null
			}
		} catch (error) {
			console.error('Error fetching user:', error)
			return null
		}
	}

	const updateUser = async (updatedData, token) => {
		if (!token || !user) {
			console.error('No access token or user to update')
			return
		}
		try {
			console.log('Updating user with data:', updatedData)
			const response = await fetch(`http://localhost:8000/users/${user.id}/`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(updatedData),
			})
			console.log('Update user response status:', response.status)
			if (response.status === 401) {
				console.error('Unauthorized in updateUser, redirecting to login')
				setUser(null)
				setAccessToken(null)
				navigate('/login')
				return
			}
			if (!response.ok) {
				const errorText = await response.text()
				console.error('Error response text:', errorText)
				throw new Error('Ошибка обновления пользователя')
			}
			const data = await response.json()
			console.log('Updated user data:', data)
			setUser(data)
		} catch (error) {
			console.error('Error updating user:', error)
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
			const body = { tariff_id: tariffId }
			console.log('Access token in createOrder:', accessToken)
			console.log('Request body in createOrder:', body)
			const response = await fetch('http://localhost:8000/orders/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify(body),
			})
			const newOrder = await response.json()
			console.log('Response from createOrder:', newOrder)
			if (!response.ok) {
				throw new Error(JSON.stringify(newOrder))
			}
			setOrders([...orders, newOrder])
			return newOrder
		} catch (error) {
			console.error('Error creating order:', error)
		}
	}

	return (
		<AuthContext.Provider value={{ user, orders, login, createOrder, updateUser, fetchUser, accessToken }}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	return useContext(AuthContext)
}
