//
//  OrderStats.swift
//  AdminDashboard
//
//  Created by khoa on 21/3/26.
//

import Foundation

// Struct này dùng để hứng tổng số đơn hàng từ Backend trả về
struct OrderStats: Codable {
    let totalOrders: Int
    // Bạn có thể thêm các trường khác nếu API của bạn có trả về (ví dụ: totalPending, totalCanceled...)
}
