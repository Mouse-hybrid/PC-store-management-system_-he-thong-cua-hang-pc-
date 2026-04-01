<<<<<<< HEAD
=======
// --- BẢN CHUẨN CHO gameController.js ---
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4
const knex = require('knex');
const knexConfig = require('../knexfile');
const db = knex(knexConfig.development);

<<<<<<< HEAD
// =========================
// Save game
// =========================
exports.saveGame = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { gameSlug, ...statePayload } = req.body;

    if (!gameSlug) {
      return res.status(400).json({ message: 'Thiếu gameSlug!' });
    }

    const game = await db('games').where({ slug: gameSlug }).first();
    if (!game) {
      return res.status(404).json({ message: 'Không tìm thấy game!' });
    }

    // Lưu toàn bộ state frontend gửi lên để hỗ trợ mọi game
    const stateData = JSON.stringify(statePayload);

    const existingSave = await db('game_saves')
      .where({ user_id: userId, game_id: game.id })
      .first();

    if (existingSave) {
      await db('game_saves')
        .where({ id: existingSave.id })
        .update({
          state_data: stateData,
          updated_at: db.fn.now(),
        });
    } else {
      await db('game_saves').insert({
        user_id: userId,
        game_id: game.id,
        state_data: stateData,
=======
// Thay thế hàm saveGame trong gameController.js
exports.saveGame = async (req, res) => {
  try {
    const userId = req.user.userId; 
    const { gameSlug, boardState, isPlayerTurn } = req.body;

    const game = await db('games').where({ slug: gameSlug }).first();
    if (!game) return res.status(404).json({ message: 'Không tìm thấy game!' });

    // ✅ CHUẨN BACKEND: Ép thành chuỗi JSON để Database nào cũng hiểu được
    const stateData = JSON.stringify({ board: boardState, isPlayerTurn });

    const existingSave = await db('game_saves').where({ user_id: userId, game_id: game.id }).first();

    if (existingSave) {
      await db('game_saves').where({ id: existingSave.id }).update({ 
        state_data: stateData, 
        updated_at: db.fn.now() 
      });
    } else {
      await db('game_saves').insert({ 
        user_id: userId, 
        game_id: game.id, 
        state_data: stateData 
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4
      });
    }

    res.status(200).json({ message: 'Đã lưu game thành công!' });
  } catch (error) {
<<<<<<< HEAD
    console.error('🚨 Lỗi Save Game (Chi tiết):', error);
=======
    // In lỗi chi tiết ra Terminal để dễ bắt bệnh nếu có
    console.error("🚨 Lỗi Save Game (Chi tiết):", error.message);
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4
    res.status(500).json({ message: 'Lỗi server khi lưu game' });
  }
};

<<<<<<< HEAD
// =========================
// Load game
// =========================
=======
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4
exports.loadGame = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { slug } = req.params;

    const game = await db('games').where({ slug }).first();
<<<<<<< HEAD
    if (!game) {
      return res.status(404).json({ message: 'Game không tồn tại!' });
    }

    const savedGame = await db('game_saves')
      .where({ user_id: userId, game_id: game.id })
      .first();
=======
    if (!game) return res.status(404).json({ message: 'Game không tồn tại!' });

    const savedGame = await db('game_saves').where({ user_id: userId, game_id: game.id }).first();
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4

    if (!savedGame) {
      return res.status(404).json({ message: 'Bạn chưa có file lưu cho trò này!' });
    }

<<<<<<< HEAD
    let parsedState = savedGame.state_data;

    // Nếu DB trả string thì parse
    if (typeof parsedState === 'string') {
      try {
        parsedState = JSON.parse(parsedState);
      } catch (e) {
        console.error('Lỗi parse state_data:', e);
      }
    }

    res.status(200).json({
      message: 'Tải game thành công!',
      state_data: parsedState,
    });
  } catch (error) {
    console.error('Lỗi Load Game:', error);
    res.status(500).json({ message: 'Lỗi server khi tải game' });
  }
};

// =========================
// Game help
// =========================
exports.getGameHelp = async (req, res) => {
  try {
    const { slug } = req.params;
    const game = await db('games').where({ slug }).first();

    if (!game) {
      return res.status(404).json({ message: 'Không tìm thấy game' });
    }

    res.json({
      data: {
        slug: game.slug,
        name: game.name,
        instructions: game.instructions || 'Chưa có hướng dẫn cho game này.',
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi lấy hướng dẫn' });
  }
};

// =========================
// Submit score
// =========================
exports.submitScore = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { slug } = req.params;
    const { score, play_time_seconds } = req.body;

    const game = await db('games').where({ slug }).first();
    if (!game) {
      return res.status(404).json({ message: 'Không tìm thấy game' });
    }

    await db('game_scores').insert({
      user_id: userId,
      game_id: game.id,
      score: Number(score || 0),
      play_time_seconds: Number(play_time_seconds || 0),
    });

    res.status(201).json({ message: 'Lưu điểm thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi lưu điểm' });
  }
};

// =========================
// Get reviews
// =========================
exports.getReviews = async (req, res) => {
  try {
    const { slug } = req.params;
    const game = await db('games').where({ slug }).first();

    if (!game) {
      return res.status(404).json({ message: 'Không tìm thấy game' });
    }

    const data = await db('game_reviews as gr')
      .join('users as u', 'gr.user_id', 'u.id')
      .where('gr.game_id', game.id)
      .select(
        'gr.id',
        'gr.rating',
        'gr.comment',
        'gr.created_at',
        'u.username',
        'u.full_name',
        'u.avatar_url'
      )
      .orderBy('gr.created_at', 'desc');

    res.json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi lấy đánh giá' });
  }
};

// =========================
// Add review
// =========================
exports.addReview = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { slug } = req.params;
    const { rating, comment } = req.body;

    const game = await db('games').where({ slug }).first();
    if (!game) {
      return res.status(404).json({ message: 'Không tìm thấy game' });
    }

    const normalizedRating = Number(rating);
    if (Number.isNaN(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) {
      return res.status(400).json({ message: 'Rating phải nằm trong khoảng 1 đến 5.' });
    }

    const [row] = await db('game_reviews')
      .insert({
        user_id: userId,
        game_id: game.id,
        rating: normalizedRating,
        comment: comment || '',
      })
      .returning('*');

    res.status(201).json({
      message: 'Đã gửi đánh giá',
      data: row,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi gửi đánh giá' });
  }
=======
    // Vì DB lưu là jsonb nên state_data lấy ra đã là Object sẵn rồi
    res.status(200).json({ 
      message: 'Tải game thành công!',
      state_data: savedGame.state_data 
    });
  } catch (error) {
    console.error("Lỗi Load Game:", error);
    res.status(500).json({ message: 'Lỗi server khi tải game' });
  }
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4
};