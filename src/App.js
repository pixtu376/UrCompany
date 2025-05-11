// src/App.js
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Calculator from './components/Calculator'
import Dashboard from './components/Dashboard'
import LegalClientsPage from './components/LegalClientsPage'
import LoginPage from './components/LoginPage'
import MainPage from './components/MainPage'
import PhysicalClientsPage from './components/PhysicalClientsPage'
import RegistrationPage from './components/RegistrationPage'
import Tariffs from './components/Tariffs'
import TariffDetail from './components/TariffDetail'
import AdminTariffsPage from './components/AdminTariffsPage'
import WorkerPage from './components/WorkerPage'
import Chat from './components/Chat'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
	return (
		<Routes>
			<Route path='/' element={<Layout />}>
				<Route index element={<MainPage />} />
				<Route path='calculator' element={<Calculator />} />
			<Route path='dashboard' element={
				<ProtectedRoute>
					<Dashboard />
				</ProtectedRoute>
			} />
			<Route path='legal-clients' element={<LegalClientsPage />} />
			<Route path='login' element={<LoginPage />} />
			<Route path='physical-clients' element={<PhysicalClientsPage />} />
			<Route path='registration' element={<RegistrationPage />} />
			<Route path='tariffs' element={<Tariffs />} />
			<Route path='tariff/:id' element={<TariffDetail />} />
			<Route path='admin-tariffs' element={
				<ProtectedRoute>
					<AdminTariffsPage />
				</ProtectedRoute>
			} />
			<Route path='worker' element={
				<ProtectedRoute>
					<WorkerPage />
				</ProtectedRoute>
			} />
			<Route path='chat/:chatId' element={
				<ProtectedRoute>
					<Chat />
				</ProtectedRoute>
			} />
			</Route>
		</Routes>
	)
}

export default App
