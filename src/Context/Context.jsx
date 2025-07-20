import { useState, createContext } from "react";
export const MainContext = createContext();
const Context = (props) => {
  const [user, setUser] = useState({});
  const [baseUrl, setBaseUrl] = useState('https://express-api-bloomzon.onrender.com/api/v1/');
  const getToken = () => {
    const tokenString = sessionStorage.getItem('token');
    try {
      // Only parse if tokenString exists
      return tokenString ? JSON.parse(tokenString) : null;
    } catch (error) {
      console.error("Failed to parse token:", error);
      return null;
    }
  }; 
    
 
    const [token, setToken] = useState(getToken());
    const saveToken = (token, user) =>
    {
        sessionStorage.setItem('token', JSON.stringify(token));     
        setToken(token)
    }
    const contextValue = 
    {
      setToken:saveToken,
      token,
      baseUrl,
      user,
      setUser
    }
  return (
    <MainContext.Provider value={contextValue}>{props.children}</MainContext.Provider> 
  )
}

export default Context