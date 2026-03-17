import db from '../db/db.js';

class RefreshToken {
  static async save(userId, token, expiresAt) {
    return db('refresh_tokens').insert({ user_id: userId, token, expires_at: expiresAt });
  }

  static async find(token) {
    return db('refresh_tokens').where({ token }).first();
  }

  static async deleteByUser(userId) {
    return db('refresh_tokens').where('user_id', userId).del();
  }
}
export default RefreshToken;