const knex = require('knex');
const knexConfig = require('../knexfile');
const db = knex(knexConfig.development);

exports.listFriends = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);

    const rows = await db('friends')
      .leftJoin('users as u1', 'friends.user_one_id', 'u1.id')
      .leftJoin('users as u2', 'friends.user_two_id', 'u2.id')
      .where('friends.user_one_id', userId)
      .orWhere('friends.user_two_id', userId)
      .select(
        'friends.id',
        'u1.id as u1_id', 'u1.username as u1_username', 'u1.full_name as u1_full_name', 'u1.avatar_url as u1_avatar',
        'u2.id as u2_id', 'u2.username as u2_username', 'u2.full_name as u2_full_name', 'u2.avatar_url as u2_avatar'
      );

    const mapped = rows.map((row) => {
      const isUserOne = Number(row.u1_id) === Number(userId);
      return {
        friendship_id: row.id,
        id: isUserOne ? row.u2_id : row.u1_id,
        username: isUserOne ? row.u2_username : row.u1_username,
        full_name: isUserOne ? row.u2_full_name : row.u1_full_name,
        avatar_url: isUserOne ? row.u2_avatar : row.u1_avatar,
      };
    });

    const start = (page - 1) * limit;
    const data = mapped.slice(start, start + limit);

    res.json({
      data,
      page,
      limit,
      total: mapped.length,
      totalPages: Math.max(1, Math.ceil(mapped.length / limit)),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi lấy danh sách bạn bè' });
  }
};

exports.listRequests = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);

    const incomingAll = await db('friend_requests as fr')
      .join('users as u', 'fr.sender_id', 'u.id')
      .where({ receiver_id: userId, status: 'pending' })
      .select('fr.id', 'u.id as user_id', 'u.username', 'u.full_name', 'u.avatar_url', 'fr.created_at');

    const outgoingAll = await db('friend_requests as fr')
      .join('users as u', 'fr.receiver_id', 'u.id')
      .where({ sender_id: userId, status: 'pending' })
      .select('fr.id', 'u.id as user_id', 'u.username', 'u.full_name', 'u.avatar_url', 'fr.created_at');

    const start = (page - 1) * limit;

    res.json({
      incoming: incomingAll.slice(start, start + limit),
      outgoing: outgoingAll.slice(start, start + limit),
      page,
      limit,
      incomingTotal: incomingAll.length,
      outgoingTotal: outgoingAll.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi lấy lời mời kết bạn' });
  }
};

exports.sendRequest = async (req, res) => {
  try {
    const sender_id = req.user.userId;
    const { receiver_id } = req.body;

    if (!receiver_id || Number(receiver_id) === Number(sender_id)) {
      return res.status(400).json({ message: 'receiver_id không hợp lệ' });
    }

    const [a, b] = [Number(sender_id), Number(receiver_id)].sort((x, y) => x - y);

    const existingFriend = await db('friends')
      .where({ user_one_id: a, user_two_id: b })
      .first();

    if (existingFriend) {
      return res.status(400).json({ message: 'Hai người đã là bạn bè' });
    }

    const existed = await db('friend_requests')
      .where(function () {
        this.where({ sender_id, receiver_id }).orWhere({ sender_id: receiver_id, receiver_id: sender_id });
      })
      .where('status', 'pending')
      .first();

    if (existed) {
      return res.status(400).json({ message: 'Lời mời đã tồn tại' });
    }

    await db('friend_requests').insert({ sender_id, receiver_id });
    res.status(201).json({ message: 'Đã gửi lời mời kết bạn' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi gửi lời mời kết bạn' });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const request = await db('friend_requests')
      .where({ id, receiver_id: userId, status: 'pending' })
      .first();

    if (!request) {
      return res.status(404).json({ message: 'Không tìm thấy lời mời' });
    }

    await db('friend_requests')
      .where({ id })
      .update({ status: 'accepted', updated_at: db.fn.now() });

    const [a, b] = [request.sender_id, request.receiver_id].sort((x, y) => x - y);
    await db('friends').insert({ user_one_id: a, user_two_id: b });

    res.json({ message: 'Đã chấp nhận kết bạn' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi chấp nhận kết bạn' });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const request = await db('friend_requests')
      .where({ id, receiver_id: userId, status: 'pending' })
      .first();

    if (!request) {
      return res.status(404).json({ message: 'Không tìm thấy lời mời' });
    }

    await db('friend_requests')
      .where({ id })
      .update({ status: 'rejected', updated_at: db.fn.now() });

    res.json({ message: 'Đã từ chối lời mời' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi từ chối lời mời' });
  }
};

exports.unfriend = async (req, res) => {
  try {
    const userId = req.user.userId;
    const friendId = Number(req.params.friendId);

    const [a, b] = [userId, friendId].sort((x, y) => x - y);
    await db('friends').where({ user_one_id: a, user_two_id: b }).del();

    res.json({ message: 'Đã hủy kết bạn' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi hủy kết bạn' });
  }
};