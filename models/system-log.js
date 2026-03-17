import db from '../db/db.js';

class SystemLog {
  static async getAll(limit = 100) {
    return db('system_logs').orderBy('created_at', 'desc').limit(limit); //
  }
}
export default SystemLog;