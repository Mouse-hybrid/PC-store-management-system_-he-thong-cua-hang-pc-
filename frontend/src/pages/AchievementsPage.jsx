import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function AchievementsPage() {
  const [items, setItems] = useState([]);
  const [unlockingSlug, setUnlockingSlug] = useState('');

  const fetchAchievements = async () => {
    try {
      const res = await api.get('/api/achievements');
      setItems(res.data.data || []);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || 'Không tải được thành tựu');
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleUnlock = async (slug) => {
    try {
      setUnlockingSlug(slug);
      await api.post(`/api/achievements/unlock/${slug}`);
      await fetchAchievements();
      alert('Đã mở khóa thành tựu');
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || 'Không mở khóa được thành tựu');
    } finally {
      setUnlockingSlug('');
    }
  };

  return (
    <div style={wrapper}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <h1>Thành tựu</h1>
        <button onClick={fetchAchievements}>Làm mới</button>
      </div>

      <div style={grid}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              ...card,
              opacity: item.unlocked ? 1 : 0.65,
            }}
          >
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <strong>{item.unlocked ? 'Đã mở khóa' : 'Chưa mở khóa'}</strong>

            {!item.unlocked && (
              <button
                onClick={() => handleUnlock(item.slug)}
                disabled={unlockingSlug === item.slug}
                style={{ marginTop: 12 }}
              >
                {unlockingSlug === item.slug ? 'Đang mở khóa...' : 'Mở khóa demo'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const wrapper = {
  padding: 24,
  maxWidth: 1000,
  margin: '0 auto',
};

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: 16,
};

const card = {
  border: '1px solid #ccc',
  borderRadius: 10,
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
};