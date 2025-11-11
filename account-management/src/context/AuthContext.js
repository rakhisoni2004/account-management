import React, { createContext, useState, useContext, useEffect } from 'react';
import { getStoredUser, storeUser, clearStoredUser } from '../utils/storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on app load
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Simple validation - in real app, this would be an API call
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData = { ...foundUser };
      delete userData.password; // Don't store password in state
      setUser(userData);
      storeUser(userData);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.find(u => u.email === userData.email)) {
      return { success: false, error: 'User with this email already exists' };
    }

    // Add new user
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto-login after registration
    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;
    setUser(userWithoutPassword);
    storeUser(userWithoutPassword);

    return { success: true };
  };

  const updateProfile = (updatedData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedData };
      localStorage.setItem('users', JSON.stringify(users));
      
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      storeUser(updatedUser);
      
      return { success: true };
    }
    return { success: false, error: 'User not found' };
  };

  const logout = () => {
    setUser(null);
    clearStoredUser();
  };

  const value = {
    user,
    login,
    register,
    updateProfile,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};