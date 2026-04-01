exports.seed = async function (knex) {
  await knex('game_reviews').del();
  await knex('game_scores').del();
  await knex('game_saves').del();

  const users = await knex('users').select('id', 'username');
  const games = await knex('games').select('id', 'slug');

  const userMap = Object.fromEntries(users.map((u) => [u.username, u.id]));
  const gameMap = Object.fromEntries(games.map((g) => [g.slug, g.id]));

  await knex('game_scores').insert([
    { user_id: userMap.player1, game_id: gameMap['caro-5'], score: 120, play_time_seconds: 85 },
    { user_id: userMap.player2, game_id: gameMap['caro-5'], score: 90, play_time_seconds: 95 },
    { user_id: userMap.player3, game_id: gameMap['caro-4'], score: 140, play_time_seconds: 70 },
    { user_id: userMap.player1, game_id: gameMap['tic-tac-toe'], score: 60, play_time_seconds: 35 },
    { user_id: userMap.player2, game_id: gameMap['snake'], score: 110, play_time_seconds: 75 },
    { user_id: userMap.player3, game_id: gameMap['match-3'], score: 130, play_time_seconds: 90 },
    { user_id: userMap.player4, game_id: gameMap['memory'], score: 88, play_time_seconds: 50 },
    { user_id: userMap.player4, game_id: gameMap['free-draw'], score: 40, play_time_seconds: 120 },
  ]);

  await knex('game_reviews').insert([
    { user_id: userMap.player1, game_id: gameMap['caro-5'], rating: 5, comment: 'Chơi khá vui' },
    { user_id: userMap.player2, game_id: gameMap['caro-4'], rating: 4, comment: 'Caro 4 nhanh và dễ demo' },
    { user_id: userMap.player1, game_id: gameMap['tic-tac-toe'], rating: 4, comment: 'Gọn và quen thuộc' },
    { user_id: userMap.player2, game_id: gameMap['snake'], rating: 4, comment: 'Dễ demo' },
    { user_id: userMap.player3, game_id: gameMap['match-3'], rating: 5, comment: 'Hiệu ứng ghép vui' },
    { user_id: userMap.player4, game_id: gameMap['memory'], rating: 5, comment: 'Đẹp và dễ chơi' },
    { user_id: userMap.player4, game_id: gameMap['free-draw'], rating: 4, comment: 'Vẽ ổn và trực quan' },
  ]);

  await knex('game_saves').insert([
    {
      user_id: userMap.player1,
      game_id: gameMap['caro-5'],
      state_data: JSON.stringify({ boardState: [], isPlayerTurn: true }),
    },
    {
      user_id: userMap.player3,
      game_id: gameMap['caro-4'],
      state_data: JSON.stringify({ boardState: [], isPlayerTurn: false }),
    },
    {
      user_id: userMap.player1,
      game_id: gameMap['tic-tac-toe'],
      state_data: JSON.stringify({ boardState: ['X', null, 'O', null, null, null, null, null, null], isPlayerTurn: true }),
    },
    {
      user_id: userMap.player2,
      game_id: gameMap['snake'],
      state_data: JSON.stringify({
        boardState: {
          snake: [{ x: 1, y: 1 }],
          direction: 'RIGHT',
          food: { x: 3, y: 3 },
          score: 20,
        },
        isPlayerTurn: true,
      }),
    },
    {
      user_id: userMap.player3,
      game_id: gameMap['match-3'],
      state_data: JSON.stringify({
        boardState: {
          board: ['🔴', '🟡', '🟢', '🔵'],
          score: 30,
        },
        isPlayerTurn: true,
      }),
    },
    {
      user_id: userMap.player4,
      game_id: gameMap['memory'],
      state_data: JSON.stringify({
        boardState: [],
        moves: 4,
        isPlayerTurn: true,
      }),
    },
    {
      user_id: userMap.player4,
      game_id: gameMap['free-draw'],
      state_data: JSON.stringify({
        boardState: {
          imageDataUrl: '',
          color: '#000000',
          brushSize: 5,
        },
        isPlayerTurn: true,
      }),
    },
  ]);
};