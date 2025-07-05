// components/ProtectedRoute.jsx
import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { MainContext } from '../Context/Context';
import { getUser } from '../api/getUser';

const ProtectedRoute = ({ children }) => {
  const { baseUrl, token } = useContext(MainContext);
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getUser(baseUrl, token);
        setAuth(user); 
      } catch (error) {
        setAuth(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [token]);

  if (loading) return <div>Loading...</div>;

  return auth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
