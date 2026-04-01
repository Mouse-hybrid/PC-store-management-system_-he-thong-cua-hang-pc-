import React from 'react';
import { Routes, Route } from 'react-router-dom';

<<<<<<< HEAD
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
=======
// --- IMPORT COMPONENT ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// --- IMPORT CÁC TRANG (Pages) ---
import Home from './pages/Home';             // Thêm trang Sảnh Chờ
import CaroGame from './pages/CaroGame';
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
<<<<<<< HEAD
import AdminGamesPage from './pages/AdminGamesPage';

import CaroGame from './pages/CaroGame';
import Caro4Game from './pages/Caro4Game';
import TicTacToe from './pages/TicTacToe';
import DrawBoard from './pages/DrawBoard';
import SnakeGame from './pages/SnakeGame';
import Match3Game from './pages/Match3Game';
import MemoryGame from './pages/MemoryGame';

import UserSearch from './pages/UserSearch';
import FriendsPage from './pages/FriendsPage';
import MessagesPage from './pages/MessagesPage';
import AchievementsPage from './pages/AchievementsPage';
import RankingPage from './pages/RankingPage';

import ErrorPage from './pages/ErrorPage';

function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-main)',
      }}
    >
      <Navbar />

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/games" element={<AdminGamesPage />} />

          <Route path="/caro" element={<CaroGame />} />
          <Route path="/caro-4" element={<Caro4Game />} />
          <Route path="/tic-tac-toe" element={<TicTacToe />} />
          <Route path="/draw" element={<DrawBoard />} />
          <Route path="/snake" element={<SnakeGame />} />
          <Route path="/match-3" element={<Match3Game />} />
          <Route path="/memory" element={<MemoryGame />} />

          <Route path="/users" element={<UserSearch />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/ranking" element={<RankingPage />} />

          <Route path="*" element={<ErrorPage defaultCode={404} />} />
        </Routes>
      </main>

      <Footer />
    </div>
=======
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
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4
  );
}

export default App;