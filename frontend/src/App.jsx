import React from 'react';
import { Routes, Route } from 'react-router-dom';

// --- IMPORT COMPONENT ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// --- IMPORT CÁC TRANG (Pages) ---
import Home from './pages/Home';             // Thêm trang Sảnh Chờ
import CaroGame from './pages/CaroGame';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import ErrorPage from './pages/ErrorPage';
import TicTacToe from './pages/TicTacToe';
import DrawBoard from './pages/DrawBoard';

function App() {
  return (
    <>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          {/* TRANG CHỦ MỚI LÀ SẢNH CHỜ GAME */}
          <Route path="/" element={<Home />} />
          
          {/* DỜI GAME CARO SANG ĐƯỜNG DẪN MỚI */}
          <Route path="/caro" element={<CaroGame />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/tic-tac-toe" element={<TicTacToe />} />
          <Route path="/draw" element={<DrawBoard />} />
          <Route path="*" element={<ErrorPage defaultCode={404} />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;