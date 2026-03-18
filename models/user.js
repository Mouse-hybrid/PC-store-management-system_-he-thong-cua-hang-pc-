import db from '../db/db.js';

class User {
<<<<<<< HEAD
  static async findById(id) {
    return db('users').where({ user_id: id }).first(); 
  }

  static async findByUsername(username) {
    return db('users').where({ username }).first();
  }

  static async getProfile(userId, role) {
    const query = db('users').where('users.user_id', userId);
    if (role === 'MEMBER') {
      return query.leftJoin('customer_profiles', 'users.user_id', 'customer_profiles.user_id').first();
    } else if (role === 'STAFF' || role === 'ADMIN') {
      return query.leftJoin('staff_profiles', 'users.user_id', 'staff_profiles.user_id').first();
=======
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
>>>>>>> f42558b2c199dd3e958fcd5af79d3c8e84e58a21
    }
    return query.first();
  }

  static async create(userData) {
<<<<<<< HEAD
    return db('users').insert(userData);
=======
    return db('users').insert(userData); // userData chứa password_hash
>>>>>>> f42558b2c199dd3e958fcd5af79d3c8e84e58a21
  }
}

export default User;