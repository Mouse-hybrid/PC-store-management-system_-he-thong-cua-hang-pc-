import db from '../db/db.js';

class Payment {
  static async updateStatus(paymentId, status, transactionCode = null) {
    return db('payments').where('payment_id', paymentId).update({
      status,
      transaction_code: transactionCode
    }); //
  }
}
export default Payment;