import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function AdminGamesPage() {
  const [games, setGames] = useState([]);

  const fetchGames = async () => {
    const res = await api.get('/api/admin/games');
    const normalized = (res.data.data || []).map((g) => ({
      ...g,
      board_size: typeof g.board_size === 'string' ? JSON.parse(g.board_size) : g.board_size,
    }));
    setGames(normalized);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleChange = (index, field, value) => {
    setGames((prev) =>
      prev.map((g, i) => (i === index ? { ...g, [field]: value } : g))
    );
  };

  const handleBoardSizeChange = (index, key, value) => {
    setGames((prev) =>
      prev.map((g, i) =>
        i === index
          ? { ...g, board_size: { ...g.board_size, [key]: Number(value) } }
          : g
      )
    );
  };

  const handleSave = async (game) => {
    await api.put(`/api/admin/games/${game.id}`, {
      name: game.name,
      instructions: game.instructions,
      board_size: game.board_size,
      is_active: game.is_active,
    });
    alert('Đã cập nhật');
  };

  return (
    <div style={wrapper}>
      <h1>Quản lý game</h1>

      <div style={{ display: 'grid', gap: 16 }}>
        {games.map((game, index) => (
          <div key={game.id} style={card}>
            <input
              value={game.name}
              onChange={(e) => handleChange(index, 'name', e.target.value)}
            />

            <textarea
              rows={3}
              value={game.instructions || ''}
              onChange={(e) => handleChange(index, 'instructions', e.target.value)}
            />

            <div style={{ display: 'flex', gap: 12 }}>
              <input
                type="number"
                value={game.board_size?.width || 0}
                onChange={(e) => handleBoardSizeChange(index, 'width', e.target.value)}
                placeholder="Width"
              />
              <input
                type="number"
                value={game.board_size?.height || 0}
                onChange={(e) => handleBoardSizeChange(index, 'height', e.target.value)}
                placeholder="Height"
              />
            </div>

            <label>
              <input
                type="checkbox"
                checked={!!game.is_active}
                onChange={(e) => handleChange(index, 'is_active', e.target.checked)}
              />
              Kích hoạt
            </label>

            <button onClick={() => handleSave(game)}>Lưu</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const wrapper = { padding: 24, maxWidth: 1000, margin: '0 auto' };
const card = { border: '1px solid #ccc', borderRadius: 10, padding: 16, display: 'grid', gap: 12 };