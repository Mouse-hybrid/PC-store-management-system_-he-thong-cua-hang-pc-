import db from '../db/db.js';

class Customer {
  static async getProfile(userId) {
    return db('customers').where('user_id', userId).first(); //
  }

  static async updateLoyalty(userId, points) {
    return db('customers').where('user_id', userId).increment('loyalty_points', points); //
  }
}
export default Customer;