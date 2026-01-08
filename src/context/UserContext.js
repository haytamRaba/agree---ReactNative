import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const registerUser = (email, password, nickname) => {
    if (email && password && nickname) {
      setUser({
        email,
        password,
        nickname,
      });
      setIsRegistered(true);
      return true;
    }
    return false;
  };

  const loginUser = (email, password) => {
    if (user && user.email === email && user.password === password) {
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsRegistered(false);
  };

  return (
    <UserContext.Provider value={{ user, isRegistered, registerUser, loginUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
