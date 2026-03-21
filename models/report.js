import db from '../db/db.js';

class Report {
  static async getDailyRevenue() {
    return db('v_daily_revenue').select('*').orderBy('date', 'desc');
  }

  // THÊM HÀM NÀY ĐỂ LẤY LOG HỆ THỐNG
  static async getSystemLogs(limit = 50) {
    return db('system_logs')
      .select('*')
      .orderBy('created_at', 'desc')
      .limit(limit);
  }
}
export default Report;