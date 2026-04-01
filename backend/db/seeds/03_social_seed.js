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
    { slug: 'top_ranker', title: 'Top bảng xếp hạng', description: 'Đạt điểm cao trên bảng xếp hạng' },
  ]);

  const users = await knex('users')
    .select('id', 'username');

  const userMap = Object.fromEntries(users.map((u) => [u.username, u.id]));

  const achievements = await knex('achievements').select('id', 'slug');
  const achievementMap = Object.fromEntries(achievements.map((a) => [a.slug, a.id]));

  await knex('friend_requests').insert([
    {
      sender_id: userMap.player1,
      receiver_id: userMap.player2,
      status: 'accepted',
    },
    {
      sender_id: userMap.player1,
      receiver_id: userMap.player3,
      status: 'pending',
    },
    {
      sender_id: userMap.player2,
      receiver_id: userMap.player4,
      status: 'accepted',
    },
    {
      sender_id: userMap.player3,
      receiver_id: userMap.player4,
      status: 'pending',
    },
  ]);

  await knex('friends').insert([
    {
      user_one_id: Math.min(userMap.player1, userMap.player2),
      user_two_id: Math.max(userMap.player1, userMap.player2),
    },
    {
      user_one_id: Math.min(userMap.player2, userMap.player4),
      user_two_id: Math.max(userMap.player2, userMap.player4),
    },
  ]);

  await knex('messages').insert([
    {
      sender_id: userMap.player1,
      receiver_id: userMap.player2,
      content: 'Chơi caro không?',
    },
    {
      sender_id: userMap.player2,
      receiver_id: userMap.player1,
      content: 'Có, vào phòng luôn.',
    },
    {
      sender_id: userMap.player1,
      receiver_id: userMap.player2,
      content: 'Ok nhé!',
    },
    {
      sender_id: userMap.player2,
      receiver_id: userMap.player4,
      content: 'Thử game snake đi.',
    },
    {
      sender_id: userMap.player4,
      receiver_id: userMap.player2,
      content: 'Được luôn.',
    },
    {
      sender_id: userMap.player3,
      receiver_id: userMap.player4,
      content: 'Khi nào chơi match-3?',
    },
  ]);

  await knex('user_achievements').insert([
    {
      user_id: userMap.player1,
      achievement_id: achievementMap.first_login,
    },
    {
      user_id: userMap.player1,
      achievement_id: achievementMap.social_starter,
    },
    {
      user_id: userMap.player2,
      achievement_id: achievementMap.first_login,
    },
    {
      user_id: userMap.player3,
      achievement_id: achievementMap.first_login,
    },
    {
      user_id: userMap.player4,
      achievement_id: achievementMap.first_login,
    },
  ]);
};