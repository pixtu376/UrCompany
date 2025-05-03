import { createContext, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)
	const [orders, setOrders] = useState([])
	const navigate = useNavigate()

	const login = async credentials => {
		try {
			const response = await fetch('/api/users/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(credentials),
			})
			const data = await response.json()
			setUser(data)
			fetchOrders(data.id)
			navigate('/dashboard')
		} catch (error) {
			console.error('Login error:', error)
		}
	}

	const fetchOrders = async userId => {
		try {
			const response = await fetch(`/api/orders/?user=${userId}`)
			const data = await response.json()
			setOrders(data)
		} catch (error) {
			console.error('Error fetching orders:', error)
		}
	}

	const createOrder = async tariffId => {
		try {
			const response = await fetch('/api/orders/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
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
