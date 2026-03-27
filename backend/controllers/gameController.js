// --- BẢN CHUẨN CHO gameController.js ---
const knex = require('knex');
const knexConfig = require('../knexfile');
const db = knex(knexConfig.development);

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
      });
    }

    res.status(200).json({ message: 'Đã lưu game thành công!' });
  } catch (error) {
    // In lỗi chi tiết ra Terminal để dễ bắt bệnh nếu có
    console.error("🚨 Lỗi Save Game (Chi tiết):", error.message);
    res.status(500).json({ message: 'Lỗi server khi lưu game' });
  }
};

exports.loadGame = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { slug } = req.params;

    const game = await db('games').where({ slug }).first();
    if (!game) return res.status(404).json({ message: 'Game không tồn tại!' });

    const savedGame = await db('game_saves').where({ user_id: userId, game_id: game.id }).first();

    if (!savedGame) {
      return res.status(404).json({ message: 'Bạn chưa có file lưu cho trò này!' });
    }

    // Vì DB lưu là jsonb nên state_data lấy ra đã là Object sẵn rồi
    res.status(200).json({ 
      message: 'Tải game thành công!',
      state_data: savedGame.state_data 
    });
  } catch (error) {
    console.error("Lỗi Load Game:", error);
    res.status(500).json({ message: 'Lỗi server khi tải game' });
  }
};