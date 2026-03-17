import db from '../db/db.js';

class Staff {
  static async getProfile(userId) {
    return db('staff').where('user_id', userId).first(); //
  }

  static async updateSalary(userId, salary) {
    return db('staff').where('user_id', userId).update({ salary }); //
  }
}
export default Staff;