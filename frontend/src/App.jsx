import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';

import { AuthProvider } from './contexts/AuthContext'; 

function App() {
  return (
    <BrowserRouter>
      {/* 2. Mở khóa thẻ AuthProvider để nó bọc lấy AppRouter */}
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;