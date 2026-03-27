// components/ProtectedRoute.jsx
import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { MainContext } from '../Context/Context';
import { getUser } from '../api/getUser';
import logo from '../Layouts/assets/bloomzon.png';

const ProtectedRoute = ({ children }) => {
  const { baseUrl, token, setUser, clearToken } = useContext(MainContext);
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setAuth(null);
        setLoading(false);
        return;
      }

      try {
        const response = await getUser(baseUrl, token);
        setAuth(response);
      } catch (error) {
        clearToken();
        setAuth(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [baseUrl, clearToken, token]);

  useEffect(() => {
    if (auth) {
      setUser(auth);
    }
  }, [auth, setUser]);

  if (loading) return <div className='flex flex-center justify-center items-center h-screen animate-pulse'><img src={logo} className='logo-image' style={{width:120, height:120, objectFit:'contain'}}/></div>;

  return auth ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
