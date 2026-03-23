//
//  FinanceViewController.swift
//  AdminDashboard
//
//  Created by khoa on 22/3/26.
//

import UIKit
import SnapKit

class FinanceViewController: UIViewController {

    private let scrollView = UIScrollView()
    private let contentView = UIView()
    private let txStackView = UIStackView() // Nơi chứa danh sách giao dịch
    
    // Các Label hiển thị số tiền
    private let revenueLbl = UILabel()
    private let pendingLbl = UILabel()
    private let canceledLbl = UILabel() // Đổi từ Refund sang Canceled
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = AppColors.bgMain
        setupUI()
        loadFinanceData()
    }
    
    private func loadFinanceData() {
        // 1. Load Tổng quan
        APIManager.shared.fetchFinanceOverview { [weak self] result in
            DispatchQueue.main.async {
                if case .success(let data) = result {
                    self?.revenueLbl.text = self?.formatMoney(data.totalRevenue)
                    self?.pendingLbl.text = self?.formatMoney(data.totalPending)
                    self?.canceledLbl.text = self?.formatMoney(data.totalRefunds)
                }
            }
        }
        
        // 2. Load Giao dịch gần nhất
        APIManager.shared.fetchRecentTransactions { [weak self] result in
            DispatchQueue.main.async {
                if case .success(let transactions) = result {
                    self?.populateTransactions(transactions)
                }
            }
        }
    }
    
    private func formatMoney(_ value: Double) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencySymbol = "₫"
        formatter.maximumFractionDigits = 0
        return formatter.string(from: NSNumber(value: value)) ?? "0₫"
    }
    
    // MARK: - UI Setup
    private func setupUI() {
        let header = setupHeader()
        
        view.addSubview(scrollView)
        scrollView.addSubview(contentView)
        
        scrollView.snp.makeConstraints { make in
            make.top.equalTo(header.snp.bottom)
            make.leading.trailing.bottom.equalToSuperview()
        }
        contentView.snp.makeConstraints { make in
            make.edges.equalToSuperview()
            make.width.equalTo(scrollView)
        }
        
        // 1. Khối Tổng Quan (Overview Cards)
        let overviewSection = createOverviewSection()
        
        // 2. Khối Cổng Thanh Toán (Payment Gateways)
        let gatewaysSection = createGatewaysSection()
        
        // 3. Khối Giao Dịch (Recent Transactions)
        let txSection = createTransactionsSection()
        
        contentView.addSubview(overviewSection)
        contentView.addSubview(gatewaysSection)
        contentView.addSubview(txSection)
        
        overviewSection.snp.makeConstraints { make in
            make.top.equalToSuperview().offset(20)
            make.leading.trailing.equalToSuperview().inset(16)
        }
        
        gatewaysSection.snp.makeConstraints { make in
            make.top.equalTo(overviewSection.snp.bottom).offset(30)
            make.leading.trailing.equalToSuperview().inset(16)
        }
        
        txSection.snp.makeConstraints { make in
            make.top.equalTo(gatewaysSection.snp.bottom).offset(30)
            make.leading.trailing.equalToSuperview().inset(16)
            make.bottom.equalToSuperview().offset(-40) // Chốt đáy
        }
    }
    
    private func setupHeader() -> UIView {
        let header = UIView()
        view.addSubview(header)
        header.snp.makeConstraints { make in
            make.top.equalTo(view.safeAreaLayoutGuide)
            make.leading.trailing.equalToSuperview()
            make.height.equalTo(60)
        }
        
        let backBtn = UIButton(type: .system)
        backBtn.setImage(UIImage(systemName: "arrow.left"), for: .normal)
        backBtn.tintColor = AppColors.textMain
        backBtn.addTarget(self, action: #selector(handleBack), for: .touchUpInside)
        
        let titleLbl = UILabel()
        titleLbl.text = "Finance & Payment"
        titleLbl.font = .systemFont(ofSize: 18, weight: .bold)
        titleLbl.textColor = AppColors.textMain
        
        header.addSubview(backBtn)
        header.addSubview(titleLbl)
        
        backBtn.snp.makeConstraints { $0.leading.equalToSuperview().offset(15); $0.centerY.equalToSuperview() }
        titleLbl.snp.makeConstraints { $0.center.equalToSuperview() }
        return header
    }
    
    private func createOverviewSection() -> UIView {
        let container = UIView()
        
        // Card bự: Total Revenue
        let revCard = UIView()
        revCard.backgroundColor = AppColors.surfaceCard
        revCard.layer.cornerRadius = 16
        revCard.layer.borderWidth = 1
        revCard.layer.borderColor = AppColors.textSec.withAlphaComponent(0.2).cgColor
        
        let revTitle = UILabel(); revTitle.text = "TOTAL REVENUE"; revTitle.font = .systemFont(ofSize: 12, weight: .bold); revTitle.textColor = AppColors.textSec
        revenueLbl.font = .systemFont(ofSize: 32, weight: .bold); revenueLbl.textColor = AppColors.primaryNeon; revenueLbl.text = "0₫"
        
        revCard.addSubview(revTitle); revCard.addSubview(revenueLbl)
        revTitle.snp.makeConstraints { $0.top.leading.equalToSuperview().offset(20) }
        revenueLbl.snp.makeConstraints { $0.top.equalTo(revTitle.snp.bottom).offset(10); $0.leading.equalToSuperview().offset(20); $0.bottom.equalToSuperview().offset(-20) }
        
        // Stack ngang chứa Pending và Canceled
        let subStack = UIStackView()
        subStack.axis = .horizontal
        subStack.spacing = 15
        subStack.distribution = .fillEqually
        
        let pendingCard = createSmallCard(title: "PENDING", valueLabel: pendingLbl, color: .systemOrange)
        let canceledCard = createSmallCard(title: "CANCELED", valueLabel: canceledLbl, color: .systemRed)
        
        subStack.addArrangedSubview(pendingCard)
        subStack.addArrangedSubview(canceledCard)
        
        container.addSubview(revCard)
        container.addSubview(subStack)
        
        revCard.snp.makeConstraints { $0.top.leading.trailing.equalToSuperview() }
        subStack.snp.makeConstraints { $0.top.equalTo(revCard.snp.bottom).offset(15); $0.leading.trailing.bottom.equalToSuperview(); $0.height.equalTo(90) }
        
        return container
    }
    
    private func createSmallCard(title: String, valueLabel: UILabel, color: UIColor) -> UIView {
        let card = UIView()
        card.backgroundColor = AppColors.surfaceCard
        card.layer.cornerRadius = 12
        card.layer.borderWidth = 1
        card.layer.borderColor = AppColors.textSec.withAlphaComponent(0.2).cgColor
        
        let tLbl = UILabel(); tLbl.text = title; tLbl.font = .systemFont(ofSize: 12, weight: .bold); tLbl.textColor = AppColors.textSec
        valueLabel.font = .systemFont(ofSize: 20, weight: .bold); valueLabel.textColor = color; valueLabel.text = "0₫"
        
        card.addSubview(tLbl); card.addSubview(valueLabel)
        tLbl.snp.makeConstraints { $0.top.leading.equalToSuperview().offset(15) }
        valueLabel.snp.makeConstraints { $0.top.equalTo(tLbl.snp.bottom).offset(8); $0.leading.equalToSuperview().offset(15) }
        return card
    }
    
    private func createGatewaysSection() -> UIView {
        let container = UIView()
        let title = UILabel(); title.text = "Active Payment Methods"; title.font = .systemFont(ofSize: 18, weight: .bold); title.textColor = AppColors.textMain
        
        let stack = UIStackView()
        stack.axis = .vertical
        stack.spacing = 10
        
        stack.addArrangedSubview(createGatewayRow(name: "Banks", desc: "Credit & Debit", icon: "creditcard.fill", color: .systemIndigo, isOn: true))
        stack.addArrangedSubview(createGatewayRow(name: "PayPal", desc: "Express Checkout", icon: "p.circle.fill", color: .systemBlue, isOn: true))
        stack.addArrangedSubview(createGatewayRow(name: "MoMo", desc: "E-Wallet VN", icon: "qrcode.viewfinder", color: .systemPink, isOn: true))
        
        container.addSubview(title); container.addSubview(stack)
        title.snp.makeConstraints { $0.top.leading.equalToSuperview() }
        stack.snp.makeConstraints { $0.top.equalTo(title.snp.bottom).offset(15); $0.leading.trailing.bottom.equalToSuperview() }
        
        return container
    }
    
    private func createGatewayRow(name: String, desc: String, icon: String, color: UIColor, isOn: Bool) -> UIView {
        let row = UIView()
        row.backgroundColor = AppColors.surfaceCard
        row.layer.cornerRadius = 12
        
        let iconView = UIImageView(image: UIImage(systemName: icon)); iconView.tintColor = color
        let nLbl = UILabel(); nLbl.text = name; nLbl.font = .systemFont(ofSize: 16, weight: .bold); nLbl.textColor = AppColors.textMain
        let dLbl = UILabel(); dLbl.text = desc; dLbl.font = .systemFont(ofSize: 12); dLbl.textColor = AppColors.textSec
        let toggle = UISwitch(); toggle.isOn = isOn; toggle.onTintColor = AppColors.primaryNeon
        
        row.addSubview(iconView); row.addSubview(nLbl); row.addSubview(dLbl); row.addSubview(toggle)
        
        iconView.snp.makeConstraints { $0.leading.equalToSuperview().offset(15); $0.centerY.equalToSuperview(); $0.size.equalTo(30) }
        nLbl.snp.makeConstraints { $0.top.equalToSuperview().offset(15); $0.leading.equalTo(iconView.snp.trailing).offset(15) }
        dLbl.snp.makeConstraints { $0.top.equalTo(nLbl.snp.bottom).offset(2); $0.leading.equalTo(nLbl); $0.bottom.equalToSuperview().offset(-15) }
        toggle.snp.makeConstraints { $0.trailing.equalToSuperview().offset(-15); $0.centerY.equalToSuperview() }
        return row
    }
    
    private func createTransactionsSection() -> UIView {
        let container = UIView()
        let title = UILabel(); title.text = "Recent Transactions"; title.font = .systemFont(ofSize: 18, weight: .bold); title.textColor = AppColors.textMain
        
        txStackView.axis = .vertical
        txStackView.spacing = 10
        
        container.addSubview(title); container.addSubview(txStackView)
        title.snp.makeConstraints { $0.top.leading.equalToSuperview() }
        txStackView.snp.makeConstraints { $0.top.equalTo(title.snp.bottom).offset(15); $0.leading.trailing.bottom.equalToSuperview() }
        
        return container
    }
    
    private func populateTransactions(_ transactions: [Transaction]) {
        txStackView.arrangedSubviews.forEach { $0.removeFromSuperview() }
        
        for tx in transactions {
            let row = UIView()
            row.backgroundColor = AppColors.surfaceCard
            row.layer.cornerRadius = 12
            row.layer.borderWidth = 1
            row.layer.borderColor = AppColors.textSec.withAlphaComponent(0.2).cgColor
            
            let isPositive = tx.status != "CANCELLED" && tx.status != "REFUNDED"
            let iconName = isPositive ? "arrow.down.left.circle.fill" : "arrow.up.right.circle.fill"
            let color = isPositive ? UIColor.systemGreen : UIColor.systemRed
            
            let iconView = UIImageView(image: UIImage(systemName: iconName)); iconView.tintColor = color
            let nLbl = UILabel(); nLbl.text = "Order #\(tx.order_id)"; nLbl.font = .systemFont(ofSize: 14, weight: .bold); nLbl.textColor = AppColors.textMain
            let dLbl = UILabel(); dLbl.text = tx.guest_name ?? "Guest"; dLbl.font = .systemFont(ofSize: 12); dLbl.textColor = AppColors.textSec
            
            let valLbl = UILabel()
            let amountDouble = Double(tx.final_amount) ?? 0.0
            valLbl.text = (isPositive ? "+" : "-") + formatMoney(amountDouble)
            valLbl.font = .systemFont(ofSize: 14, weight: .bold)
            valLbl.textColor = color
            
            row.addSubview(iconView); row.addSubview(nLbl); row.addSubview(dLbl); row.addSubview(valLbl)
            
            iconView.snp.makeConstraints { $0.leading.equalToSuperview().offset(15); $0.centerY.equalToSuperview(); $0.size.equalTo(30) }
            nLbl.snp.makeConstraints { $0.top.equalToSuperview().offset(12); $0.leading.equalTo(iconView.snp.trailing).offset(12) }
            dLbl.snp.makeConstraints { $0.top.equalTo(nLbl.snp.bottom).offset(2); $0.leading.equalTo(nLbl); $0.bottom.equalToSuperview().offset(-12) }
            valLbl.snp.makeConstraints { $0.trailing.equalToSuperview().offset(-15); $0.centerY.equalToSuperview() }
            
            txStackView.addArrangedSubview(row)
        }
    }
    
    @objc private func handleBack() { navigationController?.popViewController(animated: true) }
}
