import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function UserSearch() {
  const [keyword, setKeyword] = useState('');
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/auth/search', {
        params: { keyword, page, limit: 10 },
      });
      setUsers(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const sendRequest = async (receiver_id) => {
    try {
      await api.post('/api/friends/request', { receiver_id });
      alert('Đã gửi lời mời');
    } catch (err) {
      alert(err?.response?.data?.message || 'Không gửi được lời mời');
    }
  };

  return (
    <div style={wrapper}>
      <h1>Tìm kiếm người dùng</h1>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Nhập tên, username hoặc email"
        />
        <button type="submit">Tìm</button>
      </form>

      <div style={{ display: 'grid', gap: 12 }}>
        {users.map((u) => (
          <div key={u.id} style={card}>
            <div>
              <strong>{u.full_name || u.username}</strong>
              <p>{u.email}</p>
            </div>
            <button onClick={() => sendRequest(u.id)}>Kết bạn</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
        <button onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
}

const wrapper = { padding: 24, maxWidth: 900, margin: '0 auto' };
const card = { border: '1px solid #ccc', borderRadius: 10, padding: 16, display: 'flex', justifyContent: 'space-between' };