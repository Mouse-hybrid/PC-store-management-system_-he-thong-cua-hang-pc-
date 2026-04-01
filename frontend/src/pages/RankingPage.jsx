import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const GAME_OPTIONS = [
  { label: 'Caro 5', value: 'caro-5' },
  { label: 'Caro 4', value: 'caro-4' },
  { label: 'Tic-Tac-Toe', value: 'tic-tac-toe' },
  { label: 'Snake', value: 'snake' },
  { label: 'Match-3', value: 'match-3' },
  { label: 'Memory', value: 'memory' },
  { label: 'Free Draw', value: 'free-draw' },
];

export default function RankingPage() {
  const [slug, setSlug] = useState('caro-5');
  const [scope, setScope] = useState('global');
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);

  const fetchRanking = async () => {
    const res = await api.get(`/api/ranking/${slug}`, {
      params: { scope, page, limit: 10 },
    });
    setRows(res.data.data || []);
  };

  useEffect(() => {
    fetchRanking();
  }, [slug, scope, page]);

  return (
    <div style={wrapper}>
      <h1>Bảng xếp hạng</h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <select value={slug} onChange={(e) => setSlug(e.target.value)}>
          {GAME_OPTIONS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
        </select>

        <select value={scope} onChange={(e) => setScope(e.target.value)}>
          <option value="global">Toàn hệ thống</option>
          <option value="friends">Bạn bè</option>
          <option value="me">Cá nhân</option>
        </select>
      </div>

      <table width="100%" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>#</th>
            <th>Người chơi</th>
            <th>Điểm</th>
            <th>Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id}>
              <td>{(page - 1) * 10 + index + 1}</td>
              <td>{row.full_name || row.username}</td>
              <td>{row.score}</td>
              <td>{row.play_time_seconds}s</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
        <button onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
}

const wrapper = { padding: 24, maxWidth: 1000, margin: '0 auto' };