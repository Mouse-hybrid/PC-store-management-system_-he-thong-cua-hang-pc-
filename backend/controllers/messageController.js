const knex = require('knex');
const knexConfig = require('../knexfile');
const db = knex(knexConfig.development);

exports.getConversation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const friendId = Number(req.params.friendId);
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const offset = (page - 1) * limit;

    const allRows = await db('messages')
      .where(function () {
        this.where({ sender_id: userId, receiver_id: friendId })
          .orWhere({ sender_id: friendId, receiver_id: userId });
      })
      .orderBy('created_at', 'desc');

    const pageRows = allRows.slice(offset, offset + limit).reverse();

    res.json({
      data: pageRows,
      page,
      limit,
      total: allRows.length,
      totalPages: Math.max(1, Math.ceil(allRows.length / limit)),
      hasNext: offset + limit < allRows.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi lấy hội thoại' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const sender_id = req.user.userId;
    const { receiver_id, content } = req.body;

    if (!receiver_id || !content?.trim()) {
      return res.status(400).json({ message: 'Thiếu receiver_id hoặc nội dung' });
    }

    const [a, b] = [Number(sender_id), Number(receiver_id)].sort((x, y) => x - y);

    const friendship = await db('friends')
      .where({ user_one_id: a, user_two_id: b })
      .first();

    if (!friendship) {
      return res.status(403).json({ message: 'Chỉ có thể nhắn tin cho bạn bè' });
    }

    const [row] = await db('messages')
      .insert({
        sender_id,
        receiver_id,
        content: content.trim(),
      })
      .returning('*');

    res.status(201).json({
      message: 'Gửi tin nhắn thành công',
      data: row,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi gửi tin nhắn' });
  }
};