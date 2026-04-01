import React, { useEffect, useMemo, useState } from 'react';
import api from '../utils/api';

const PAGE_SIZE = 5;

export default function FriendsPage() {
  const [friends, setFriends] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);

  const [friendPage, setFriendPage] = useState(1);
  const [incomingPage, setIncomingPage] = useState(1);
  const [outgoingPage, setOutgoingPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [friendsRes, requestRes] = await Promise.all([
        api.get('/api/friends'),
        api.get('/api/friends/requests'),
      ]);

      setFriends(friendsRes.data.data || []);
      setIncoming(requestRes.data.incoming || []);
      setOutgoing(requestRes.data.outgoing || []);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Không tải được dữ liệu bạn bè');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const acceptRequest = async (id) => {
    try {
      await api.put(`/api/friends/request/${id}/accept`);
      await fetchData();
    } catch (err) {
      alert(err?.response?.data?.message || 'Không chấp nhận được lời mời');
    }
  };

  const rejectRequest = async (id) => {
    try {
      await api.put(`/api/friends/request/${id}/reject`);
      await fetchData();
    } catch (err) {
      alert(err?.response?.data?.message || 'Không từ chối được lời mời');
    }
  };

  const unfriend = async (friendId) => {
    try {
      await api.delete(`/api/friends/${friendId}`);
      await fetchData();
    } catch (err) {
      alert(err?.response?.data?.message || 'Không hủy kết bạn được');
    }
  };

  const paginate = (items, page) =>
    items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const incomingRows = useMemo(
    () => paginate(incoming, incomingPage),
    [incoming, incomingPage]
  );

  const outgoingRows = useMemo(
    () => paginate(outgoing, outgoingPage),
    [outgoing, outgoingPage]
  );

  const friendRows = useMemo(
    () => paginate(friends, friendPage),
    [friends, friendPage]
  );

  return (
    <div style={wrapper}>
      <h1>Bạn bè</h1>

      {loading ? (
        <p>Đang tải dữ liệu bạn bè...</p>
      ) : (
        <>
          <SectionCard
            title="Lời mời đến"
            items={incomingRows}
            emptyText="Không có lời mời nào."
            page={incomingPage}
            total={incoming.length}
            onPrev={() => setIncomingPage((p) => Math.max(1, p - 1))}
            onNext={() =>
              setIncomingPage((p) =>
                p * PAGE_SIZE < incoming.length ? p + 1 : p
              )
            }
            renderItem={(item) => (
              <div key={item.id} style={card}>
                <span>{item.full_name || item.username}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => acceptRequest(item.id)}>Chấp nhận</button>
                  <button onClick={() => rejectRequest(item.id)}>Từ chối</button>
                </div>
              </div>
            )}
          />

          <SectionCard
            title="Lời mời đã gửi"
            items={outgoingRows}
            emptyText="Không có lời mời đang chờ."
            page={outgoingPage}
            total={outgoing.length}
            onPrev={() => setOutgoingPage((p) => Math.max(1, p - 1))}
            onNext={() =>
              setOutgoingPage((p) =>
                p * PAGE_SIZE < outgoing.length ? p + 1 : p
              )
            }
            renderItem={(item) => (
              <div key={item.id} style={card}>
                <span>{item.full_name || item.username}</span>
                <small>Đang chờ</small>
              </div>
            )}
          />

          <SectionCard
            title="Danh sách bạn bè"
            items={friendRows}
            emptyText="Chưa có bạn bè."
            page={friendPage}
            total={friends.length}
            onPrev={() => setFriendPage((p) => Math.max(1, p - 1))}
            onNext={() =>
              setFriendPage((p) =>
                p * PAGE_SIZE < friends.length ? p + 1 : p
              )
            }
            renderItem={(item) => (
              <div key={item.id} style={card}>
                <span>{item.full_name || item.username}</span>
                <button onClick={() => unfriend(item.id)}>Hủy kết bạn</button>
              </div>
            )}
          />
        </>
      )}
    </div>
  );
}

function SectionCard({
  title,
  items,
  emptyText,
  page,
  total,
  onPrev,
  onNext,
  renderItem,
}) {
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <h2>{title}</h2>

      {items.length === 0 ? <p>{emptyText}</p> : items.map(renderItem)}

      {total > PAGE_SIZE && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={onPrev} disabled={page <= 1}>
            Prev
          </button>
          <span>
            Trang {page}/{totalPages}
          </span>
          <button onClick={onNext} disabled={page >= totalPages}>
            Next
          </button>
        </div>
      )}
    </section>
  );
}

const wrapper = {
  padding: 24,
  maxWidth: 900,
  margin: '0 auto',
  display: 'grid',
  gap: 24,
};

const card = {
  border: '1px solid #ccc',
  borderRadius: 10,
  padding: 16,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
};