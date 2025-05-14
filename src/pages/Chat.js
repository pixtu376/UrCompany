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
  const messageInputRef = useRef(null)
  const [isInputFocused, setIsInputFocused] = useState(false)

  const mergeMessages = (oldMessages, newMessages) => {
    const messageMap = new Map()
    oldMessages.forEach(m => messageMap.set(m.id, m))
    newMessages.forEach(m => {
      if (!messageMap.has(m.id)) {
        messageMap.set(m.id, m)
      }
    })
    return Array.from(messageMap.values()).sort((a, b) => a.id - b.id)
  }

  const fetchMessages = async () => {
    if (!accessToken) {
      console.warn('No access token, skipping fetchMessages')
      return
    }
    try {
      const chatsResponse = await authFetch('http://localhost:8000/chats/')
      if (!chatsResponse.ok) {
        throw new Error('Ошибка загрузки чатов')
      }
      const chats = await chatsResponse.json()
      const currentChat = chats.find(chat => chat.id === parseInt(chatId))
      let userChatId = chatId
      if (currentChat && currentChat.chat_type !== 'user') {
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
      setMessages(prevMessages => mergeMessages(prevMessages, data))
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  useEffect(() => {
    if (chatId) {
      fetchMessages()
    }
  }, [chatId, authFetch, accessToken])

  const [lastMessageId, setLastMessageId] = useState(null)

  useEffect(() => {
    if (!isInputFocused && messagesEndRef.current) {
      // Скроллим к последнему сообщению только если поле ввода не в фокусе и есть новое сообщение
      if (messages.length > 0) {
        const newestMessageId = messages[messages.length - 1].id
        if (newestMessageId !== lastMessageId) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
          setLastMessageId(newestMessageId)
        }
      }
    }
  }, [messages, isInputFocused, lastMessageId])

  // Убираем постоянный фокус с поля ввода
  // Удаляем этот useEffect, чтобы не снимать фокус при обновлении сообщений
  // useEffect(() => {
  //   const input = messageInputRef.current
  //   if (input) {
  //     input.blur()
  //   }
  // }, [messages])

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (chatId) {
        fetchMessages()
      }
    }, 2000)

    return () => clearInterval(intervalId)
  }, [chatId, authFetch, accessToken])

  const handleBack = () => {
    if (user && user.is_worker) {
      navigate('/worker')
    } else {
      navigate('/dashboard')
    }
  }

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
      setMessages(prev => mergeMessages(prev, [savedMessage]))
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

  const handleInputFocus = () => {
    setIsInputFocused(true)
  }

  const handleInputBlur = () => {
    setIsInputFocused(false)
  }

  const handleInputClick = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
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
          ref={messageInputRef}
          className="message-input"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onClick={handleInputClick}
          placeholder="Введите сообщение..."
        />
        <button onClick={handleSendMessage} className="send-button">Отправить</button>
      </div>
    </div>
  )
}

export default Chat
