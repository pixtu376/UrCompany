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
        <table border="1" cellPadding="5" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Пользователь</th>
              <th>Тариф</th>
              <th>Статус</th>
              <th>Срок</th>
              <th>Кастомное имя</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{typeof order.user === 'object' ? order.user.email || order.user.id : order.user}</td>
                <td>{order.tariff ? order.tariff.name : ''}</td>
                <td>{order.status}</td>
                <td>{order.deadline}</td>
                <td>{order.custom_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WorkerPage;
