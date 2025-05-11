import React, { useState, useEffect } from 'react'
import Chat from './Chat'

const ChatList = ({ accessToken, onSelectChat }) => {
  const [chats, setChats] = useState([])

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch('http://localhost:8000/chats/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        if (!response.ok) {
          throw new Error('Ошибка загрузки чатов')
        }
        const data = await response.json()
        setChats(data)
      } catch (error) {
        console.error('Error fetching chats:', error)
      }
    }
    if (accessToken) {
      fetchChats()
    }
  }, [accessToken])

  return (
    <div className="chat-list" style={{ width: '100%', padding: '10px' }}>
      <h3>Список чатов</h3>
      {chats.length === 0 ? (
        <p>Чатов нет</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {chats.map(chat => (
            <li key={chat.id} style={{ marginBottom: '10px', cursor: 'pointer', padding: '5px', border: '1px solid #ccc', borderRadius: '5px' }}
              onClick={() => onSelectChat(chat.id)}>
              <div><strong>Заказ:</strong> {chat.order_name}</div>
              <div><strong>Работник:</strong> {chat.worker_name}</div>
              <div><strong>Непрочитано:</strong> {chat.unread_messages}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ChatList
