const knex = require('knex');
const knexConfig = require('../knexfile');
const db = knex(knexConfig.development);

exports.getRankingByGame = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { slug } = req.params;
    const scope = req.query.scope || 'global';
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const offset = (page - 1) * limit;

    const game = await db('games').where({ slug }).first();
    if (!game) return res.status(404).json({ message: 'Không tìm thấy game' });

    let query = db('game_scores as gs')
      .join('users as u', 'gs.user_id', 'u.id')
      .where('gs.game_id', game.id)
      .select('gs.id', 'gs.score', 'gs.play_time_seconds', 'gs.created_at', 'u.id as user_id', 'u.username', 'u.full_name')
      .orderBy('gs.score', 'desc')
      .orderBy('gs.play_time_seconds', 'asc');

    if (scope === 'me') {
      query = query.andWhere('u.id', userId);
    }

    if (scope === 'friends') {
      const friendRows = await db('friends')
        .where('user_one_id', userId)
        .orWhere('user_two_id', userId);

      const friendIds = friendRows.map((r) =>
        Number(r.user_one_id) === Number(userId) ? r.user_two_id : r.user_one_id
      );

      query = query.whereIn('u.id', friendIds.length ? friendIds : [-1]);
    }

    const data = await query.limit(limit).offset(offset);
    res.json({ data, page, limit, scope, slug });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi lấy bảng xếp hạng' });
  }
};