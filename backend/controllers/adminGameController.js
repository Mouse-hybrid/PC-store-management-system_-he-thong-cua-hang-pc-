const knex = require('knex');
const knexConfig = require('../knexfile');
const db = knex(knexConfig.development);

exports.getAllGames = async (req, res) => {
  try {
    const data = await db('games').select('*').orderBy('id', 'asc');
    res.json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi lấy danh sách game' });
  }
};

exports.updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, instructions, board_size, is_active } = req.body;

    const payload = {
      updated_at: db.fn.now(),
    };

    if (name !== undefined) payload.name = name;
    if (instructions !== undefined) payload.instructions = instructions;
    if (board_size !== undefined) payload.board_size = JSON.stringify(board_size);
    if (is_active !== undefined) payload.is_active = is_active;

    await db('games').where({ id }).update(payload);
    res.json({ message: 'Cập nhật game thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi cập nhật game' });
  }
};