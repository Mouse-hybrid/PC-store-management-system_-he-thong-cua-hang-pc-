//
//  Order.swift
//  AdminDashboard
//
//  Created by khoa on 21/3/26.
//

import Foundation
import UIKit

struct OrderResponse: Codable {
    let data: [Order] // Tùy thuộc vào JSON thực tế, nếu data nằm ở gốc thì không cần struct này (nhung van phai struct)
}

struct Order: Codable {
    let id: Int
    let guestName: String?
    let finalAmount: String
    let status: String
    let createdAt: String

    enum CodingKeys: String, CodingKey {
        case id = "order_id"
        case guestName = "guest_name"
        case finalAmount = "final_amount"
        case status = "status"
        case createdAt = "created_at"
    }

    // Tự động định dạng ngày giờ cho đẹp (VD: 21/03/2026 16:03)
    var formattedDate: String {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        if let date = formatter.date(from: createdAt) {
            let displayFormatter = DateFormatter()
            displayFormatter.dateFormat = "dd/MM/yyyy HH:mm"
            return displayFormatter.string(from: date)
        }
        return createdAt
    }

    // Tự động định dạng tiền tệ
    var formattedTotal: String {
        let amount = Double(finalAmount) ?? 0.0
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencySymbol = "₫"
        formatter.maximumFractionDigits = 0
        return formatter.string(from: NSNumber(value: amount)) ?? "\(finalAmount)₫"
    }
    
    // Tự động sinh màu theo trạng thái đơn hàng
    var statusColor: UIColor {
        switch status.uppercased() {
        case "COMPLETED": return AppColors.success
        case "PENDING": return .systemOrange
        case "CANCELLED", "REFUNDED": return .systemRed
        default: return AppColors.textSec
        }
    }
}
