import db from '../db/db.js';

class User {
  // Tìm kiếm người dùng theo Username (Dùng cho Login)
  static async findByUsername(username) {
    return db('users').where({ username }).first(); // Trả về user_id, password_hash, role...
  }

  // Lấy Profile đầy đủ (Join tùy theo Role)
  static async getProfile(userId, role) {
    const query = db('users').where('users.user_id', userId);
    
    if (role === 'MEMBER') {
      return query.leftJoin('customers', 'users.user_id', 'customers.user_id').first();
    } else if (role === 'STAFF' || role === 'ADMIN') {
      return query.leftJoin('staff', 'users.user_id', 'staff.user_id').first();
    }
    return query.first();
  }

  static async create(userData) {
    return db('users').insert(userData); // userData chứa password_hash
  }
}

export default User;