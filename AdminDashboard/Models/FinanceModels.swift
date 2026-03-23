//
//  FinanceModels.swift
//  AdminDashboard
//
//  Created by khoa on 22/3/26.
//

import Foundation

struct FinanceData: Codable {
    let totalRevenue: Double
    let totalPending: Double
    let totalRefunds: Double
}

struct FinanceResponse: Codable {
    let status: String
    let data: FinanceData
}

struct Transaction: Codable {
    let order_id: Int
    let final_amount: String
    let status: String
    let created_at: String
    let guest_name: String?
}

struct TransactionResponse: Codable {
    let status: String
    let data: [Transaction]
}
