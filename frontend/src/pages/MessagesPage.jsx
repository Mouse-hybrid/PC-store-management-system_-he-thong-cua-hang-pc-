import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const LIMIT = 20;

export default function MessagesPage() {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [page, setPage] = useState(1);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoadingFriends(true);
        const res = await api.get('/api/friends');
        setFriends(res.data.data || []);
      } catch (error) {
        console.error(error);
        alert(error?.response?.data?.message || 'Không tải được danh sách bạn bè');
      } finally {
        setLoadingFriends(false);
      }
    };

    fetchFriends();
  }, []);

  const loadConversation = async (friend, nextPage = 1) => {
    try {
      setSelectedFriend(friend);
      setPage(nextPage);
      setLoadingMessages(true);

      const res = await api.get(`/api/messages/${friend.id}`, {
        params: { page: nextPage, limit: LIMIT },
      });

      setMessages(res.data.data || []);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || 'Không tải được hội thoại');
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedFriend || !content.trim()) return;

    try {
      setSending(true);

      await api.post('/api/messages', {
        receiver_id: selectedFriend.id,
        content: content.trim(),
      });

      setContent('');
      await loadConversation(selectedFriend, 1);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || 'Không gửi được tin nhắn');
    } finally {
      setSending(false);
    }
  };

  const handlePrev = () => {
    if (!selectedFriend || page <= 1) return;
    loadConversation(selectedFriend, page - 1);
  };

  const handleNext = () => {
    if (!selectedFriend || messages.length < LIMIT) return;
    loadConversation(selectedFriend, page + 1);
  };

  return (
    <div style={layout}>
      <aside style={sidebar}>
        <h2>Bạn bè</h2>

        {loadingFriends ? (
          <p>Đang tải danh sách bạn bè...</p>
        ) : friends.length === 0 ? (
          <p>Chưa có bạn bè để nhắn tin.</p>
        ) : (
          friends.map((f) => (
            <button
              key={f.id}
              onClick={() => loadConversation(f, 1)}
              style={{
                ...friendBtn,
                border:
                  selectedFriend?.id === f.id
                    ? '2px solid #339af0'
                    : '1px solid #ddd',
              }}
            >
              {f.full_name || f.username}
            </button>
          ))
        )}
      </aside>

      <main style={main}>
        <h2>
          {selectedFriend
            ? `Nhắn với ${selectedFriend.full_name || selectedFriend.username}`
            : 'Chọn một người bạn'}
        </h2>

        <div style={chatBox}>
          {!selectedFriend ? (
            <p>Hãy chọn một người bạn ở cột bên trái.</p>
          ) : loadingMessages ? (
            <p>Đang tải hội thoại...</p>
          ) : messages.length === 0 ? (
            <p>Chưa có tin nhắn nào.</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} style={msgItem}>
                <small>{new Date(msg.created_at).toLocaleString()}</small>
                <p style={{ margin: '6px 0 0 0' }}>{msg.content}</p>
              </div>
            ))
          )}
        </div>

        {selectedFriend && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button disabled={page <= 1 || loadingMessages} onClick={handlePrev}>
              Prev
            </button>
            <span>Trang {page}</span>
            <button
              disabled={messages.length < LIMIT || loadingMessages}
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        )}

        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 12 }}>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nhập tin nhắn..."
            disabled={!selectedFriend || sending}
            style={{ flex: 1 }}
          />
          <button type="submit" disabled={!selectedFriend || sending}>
            {sending ? 'Đang gửi...' : 'Gửi'}
          </button>
        </form>
      </main>
    </div>
  );
}

const layout = {
  display: 'grid',
  gridTemplateColumns: '280px 1fr',
  minHeight: '80vh',
};

const sidebar = {
  borderRight: '1px solid #ccc',
  padding: 16,
};

const main = {
  padding: 16,
  display: 'grid',
  gap: 16,
};

const friendBtn = {
  display: 'block',
  width: '100%',
  marginBottom: 8,
  padding: 12,
  borderRadius: 8,
  background: '#fff',
  cursor: 'pointer',
};

const chatBox = {
  border: '1px solid #ccc',
  borderRadius: 8,
  padding: 12,
  minHeight: 400,
  overflowY: 'auto',
};

const msgItem = {
  padding: 10,
  marginBottom: 8,
  borderRadius: 8,
  background: '#f3f3f3',
  color: '#111',
};