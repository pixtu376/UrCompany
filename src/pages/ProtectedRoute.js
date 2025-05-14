import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()

  if (!user) {
    // Пользователь не авторизован, редирект на страницу логина
    return <Navigate to="/login" replace />
  }

  // Пользователь авторизован, рендерим дочерние компоненты
  return children
}

export default ProtectedRoute
