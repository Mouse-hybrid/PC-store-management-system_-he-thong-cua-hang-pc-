import db from '../db/db.js';

class Payment {
  static async getById(paymentId) {
    return db('payments').where('id', paymentId).first();
  }

  static async updateStatus(paymentId, status, transactionCode = null) {
    return db('payments').where('id', paymentId).update({
      status,
      transaction_code: transactionCode 
    }); //
  }
}
export default Payment;