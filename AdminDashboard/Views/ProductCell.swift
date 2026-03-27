//
//  ProductCell.swift
//  AdminDashboard
//
//  Created by khoa on 21/3/26.
//
import UIKit
import SnapKit

class ProductCell: UITableViewCell {
    private let container = UIView()
    private let nameLabel = UILabel()
    private let priceLabel = UILabel()
    private let skuLabel = UILabel()
    
    // KHÔNG GỘP CHUNG VÀO SKU NỮA
    let stockLabel = UILabel()

    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        selectionStyle = .none
        backgroundColor = .clear
        
        container.backgroundColor = AppColors.surfaceCard
        container.layer.cornerRadius = 12
        contentView.addSubview(container)
        container.snp.makeConstraints { $0.edges.equalToSuperview().inset(UIEdgeInsets(top: 8, left: 15, bottom: 8, right: 15)) }
        
        nameLabel.font = .systemFont(ofSize: 16, weight: .bold)
        nameLabel.textColor = AppColors.textMain
        
        priceLabel.font = .systemFont(ofSize: 16, weight: .bold)
        priceLabel.textColor = AppColors.primaryNeon
        
        skuLabel.font = .systemFont(ofSize: 12)
        skuLabel.textColor = AppColors.textSec
        
        // 2. THÊM STOCK LABEL VÀO GIAO DIỆN
        container.addSubview(nameLabel)
        container.addSubview(priceLabel)
        container.addSubview(skuLabel)
        container.addSubview(stockLabel)
        
        nameLabel.snp.makeConstraints { make in
            make.top.leading.equalToSuperview().offset(15)
            make.trailing.equalTo(priceLabel.snp.leading).offset(-10)
        }
        
        priceLabel.snp.makeConstraints { make in
            make.top.equalToSuperview().offset(15)
            make.trailing.equalToSuperview().offset(-15)
        }
        
        skuLabel.snp.makeConstraints { make in
            make.top.equalTo(nameLabel.snp.bottom).offset(5)
            make.leading.equalTo(nameLabel)
            make.bottom.equalToSuperview().offset(-15)
        }
        
        // 3. ĐẶT VỊ TRÍ STOCK NẰM BÊN GÓC PHẢI DƯỚI (DƯỚI GIÁ TIỀN)
        stockLabel.snp.makeConstraints { make in
            make.centerY.equalTo(skuLabel)
            make.trailing.equalToSuperview().offset(-15)
        }
    }

    func configure(with product: Product) {
        nameLabel.text = product.name
        priceLabel.text = product.formattedPrice
        // Gỡ bỏ chữ Stock ở dòng này vì đã được InventoryViewController tự động vẽ riêng
        skuLabel.text = "SKU: \(product.sku) | \(product.catName)"
    }
    
    required init?(coder: NSCoder) { fatalError() }
}
