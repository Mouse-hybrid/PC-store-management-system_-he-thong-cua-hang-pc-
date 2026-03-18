import db from '../db/db.js';

class Staff {
<<<<<<< HEAD
  // Tìm hồ sơ nhân viên theo user_id
  static async getProfile(userId) {
    return db('staff_profiles').where('user_id', userId).first(); 
  }

  // Cập nhật lương
  static async updateSalary(userId, salary) {
    return db('staff_profiles').where('user_id', userId).update({ salary }); 
  }
}

=======
  static async getProfile(userId) {
    return db('staff').where('user_id', userId).first(); //
  }

  static async updateSalary(userId, salary) {
    return db('staff').where('user_id', userId).update({ salary }); //
  }
}
>>>>>>> f42558b2c199dd3e958fcd5af79d3c8e84e58a21
export default Staff;