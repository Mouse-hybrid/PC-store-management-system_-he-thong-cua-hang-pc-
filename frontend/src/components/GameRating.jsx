import React, { useEffect, useState } from 'react';
import { addReview, getReviews } from '../utils/gameStorage';

export default function GameRating({ gameSlug }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      const data = await getReviews(gameSlug);
      setReviews(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [gameSlug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await addReview(gameSlug, rating, comment);
      setComment('');
      setRating(5);
      fetchReviews();
    } catch (err) {
      alert(err?.response?.data?.message || 'Không gửi được đánh giá');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 24, width: '100%', maxWidth: 700 }}>
      <h3>Đánh giá trò chơi</h3>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{n} sao</option>
          ))}
        </select>

        <textarea
          rows={3}
          placeholder="Nhập nhận xét..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
        </button>
      </form>

      <div style={{ display: 'grid', gap: 10 }}>
        {reviews.map((item) => (
          <div key={item.id} style={{ padding: 12, border: '1px solid #ccc', borderRadius: 8 }}>
            <strong>{item.username}</strong> - {item.rating}/5
            <p style={{ marginTop: 6 }}>{item.comment || 'Không có bình luận'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}