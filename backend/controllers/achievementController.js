const knex = require('knex');
const knexConfig = require('../knexfile');
const db = knex(knexConfig.development);

exports.getMyAchievements = async (req, res) => {
  try {
    const userId = req.user.userId;

    const all = await db('achievements').select('*');

    const unlocked = await db('user_achievements as ua')
      .join('achievements as a', 'ua.achievement_id', 'a.id')
      .where('ua.user_id', userId)
      .select('a.slug');

    const unlockedSet = new Set(unlocked.map((x) => x.slug));

    const data = all.map((item) => ({
      ...item,
      unlocked: unlockedSet.has(item.slug),
    }));

    res.json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi lấy thành tựu' });
  }
};

exports.unlockAchievement = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { slug } = req.params;

    const achievement = await db('achievements').where({ slug }).first();
    if (!achievement) return res.status(404).json({ message: 'Không tìm thấy thành tựu' });

    const existed = await db('user_achievements')
      .where({ user_id: userId, achievement_id: achievement.id })
      .first();

    if (!existed) {
      await db('user_achievements').insert({
        user_id: userId,
        achievement_id: achievement.id,
      });
    }

    res.json({ message: 'Đã mở khóa thành tựu' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi mở khóa thành tựu' });
  }
};