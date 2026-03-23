//
//  Product.swift
//  AdminDashboard
//
//  Created by NHDkhoa on 16/3/26.
//

import Foundation

struct Product: Codable {
    let id: Int
    let name: String
    let price: String
    let sku: String
    let realStock: Int
    let catName: String
    let brandName: String

    enum CodingKeys: String, CodingKey {
        case id = "pro_id"
        case name = "pro_name"
        case price = "pro_price"
        case sku = "pro_sku"
        case realStock = "real_stock"
        case catName = "cat_name"
        case brandName = "brand_name"
    }
    
    // THÊM: Dành cho việc cập nhật thông tin bằng tay (ở màn hình Edit)
    init(id: Int, name: String, price: String, sku: String, realStock: Int, catName: String, brandName: String) {
        self.id = id
        self.name = name
        self.price = price
        self.sku = sku
        self.realStock = realStock
        self.catName = catName
        self.brandName = brandName
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        
        id = try container.decodeIfPresent(Int.self, forKey: .id) ?? 0
        name = try container.decodeIfPresent(String.self, forKey: .name) ?? "Sản phẩm chưa có tên"
        price = try container.decodeIfPresent(String.self, forKey: .price) ?? "0"
        sku = try container.decodeIfPresent(String.self, forKey: .sku) ?? "Đang cập nhật"
        realStock = try container.decodeIfPresent(Int.self, forKey: .realStock) ?? 0
        catName = try container.decodeIfPresent(String.self, forKey: .catName) ?? "Chưa phân loại"
        brandName = try container.decodeIfPresent(String.self, forKey: .brandName) ?? "Chưa rõ"
    }

    var formattedPrice: String {
        let amount = Double(price) ?? 0.0
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencySymbol = "₫"
        formatter.maximumFractionDigits = 0
        return formatter.string(from: NSNumber(value: amount)) ?? "\(price)₫"
    }
}
