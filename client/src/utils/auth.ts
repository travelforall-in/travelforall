// src/utils/auth.ts
export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem("token");
    return !!token;
  };
  
  export const getUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  };
  