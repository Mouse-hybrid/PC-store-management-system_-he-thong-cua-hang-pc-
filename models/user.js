import db from '../db/db.js';

class User {
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
    }
    return query.first();
  }

  static async create(userData) {
    return db('users').insert(userData);
  }
}

export default User;