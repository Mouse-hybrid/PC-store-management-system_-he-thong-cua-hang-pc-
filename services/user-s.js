import User from '../models/user.js';
import db from '../db/db.js';

// Lấy danh sách Member kèm điểm thưởng
export const getMemberList = async () => {
  return await db('users')
    .where('role', 'MEMBER')
    .leftJoin('customer_profiles', 'users.user_id', 'customer_profiles.user_id')
    .select('users.user_id', 'users.username', 'users.email', 'customer_profiles.loyalty_points');
};

// Lấy danh sách Staff kèm lương (Chỉ dành cho ADMIN xem)
export const getStaffList = async () => {
  return await db('users')
    .where('role', 'STAFF')
    .leftJoin('staff_profiles', 'users.user_id', 'staff_profiles.user_id')
    .select('users.user_id', 'users.username', 'users.full_name', 'staff_profiles.salary');
};