import React, { useState, useEffect, useRef } from 'react'
import '../Styles/Chat.css'
import { useAuth } from '../contexts/AuthContext'

const Chat = ({ chatId }) => {
  const { authFetch } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await authFetch(`http://localhost:8000/messages/?chat_id=${chatId}`)
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

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return
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
      <textarea
        className="message-input"
        value={newMessage}
        onChange={e => setNewMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Введите сообщение..."
      />
      <button onClick={handleSendMessage} className="send-button">Отправить</button>
    </div>
  )
}

export default Chat
