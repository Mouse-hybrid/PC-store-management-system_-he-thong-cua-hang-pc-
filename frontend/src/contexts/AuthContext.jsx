// src/contexts/AuthContext.jsx
import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Giả lập state user. Thực tế bạn sẽ lấy data từ API (Node/Express) và localStorage
  // VD: { name: 'Alex', role: 'admin' }
  const [user, setUser] = useState(null); 

  // Hàm đăng xuất
  const logout = () => {
    setUser(null);
    // Xóa token ở localStorage tại đây
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);