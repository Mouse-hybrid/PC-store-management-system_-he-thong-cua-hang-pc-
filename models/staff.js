import db from '../db/db.js';

class Staff {
  // Tìm hồ sơ nhân viên theo user_id
  static async getProfile(userId) {
    return db('staff_profiles').where('user_id', userId).first(); 
  }

  // Cập nhật lương
  static async updateSalary(userId, salary) {
    return db('staff_profiles').where('user_id', userId).update({ salary }); 
  }
}

export default Staff;