//
//  StaffDashboardViewController.swift
//  AdminDashboard
//
//  Created by Nguyen on 22/3/26.
//

import UIKit
import SnapKit

class StaffDashboardViewController: UIViewController {
    
    private let scrollView = UIScrollView()
    private let contentView = UIView()
    
    // UI Elements
    private let todayRevenueLbl = UILabel()
    private let ordersCountLbl = UILabel()
    private let lowStockCountLbl = UILabel()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = AppColors.bgMain
        navigationController?.setNavigationBarHidden(true, animated: false)
        
        setupUI()
        loadStaffData()
    }
    
    private func loadStaffData() {
        todayRevenueLbl.text = "25.500.000₫"
        ordersCountLbl.text = "12"
        lowStockCountLbl.text = "5"
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
        
        let statsSection = createStatsSection()
        let quickActionsSection = createQuickActionsSection()
        
        contentView.addSubview(statsSection)
        contentView.addSubview(quickActionsSection)
        
        statsSection.snp.makeConstraints { make in
            make.top.equalToSuperview().offset(20)
            make.leading.trailing.equalToSuperview().inset(16)
        }
        
        quickActionsSection.snp.makeConstraints { make in
            make.top.equalTo(statsSection.snp.bottom).offset(30)
            make.leading.trailing.equalToSuperview().inset(16)
            make.bottom.equalToSuperview().offset(-40)
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
        
        let menuBtn = UIButton(type: .system)
        menuBtn.setImage(UIImage(systemName: "line.3.horizontal"), for: .normal)
        menuBtn.tintColor = AppColors.textMain
        menuBtn.addTarget(self, action: #selector(openMenu), for: .touchUpInside)
        
        let titleLbl = UILabel()
        titleLbl.text = "Store Dashboard"
        titleLbl.font = .systemFont(ofSize: 18, weight: .bold)
        titleLbl.textColor = AppColors.textMain
        
        let themeSwitch = UISwitch()
        themeSwitch.onTintColor = AppColors.primaryNeon
        themeSwitch.isOn = self.traitCollection.userInterfaceStyle == .dark
        themeSwitch.addTarget(self, action: #selector(handleThemeChange(_:)), for: .valueChanged)
        
        let logoutBtn = UIButton(type: .system)
        logoutBtn.setImage(UIImage(systemName: "rectangle.portrait.and.arrow.right"), for: .normal)
        logoutBtn.tintColor = .systemRed
        logoutBtn.addTarget(self, action: #selector(handleLogout), for: .touchUpInside)
        
        header.addSubview(menuBtn)
        header.addSubview(titleLbl)
        header.addSubview(themeSwitch)
        header.addSubview(logoutBtn)
        
        menuBtn.snp.makeConstraints { $0.leading.equalToSuperview().offset(16); $0.centerY.equalToSuperview(); $0.size.equalTo(30) }
        titleLbl.snp.makeConstraints { $0.center.equalToSuperview() }
        logoutBtn.snp.makeConstraints { $0.trailing.equalToSuperview().offset(-16); $0.centerY.equalToSuperview(); $0.size.equalTo(30) }
        themeSwitch.snp.makeConstraints { $0.trailing.equalTo(logoutBtn.snp.leading).offset(-15); $0.centerY.equalToSuperview() }
        
        return header
    }
    
    private func createStatsSection() -> UIView {
        let container = UIView()
        
        let revCard = UIView()
        revCard.backgroundColor = AppColors.surfaceCard
        revCard.layer.cornerRadius = 16
        revCard.layer.borderWidth = 1
        revCard.layer.borderColor = AppColors.textSec.withAlphaComponent(0.2).cgColor
        
        let revTitle = UILabel(); revTitle.text = "Today's Revenue"; revTitle.font = .systemFont(ofSize: 14, weight: .medium); revTitle.textColor = AppColors.textSec
        todayRevenueLbl.font = .systemFont(ofSize: 32, weight: .bold)
        todayRevenueLbl.textColor = AppColors.textMain
        
        revCard.addSubview(revTitle); revCard.addSubview(todayRevenueLbl)
        revTitle.snp.makeConstraints { $0.top.leading.equalToSuperview().offset(20) }
        todayRevenueLbl.snp.makeConstraints { $0.top.equalTo(revTitle.snp.bottom).offset(8); $0.leading.equalToSuperview().offset(20); $0.bottom.equalToSuperview().offset(-20) }
        
        let stack = UIStackView()
        stack.axis = .horizontal
        stack.spacing = 15
        stack.distribution = .fillEqually
        
        let ordersCard = createSmallStatCard(title: "Orders", valueLabel: ordersCountLbl, icon: "cart.fill", iconColor: .systemGreen)
        let stockCard = createSmallStatCard(title: "Low Stock", valueLabel: lowStockCountLbl, icon: "exclamationmark.triangle.fill", iconColor: .systemOrange)
        
        stack.addArrangedSubview(ordersCard)
        stack.addArrangedSubview(stockCard)
        
        container.addSubview(revCard)
        container.addSubview(stack)
        
        revCard.snp.makeConstraints { $0.top.leading.trailing.equalToSuperview() }
        stack.snp.makeConstraints { $0.top.equalTo(revCard.snp.bottom).offset(15); $0.leading.trailing.bottom.equalToSuperview(); $0.height.equalTo(100) }
        
        return container
    }
    
    private func createSmallStatCard(title: String, valueLabel: UILabel, icon: String, iconColor: UIColor) -> UIView {
        let card = UIView()
        card.backgroundColor = AppColors.surfaceCard
        card.layer.cornerRadius = 16
        card.layer.borderWidth = 1
        card.layer.borderColor = AppColors.textSec.withAlphaComponent(0.2).cgColor
        
        let iconView = UIImageView(image: UIImage(systemName: icon)); iconView.tintColor = iconColor
        let tLbl = UILabel(); tLbl.text = title.uppercased(); tLbl.font = .systemFont(ofSize: 12, weight: .bold); tLbl.textColor = AppColors.textSec
        valueLabel.font = .systemFont(ofSize: 24, weight: .bold)
        valueLabel.textColor = AppColors.textMain
        
        card.addSubview(iconView); card.addSubview(tLbl); card.addSubview(valueLabel)
        
        iconView.snp.makeConstraints { $0.top.leading.equalToSuperview().offset(15); $0.size.equalTo(20) }
        tLbl.snp.makeConstraints { $0.centerY.equalTo(iconView); $0.leading.equalTo(iconView.snp.trailing).offset(8) }
        valueLabel.snp.makeConstraints { $0.top.equalTo(iconView.snp.bottom).offset(10); $0.leading.equalToSuperview().offset(15) }
        
        return card
    }
    
    private func createQuickActionsSection() -> UIView {
        let container = UIView()
        let titleLbl = UILabel()
        titleLbl.text = "Quick Actions"
        titleLbl.font = .systemFont(ofSize: 18, weight: .bold)
        titleLbl.textColor = AppColors.textMain
        
        let gridStack1 = UIStackView()
        gridStack1.axis = .horizontal; gridStack1.spacing = 15; gridStack1.distribution = .fillEqually
        
        let gridStack2 = UIStackView()
        gridStack2.axis = .horizontal; gridStack2.spacing = 15; gridStack2.distribution = .fillEqually
        
        let addProductBtn = createActionCard(title: "Add Product", icon: "plus.square.fill", action: #selector(openAddProduct))
        let ordersBtn = createActionCard(title: "Process Orders", icon: "shippingbox.fill", action: #selector(openStaffOrders))
        let inventoryBtn = createActionCard(title: "Inventory", icon: "cube.box.fill", action: #selector(openInventory))
        let customersBtn = createActionCard(title: "Customers", icon: "person.2.fill", action: #selector(openCustomers))
        
        gridStack1.addArrangedSubview(addProductBtn)
        gridStack1.addArrangedSubview(ordersBtn)
        gridStack2.addArrangedSubview(inventoryBtn)
        gridStack2.addArrangedSubview(customersBtn)
        
        container.addSubview(titleLbl); container.addSubview(gridStack1); container.addSubview(gridStack2)
        
        titleLbl.snp.makeConstraints { $0.top.leading.equalToSuperview() }
        gridStack1.snp.makeConstraints { $0.top.equalTo(titleLbl.snp.bottom).offset(15); $0.leading.trailing.equalToSuperview(); $0.height.equalTo(100) }
        gridStack2.snp.makeConstraints { $0.top.equalTo(gridStack1.snp.bottom).offset(15); $0.leading.trailing.bottom.equalToSuperview(); $0.height.equalTo(100) }
        
        return container
    }
    
    private func createActionCard(title: String, icon: String, action: Selector) -> UIView {
        let card = UIView()
        card.backgroundColor = AppColors.surfaceCard
        card.layer.cornerRadius = 16
        card.layer.borderWidth = 1
        card.layer.borderColor = AppColors.textSec.withAlphaComponent(0.2).cgColor
        
        card.isUserInteractionEnabled = true
        let tap = UITapGestureRecognizer(target: self, action: action)
        card.addGestureRecognizer(tap)
        
        let iconView = UIImageView(image: UIImage(systemName: icon))
        iconView.tintColor = AppColors.primaryNeon
        
        let tLbl = UILabel()
        tLbl.text = title
        tLbl.font = .systemFont(ofSize: 14, weight: .medium)
        tLbl.textColor = AppColors.textMain
        tLbl.textAlignment = .center
        
        card.addSubview(iconView); card.addSubview(tLbl)
        
        iconView.snp.makeConstraints { $0.centerX.equalToSuperview(); $0.centerY.equalToSuperview().offset(-10); $0.size.equalTo(28) }
        tLbl.snp.makeConstraints { $0.top.equalTo(iconView.snp.bottom).offset(8); $0.centerX.equalToSuperview() }
        
        return card
    }
    
    // MARK: - Actions
    @objc private func handleThemeChange(_ sender: UISwitch) {
        self.view.window?.overrideUserInterfaceStyle = sender.isOn ? .dark : .light
    }
    
    @objc private func openStaffOrders() {
        let orderVC = StaffOrderProcessingViewController()
        navigationController?.pushViewController(orderVC, animated: true)
    }
    
    @objc private func openMenu() {
        let alert = UIAlertController(title: "Menu Công Việc", message: "Vui lòng chọn thao tác", preferredStyle: .actionSheet)
        alert.addAction(UIAlertAction(title: "Hồ sơ của tôi", style: .default, handler: { _ in print("Mở trang Profile") }))
        alert.addAction(UIAlertAction(title: "Cài đặt hệ thống", style: .default, handler: { _ in print("Mở trang Setting") }))
        alert.addAction(UIAlertAction(title: "Đăng xuất", style: .destructive, handler: { [weak self] _ in self?.handleLogout() }))
        alert.addAction(UIAlertAction(title: "Đóng", style: .cancel))
        present(alert, animated: true)
    }
    
    @objc private func openInventory() {
        let inventoryVC = InventoryViewController()
        navigationController?.pushViewController(inventoryVC, animated: true)
    }
    
    // 👉 ĐÃ SỬA: Mở màn hình Thêm sản phẩm dạng trượt
    @objc private func openAddProduct() {
        let addVC = AddProductViewController()
        addVC.onAddSuccess = { [weak self] in
            self?.loadStaffData()
        }
        if let sheet = addVC.sheetPresentationController {
            sheet.detents = [.large()]
            sheet.prefersGrabberVisible = true
        }
        present(addVC, animated: true)
    }
    
    // 👉 ĐÃ SỬA: Chuyển hướng sang màn hình Customer
    @objc private func openCustomers() {
        let customersVC = UserManagementViewController()
        customersVC.isCustomerOnly = true // Bật cờ chỉ hiển thị Khách hàng
        navigationController?.pushViewController(customersVC, animated: true)
    }
    
    @objc private func handleLogout() {
        APIManager.shared.logout()
        let loginVC = LoginViewController()
        let nav = UINavigationController(rootViewController: loginVC)
        
        if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
           let window = windowScene.windows.first {
            window.rootViewController = nav
            UIView.transition(with: window, duration: 0.3, options: .transitionCrossDissolve, animations: nil, completion: nil)
        }
    }
}
