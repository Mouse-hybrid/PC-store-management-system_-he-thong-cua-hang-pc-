exports.seed = async function (knex) {
  await knex('messages').del();
  await knex('friends').del();
  await knex('friend_requests').del();
  await knex('user_achievements').del();
  await knex('achievements').del();

  await knex('achievements').insert([
    { slug: 'first_login', title: 'Lần đăng nhập đầu tiên', description: 'Đăng nhập hệ thống lần đầu' },
    { slug: 'first_win', title: 'Chiến thắng đầu tiên', description: 'Thắng một trận game bất kỳ' },
    { slug: 'first_review', title: 'Nhà phê bình', description: 'Gửi đánh giá đầu tiên' },
    { slug: 'social_starter', title: 'Kết nối đầu tiên', description: 'Có bạn bè đầu tiên' },
    { slug: 'saved_game', title: 'Cẩn thận là bạn', description: 'Lưu game đầu tiên' },
    { slug: 'chatty_player', title: 'Người chơi sôi nổi', description: 'Gửi ít nhất một tin nhắn cho bạn bè' },
    { slug: 'top_ranker', title: 'Top bảng xếp hạng', description: 'Có điểm số cao trên một game' },
    { slug: 'creative_player', title: 'Người chơi sáng tạo', description: 'Trải nghiệm bảng vẽ tự do' },
  ]);

  const users = await knex('users').select('id', 'username');
  const userMap = Object.fromEntries(users.map((u) => [u.username, u.id]));

  const achievements = await knex('achievements').select('id', 'slug');
  const achievementMap = Object.fromEntries(achievements.map((a) => [a.slug, a.id]));

  await knex('friend_requests').insert([
    { sender_id: userMap.player1, receiver_id: userMap.player2, status: 'accepted' },
    { sender_id: userMap.player1, receiver_id: userMap.player3, status: 'pending' },
    { sender_id: userMap.player2, receiver_id: userMap.player4, status: 'accepted' },
    { sender_id: userMap.player3, receiver_id: userMap.player4, status: 'pending' },
    { sender_id: userMap.player4, receiver_id: userMap.player5, status: 'accepted' },
    { sender_id: userMap.player5, receiver_id: userMap.player2, status: 'rejected' },
  ]);

  const friendships = [
    [userMap.player1, userMap.player2],
    [userMap.player2, userMap.player4],
    [userMap.player4, userMap.player5],
  ].map(([a, b]) => ({
    user_one_id: Math.min(a, b),
    user_two_id: Math.max(a, b),
  }));

  await knex('friends').insert(friendships);

  await knex('messages').insert([
    { sender_id: userMap.player1, receiver_id: userMap.player2, content: 'Chơi caro không?' },
    { sender_id: userMap.player2, receiver_id: userMap.player1, content: 'Có, vào phòng luôn.' },
    { sender_id: userMap.player1, receiver_id: userMap.player2, content: 'Ok nhé!' },
    { sender_id: userMap.player2, receiver_id: userMap.player4, content: 'Thử game snake đi.' },
    { sender_id: userMap.player4, receiver_id: userMap.player2, content: 'Được luôn.' },
    { sender_id: userMap.player3, receiver_id: userMap.player4, content: 'Khi nào chơi match-3?' },
    { sender_id: userMap.player4, receiver_id: userMap.player5, content: 'Xem bảng xếp hạng memory chưa?' },
    { sender_id: userMap.player5, receiver_id: userMap.player4, content: 'Mình vừa phá kỷ lục luôn.' },
    { sender_id: userMap.player1, receiver_id: userMap.player2, content: 'Tối nay test save/load nhé.' },
    { sender_id: userMap.player2, receiver_id: userMap.player1, content: 'Ok, test luôn cả review nữa.' },
  ]);

  await knex('user_achievements').insert([
    { user_id: userMap.player1, achievement_id: achievementMap.first_login },
    { user_id: userMap.player1, achievement_id: achievementMap.social_starter },
    { user_id: userMap.player2, achievement_id: achievementMap.first_login },
    { user_id: userMap.player2, achievement_id: achievementMap.chatty_player },
    { user_id: userMap.player3, achievement_id: achievementMap.first_login },
    { user_id: userMap.player4, achievement_id: achievementMap.first_login },
    { user_id: userMap.player4, achievement_id: achievementMap.creative_player },
    { user_id: userMap.player5, achievement_id: achievementMap.first_login },
  ]);
};