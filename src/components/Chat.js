import React, { useState, useEffect, useRef } from 'react'
import '../Styles/Chat.css'
import { useAuth } from '../contexts/AuthContext'

import { useParams, useNavigate } from 'react-router-dom'

const Chat = () => {
  const { chatId } = useParams()
  const { authFetch, accessToken, user } = useAuth()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Always fetch chat with chat_type='user' for the current order
        // First fetch chats for the user to get the chat with chat_type='user'
        const chatsResponse = await authFetch('http://localhost:8000/chats/')
        if (!chatsResponse.ok) {
          throw new Error('Ошибка загрузки чатов')
        }
        const chats = await chatsResponse.json()
        // Find chat with chat_type='user' matching current chatId order
        const currentChat = chats.find(chat => chat.id === parseInt(chatId))
        let userChatId = chatId
        if (currentChat && currentChat.chat_type !== 'user') {
          // Find chat with chat_type='user' for the same order
          const userChat = chats.find(chat => chat.order_id === currentChat.order_id && chat.chat_type === 'user')
          if (userChat) {
            userChatId = userChat.id
          }
        }
        const response = await authFetch(`http://localhost:8000/messages/?chat_id=${userChatId}`)
        if (!response.ok) {
          throw new Error('Ошибка загрузки сообщений')
        }
        const data = await response.json()
        setMessages(data)
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }
    if (chatId) {
      fetchMessages()
    }
  }, [chatId, authFetch])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleBack = () => {
    if (user && user.is_worker) {
      navigate('/worker')
    } else {
      navigate('/dashboard')
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return
    console.log('Sending message to chatId:', chatId)
    console.log('Access token used:', accessToken)
    try {
      const response = await authFetch('http://localhost:8000/messages/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat: chatId,
          text: newMessage.trim(),
        }),
      })
      if (!response.ok) {
        throw new Error('Ошибка отправки сообщения')
      }
      const savedMessage = await response.json()
      setMessages(prev => [...prev, savedMessage])
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="chat-container">
      <button onClick={handleBack} className="back-chat-button">Назад</button>
      <div className="messages">
        {messages.map(message => {
          const isUserMessage = message.sender_user !== null
          return (
            <div key={message.id} className={`message ${isUserMessage ? 'user' : 'other'}`}>
              <div className="message-content">
                {message.text}
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <textarea
          className="message-input"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Введите сообщение..."
        />
        <button onClick={handleSendMessage} className="send-button">Отправить</button>
      </div>
    </div>
  )
}

export default Chat
