import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../Styles/Tariffs.css';

function Tariffs() {
  const [tariffs, setTariffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const clientType = location.state?.clientType;

  useEffect(() => {
    const fetchTariffs = async () => {
      try {
        let url = '/api/tariffs/';
        if (clientType) {
          url += `?client_type=${clientType}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        setTariffs(data);
      } catch (error) {
        console.error('Error fetching tariffs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTariffs();
  }, [clientType]);

  if (loading) return <div className="loading">Загрузка тарифов...</div>;

  return (
    <div className="tariffs-page">
      <h1>{clientType === 'individual' ? 'Тарифы для физических лиц' : 'Тарифы для юридических лиц'}</h1>
      
      <div className="tariffs-grid">
        {tariffs.map(tariff => (
          <div key={tariff.id} className="tariff-card">
            <h2>{tariff.name}</h2>
            <p className="description">{tariff.short_description}</p>
            <p className="price">{tariff.price} ₽</p>
            <Link to={`/tariff/${tariff.id}`} className="details-button">
              Подробнее
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tariffs;