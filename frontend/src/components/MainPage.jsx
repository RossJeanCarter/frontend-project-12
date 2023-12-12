import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div>
      Основная страница /;
    </div>
  );
};

export default MainPage;
