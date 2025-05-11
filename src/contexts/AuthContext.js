import { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)
	const [orders, setOrders] = useState([])
	const [tariffs, setTariffs] = useState([])
	const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken'))
	const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refreshToken'))
	const navigate = useNavigate()
	const isMounted = useRef(true)

	useEffect(() => {
		if (accessToken) {
			fetchUser(accessToken)
		}
		return () => {
			isMounted.current = false
		}
	}, [accessToken])

	const login = async credentials => {
		try {
			const response = await fetch('/auth/token/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(credentials),
			})
			if (!response.ok) {
				throw new Error('Ошибка авторизации')
			}
			const data = await response.json()
			setAccessToken(data.access)
			setRefreshToken(data.refresh)
			localStorage.setItem('accessToken', data.access)
			localStorage.setItem('refreshToken', data.refresh)
			const userData = await fetchUser(data.access)
			// Навигация в зависимости от роли пользователя
			if (userData && userData.is_staff) {
				navigate('/admin-tariffs')
			} else if (userData && userData.is_worker) {
				navigate('/worker')
			} else {
				navigate('/dashboard')
			}
		} catch (error) {
			console.error('Login error:', error)
		}
	}

	const register = async (registrationData) => {
		try {
			const response = await fetch('/auth/register/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(registrationData),
			})
			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.detail || 'Ошибка регистрации')
			}
			return await response.json()
		} catch (error) {
			console.error('Registration error:', error)
			throw error
		}
	}

	const refreshAccessToken = useCallback(async () => {
		if (!refreshToken) {
			return null
		}
		try {
			const response = await fetch('/auth/token/refresh/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ refresh: refreshToken }),
			})
			if (!response.ok) {
				throw new Error('Ошибка обновления токена')
			}
			const data = await response.json()
			setAccessToken(data.access)
			return data.access
		} catch (error) {
			console.error('Error refreshing access token:', error)
			logout()
			return null
		}
	}, [refreshToken])

	const authFetch = useCallback(async (url, options = {}, retry = true) => {
		if (!options.headers) {
			options.headers = {}
		}
		if (accessToken) {
			options.headers['Authorization'] = `Bearer ${accessToken}`
		}
		let response = await fetch(url, options)
		if (response.status === 401 && retry) {
			const newAccessToken = await refreshAccessToken()
			if (newAccessToken) {
				options.headers['Authorization'] = `Bearer ${newAccessToken}`
				response = await fetch(url, options)
			}
		}
		return response
	}, [accessToken, refreshAccessToken])

	const fetchUser = async (token) => {
		try {
			console.log('Access token in fetchUser:', token)
			const response = await authFetch('/users/me/', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			if (response.status === 401) {
				console.error('Unauthorized in fetchUser, redirecting to login')
				setUser(null)
				setAccessToken(null)
				setRefreshToken(null)
				if (isMounted.current) {
					navigate('/login')
				}
				return null
			}
			const data = await response.json()
			if (data) {
				setUser(data)
				console.log('User is_worker:', data.is_worker)
				await fetchOrders(data.id, token)
				await fetchTariffs(token)
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

	const fetchTariffs = async () => {
		try {
			const response = await authFetch('/tariffs/')
			if (!response.ok) {
				throw new Error('Ошибка загрузки тарифов')
			}
			const data = await response.json()
			setTariffs(data)
		} catch (error) {
			console.error('Error fetching tariffs:', error)
			setTariffs([])
		}
	}

	const updateUser = async (updatedData) => {
		if (!accessToken || !user) {
			console.error('No access token or user to update')
			return
		}
		try {
			console.log('Updating user with data:', updatedData)
			const response = await authFetch(`/users/${user.id}/`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updatedData),
			})
			console.log('Update user response status:', response.status)
			if (response.status === 401) {
				console.error('Unauthorized in updateUser, redirecting to login')
				setUser(null)
				setAccessToken(null)
				setRefreshToken(null)
				if (isMounted.current) {
					navigate('/login')
				}
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

	const fetchOrders = async (userId) => {
		try {
			console.log('Fetching orders for userId:', userId)
			const response = await authFetch(`/orders/?user=${userId}`)
			const data = await response.json()
			console.log('Orders fetched:', data)
			setOrders(Array.isArray(data) ? data : [])
		} catch (error) {
			console.error('Error fetching orders:', error)
			setOrders([])
		}
	}

	const fetchAllOrders = useCallback(async () => {
		try {
			const response = await authFetch(`/orders/`)
			if (!response.ok) {
				const errorText = await response.text()
				console.error('Error response text:', errorText)
				setOrders([])
				return
			}
			const data = await response.json()
			console.log('All orders fetched:', data)
			setOrders(Array.isArray(data) ? data : [])
		} catch (error) {
			console.error('Error fetching all orders:', error)
			setOrders([])
		}
	}, [authFetch])

	const createOrder = async tariffId => {
		try {
			const body = { tariff_id: tariffId }
			console.log('Request body in createOrder:', body)
			const response = await authFetch('/orders/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
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

	const logout = () => {
		setUser(null)
		setAccessToken(null)
		setRefreshToken(null)
		localStorage.removeItem('accessToken')
		localStorage.removeItem('refreshToken')
		if (isMounted.current) {
			navigate('/login')
		}
	}

	return (
		<AuthContext.Provider value={{ user, orders, setOrders, tariffs, setTariffs, login, register, createOrder, updateUser, fetchUser, fetchAllOrders, fetchTariffs, accessToken, logout, authFetch }}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	return useContext(AuthContext)
}
