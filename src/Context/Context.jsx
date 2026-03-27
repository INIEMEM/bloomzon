import { useState, createContext } from "react";
import {
  API_BASE_URL,
  BLOOMZONLIVE_BASE_URL,
  readStoredToken,
  sessionTokenKey,
} from "../api/config";

export const MainContext = createContext();

const Context = (props) => {
  const [user, setUser] = useState({});
  const [token, setToken] = useState(readStoredToken());

  const saveToken = (nextToken) => {
    if (nextToken) {
      sessionStorage.setItem(sessionTokenKey, JSON.stringify(nextToken));
    } else {
      sessionStorage.removeItem(sessionTokenKey);
    }

    setToken(nextToken || null);
  };

  const clearToken = () => saveToken(null);

  const contextValue = {
    setToken: saveToken,
    clearToken,
    token,
    baseUrl: `${API_BASE_URL}/`,
    baseUrl2: `${API_BASE_URL}/`,
    baseUrl23: `${BLOOMZONLIVE_BASE_URL}/`,
    user,
    setUser,
  };

  return (
    <MainContext.Provider value={contextValue}>{props.children}</MainContext.Provider> 
  )
}

export default Context
