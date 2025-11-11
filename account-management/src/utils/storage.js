// Utility functions for localStorage management
export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('currentUser'));
  } catch (error) {
    console.error('Error reading stored user:', error);
    return null;
  }
};

export const storeUser = (user) => {
  try {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } catch (error) {
    console.error('Error storing user:', error);
  }
};

export const clearStoredUser = () => {
  try {
    localStorage.removeItem('currentUser');
  } catch (error) {
    console.error('Error clearing stored user:', error);
  }
};