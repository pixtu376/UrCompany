import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const statusLabels = {
  pending: 'В обработке',
  in_progress: 'Выполняется',
  under_review: 'На проверке',
  cancelled: 'Отменен',
  completed: 'Завершен',
  failed: 'Неудача',
  refunded: 'Возврат',
};

const WorkerPage = () => {
  const { user, orders, fetchAllOrders, accessToken, setOrders } = useAuth();

  console.log('WorkerPage user:', user);
  console.log('WorkerPage orders:', orders);

  useEffect(() => {
    if (user && user.is_worker && accessToken) {
      console.log('Calling fetchAllOrders in WorkerPage');
      fetchAllOrders(accessToken);
    }
  }, [user, accessToken, fetchAllOrders]);

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>страница для работника</h1>
      {orders.length === 0 ? (
        <p>Заказы отсутствуют</p>
      ) : (
        <div className='applications-list'>
          {orders.map((order) => (
            <div key={order.id} className='application-item' style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
              <div className='application-info' style={{ marginBottom: '10px' }}>
                <p className='service-name' style={{ fontWeight: 'bold', fontSize: '18px' }}>{order.tariff?.name || 'Не указано'}</p>
                <p className='registration-date'>{order.user_full_name || 'Не указано'}</p>
                <p className='total-check'>{order.tariff?.price ? `${order.tariff.price} ₽` : 'Не указано'}</p>
                <p className='order-status'>Статус: {statusLabels[order.status] || 'Не указан'}</p>
              </div>
              <div className='application-actions' style={{ display: 'flex', gap: '10px' }}>
                <select
                  value={order.status}
                  onChange={async (e) => {
                    const newStatus = e.target.value
                    try {
                      const response = await fetch(`http://localhost:8000/orders/${order.id}/`, {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify({ status: newStatus }),
                      })
                      if (!response.ok) {
                        throw new Error('Ошибка обновления статуса')
                      }
                      // Обновляем локальное состояние orders
                      const updatedOrder = await response.json()
                      setOrders((prevOrders) =>
                        prevOrders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
                      )
                    } catch (error) {
                      console.error('Error updating order status:', error)
                      alert('Ошибка при обновлении статуса')
                    }
                  }}
                  style={{
                    marginRight: '10px',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'border-color 0.3s ease',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = '#007bff'}
                  onBlur={e => e.currentTarget.style.borderColor = '#ccc'}
                >
                  <option value="pending">В обработке</option>
                  <option value="in_progress">Выполняется</option>
                  <option value="under_review">На проверке</option>
                  <option value="cancelled">Отменен</option>
                  <option value="completed">Завершен</option>
                  <option value="failed">Неудача</option>
                  <option value="refunded">Возврат</option>
                </select>
                <button
                  className='chat-btn'
                  onClick={() => {
                    // Переход в чат, например, на страницу /chat/:orderId
                    window.location.href = `/chat/${order.id}`
                  }}
                  style={{
                    backgroundColor: '#5A4943',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#3f362f'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#5A4943'}
                >
                  Перейти в чат
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkerPage;
