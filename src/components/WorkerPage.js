import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const WorkerPage = () => {
  const { user, orders, fetchAllOrders, accessToken } = useAuth();

  console.log('WorkerPage user:', user);
  console.log('WorkerPage orders:', orders);

  useEffect(() => {
    if (user && user.is_worker && accessToken) {
      console.log('Calling fetchAllOrders in WorkerPage');
      fetchAllOrders(accessToken);
    }
  }, [user, accessToken, fetchAllOrders]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>страница для работника</h1>
      {orders.length === 0 ? (
        <p>Заказы отсутствуют</p>
      ) : (
        <div className='applications-list'>
          {orders.map((order) => (
            <div key={order.id} className='application-item'>
              <div className='application-info'>
                <p className='service-name'>{order.tariff?.name || 'Не указано'}</p>
                <p className='registration-date'>{order.user_full_name || 'Не указано'}</p>
                <p className='total-check'>{order.tariff?.price ? `${order.tariff.price} ₽` : 'Не указано'}</p>
              </div>
              <div className='application-actions'>
                <button className='status-btn'>Статус</button>
                <button className='cancel-btn'>Отменить заявку</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkerPage;
