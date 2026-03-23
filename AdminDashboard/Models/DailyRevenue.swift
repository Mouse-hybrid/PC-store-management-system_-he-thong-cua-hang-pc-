//
//  DailyRevenue.swift
//  AdminDashboard
//
//  Created by khoa on 21/3/26.
//

import Foundation

struct DailyRevenue: Codable {
    let date: String
    let totalOrders: Int
    let revenue: String // Nhận vào dạng String để không bị lỗi Decoding
    
    // Mapping giữa tên biến trong Node.js (snake_case) và Swift (camelCase)
    enum CodingKeys: String, CodingKey {
        case date
        case totalOrders = "total_orders"
        case revenue
    }
    
    // Biến phụ để tự chuyển String sang Double cho dễ tính toán
    var totalRevenue: Double {
        return Double(revenue) ?? 0.0
    }
}
