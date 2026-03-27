//
//  OrderTrackingViewController.swift
//  AdminDashboard
//
//  Created by Nguyen on 22/3/26.
//

import UIKit
import SnapKit

class OrderTrackingViewController: UIViewController {
    
    var order: Order? // Nhận data đơn hàng từ màn hình trước truyền sang
    
    private let scrollView = UIScrollView()
    private let contentView = UIView()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = AppColors.bgMain
        setupUI()
    }
    
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
        
        let statusCard = createStatusCard()
        let deliveryCard = createDeliveryCard()
        let itemsSection = createItemsSection()
        let timelineSection = createTimelineSection()
        
        contentView.addSubview(statusCard)
        contentView.addSubview(deliveryCard)
        contentView.addSubview(itemsSection)
        contentView.addSubview(timelineSection)
        
        statusCard.snp.makeConstraints { make in
            make.top.equalToSuperview().offset(10)
            make.leading.trailing.equalToSuperview()
        }
        
        deliveryCard.snp.makeConstraints { make in
            make.top.equalTo(statusCard.snp.bottom).offset(15)
            make.leading.trailing.equalToSuperview().inset(16)
        }
        
        itemsSection.snp.makeConstraints { make in
            make.top.equalTo(deliveryCard.snp.bottom).offset(20)
            make.leading.trailing.equalToSuperview()
        }
        
        timelineSection.snp.makeConstraints { make in
            make.top.equalTo(itemsSection.snp.bottom).offset(20)
            make.leading.trailing.equalToSuperview().inset(16)
            make.bottom.equalToSuperview().offset(-100) // Chừa chỗ cho thanh Bottom Bar
        }
        
        setupBottomBar()
    }
    
    private func setupHeader() -> UIView {
        let header = UIView()
        header.backgroundColor = AppColors.bgMain.withAlphaComponent(0.95)
        view.addSubview(header)
        header.snp.makeConstraints { make in
            make.top.equalTo(view.safeAreaLayoutGuide)
            make.leading.trailing.equalToSuperview()
            make.height.equalTo(50)
        }
        
        let backBtn = UIButton(type: .system)
        backBtn.setImage(UIImage(systemName: "arrow.left"), for: .normal)
        backBtn.tintColor = AppColors.textMain
        backBtn.addTarget(self, action: #selector(handleBack), for: .touchUpInside)
        
        let titleLbl = UILabel()
        titleLbl.text = "Order #\(order?.id ?? 0)"
        titleLbl.font = .systemFont(ofSize: 18, weight: .bold)
        titleLbl.textColor = AppColors.textMain
        
        header.addSubview(backBtn); header.addSubview(titleLbl)
        backBtn.snp.makeConstraints { $0.leading.equalToSuperview().offset(15); $0.centerY.equalToSuperview() }
        titleLbl.snp.makeConstraints { $0.center.equalToSuperview() }
        return header
    }
    
    private func createStatusCard() -> UIView {
        let container = UIView()
        container.backgroundColor = AppColors.surfaceCard
        container.layer.borderWidth = 1
        container.layer.borderColor = AppColors.textSec.withAlphaComponent(0.1).cgColor
        
        let titleLbl = UILabel(); titleLbl.text = order?.status ?? "SHIPPED"; titleLbl.font = .systemFont(ofSize: 24, weight: .bold); titleLbl.textColor = AppColors.primaryNeon
        let subLbl = UILabel(); subLbl.text = "Your order is on the way"; subLbl.font = .systemFont(ofSize: 14); subLbl.textColor = AppColors.textSec
        
        let stepView = UIView(); stepView.backgroundColor = AppColors.primaryNeon.withAlphaComponent(0.1); stepView.layer.cornerRadius = 12
        let stepLbl = UILabel(); stepLbl.text = "STEP 3/4"; stepLbl.font = .systemFont(ofSize: 10, weight: .bold); stepLbl.textColor = AppColors.primaryNeon
        stepView.addSubview(stepLbl); stepLbl.snp.makeConstraints { $0.edges.equalToSuperview().inset(UIEdgeInsets(top: 4, left: 10, bottom: 4, right: 10)) }
        
        let progressBarBg = UIView(); progressBarBg.backgroundColor = AppColors.textSec.withAlphaComponent(0.2); progressBarBg.layer.cornerRadius = 4
        let progressBarFill = UIView(); progressBarFill.backgroundColor = AppColors.primaryNeon; progressBarFill.layer.cornerRadius = 4
        progressBarBg.addSubview(progressBarFill)
        progressBarFill.snp.makeConstraints { $0.top.bottom.leading.equalToSuperview(); $0.width.equalToSuperview().multipliedBy(0.75) } // 75%
        
        container.addSubview(titleLbl); container.addSubview(subLbl); container.addSubview(stepView); container.addSubview(progressBarBg)
        
        titleLbl.snp.makeConstraints { $0.top.leading.equalToSuperview().offset(16) }
        subLbl.snp.makeConstraints { $0.top.equalTo(titleLbl.snp.bottom).offset(4); $0.leading.equalTo(titleLbl) }
        stepView.snp.makeConstraints { $0.centerY.equalTo(titleLbl); $0.trailing.equalToSuperview().offset(-16) }
        progressBarBg.snp.makeConstraints { $0.top.equalTo(subLbl.snp.bottom).offset(15); $0.leading.trailing.equalToSuperview().inset(16); $0.height.equalTo(8); $0.bottom.equalToSuperview().offset(-20) }
        
        return container
    }
    
    private func createDeliveryCard() -> UIView {
        let card = UIView()
        card.backgroundColor = AppColors.surfaceCard; card.layer.cornerRadius = 12; card.layer.borderWidth = 1; card.layer.borderColor = AppColors.textSec.withAlphaComponent(0.1).cgColor
        
        let titleLbl = UILabel(); titleLbl.text = "ESTIMATED DELIVERY"; titleLbl.font = .systemFont(ofSize: 12, weight: .semibold); titleLbl.textColor = AppColors.textSec
        let dateLbl = UILabel(); dateLbl.text = "Oct 24 - Oct 26"; dateLbl.font = .systemFont(ofSize: 18, weight: .bold); dateLbl.textColor = AppColors.textMain
        let iconView = UIImageView(image: UIImage(systemName: "box.truck.fill")); iconView.tintColor = AppColors.primaryNeon
        
        card.addSubview(titleLbl); card.addSubview(dateLbl); card.addSubview(iconView)
        titleLbl.snp.makeConstraints { $0.top.leading.equalToSuperview().offset(16) }
        dateLbl.snp.makeConstraints { $0.top.equalTo(titleLbl.snp.bottom).offset(4); $0.leading.equalTo(titleLbl); $0.bottom.equalToSuperview().offset(-16) }
        iconView.snp.makeConstraints { $0.centerY.equalToSuperview(); $0.trailing.equalToSuperview().offset(-16); $0.size.equalTo(30) }
        
        return card
    }
    
    private func createItemsSection() -> UIView {
        let container = UIView()
        let title = UILabel(); title.text = "Items in Order"; title.font = .systemFont(ofSize: 18, weight: .bold); title.textColor = AppColors.textMain
        container.addSubview(title); title.snp.makeConstraints { $0.top.equalToSuperview(); $0.leading.equalToSuperview().offset(16) }
        
        // Tạo 1 dòng giả lập sản phẩm (Do API order details bạn chưa gọi)
        let itemRow = UIView()
        itemRow.backgroundColor = .clear; itemRow.layer.borderWidth = 1; itemRow.layer.borderColor = AppColors.textSec.withAlphaComponent(0.1).cgColor
        
        let imgView = UIImageView(image: UIImage(systemName: "cpu")); imgView.tintColor = .gray; imgView.backgroundColor = AppColors.surfaceCard; imgView.layer.cornerRadius = 8
        let nameLbl = UILabel(); nameLbl.text = "NVIDIA GeForce RTX 4080"; nameLbl.font = .systemFont(ofSize: 14, weight: .bold); nameLbl.textColor = AppColors.textMain
        let priceLbl = UILabel(); priceLbl.text = order?.formattedTotal ?? "$1,199.00"; priceLbl.font = .systemFont(ofSize: 14, weight: .bold); priceLbl.textColor = AppColors.primaryNeon
        
        itemRow.addSubview(imgView); itemRow.addSubview(nameLbl); itemRow.addSubview(priceLbl)
        imgView.snp.makeConstraints { $0.leading.equalToSuperview().offset(16); $0.centerY.equalToSuperview(); $0.size.equalTo(50) }
        nameLbl.snp.makeConstraints { $0.leading.equalTo(imgView.snp.trailing).offset(12); $0.centerY.equalToSuperview().offset(-10) }
        priceLbl.snp.makeConstraints { $0.leading.equalTo(nameLbl); $0.top.equalTo(nameLbl.snp.bottom).offset(4) }
        
        container.addSubview(itemRow)
        itemRow.snp.makeConstraints { $0.top.equalTo(title.snp.bottom).offset(10); $0.leading.trailing.equalToSuperview(); $0.height.equalTo(80); $0.bottom.equalToSuperview() }
        
        return container
    }
    
    private func createTimelineSection() -> UIView {
        let container = UIView()
        let title = UILabel(); title.text = "Tracking History"; title.font = .systemFont(ofSize: 18, weight: .bold); title.textColor = AppColors.textMain
        
        let stack = UIStackView()
        stack.axis = .vertical; stack.spacing = 0
        
        // Mock data
        stack.addArrangedSubview(createTimelineItem(title: "Arrived at local facility", time: "Today, 9:41 AM", icon: "box.truck", isActive: true, isLast: false))
        stack.addArrangedSubview(createTimelineItem(title: "Order Shipped", time: "Yesterday, 10:00 AM", icon: "shippingbox", isActive: false, isLast: false))
        stack.addArrangedSubview(createTimelineItem(title: "Order Placed", time: order?.formattedDate ?? "Oct 20, 2:15 PM", icon: "doc.text", isActive: false, isLast: true))
        
        container.addSubview(title); container.addSubview(stack)
        title.snp.makeConstraints { $0.top.leading.equalToSuperview() }
        stack.snp.makeConstraints { $0.top.equalTo(title.snp.bottom).offset(15); $0.leading.trailing.bottom.equalToSuperview() }
        
        return container
    }
    
    private func createTimelineItem(title: String, time: String, icon: String, isActive: Bool, isLast: Bool) -> UIView {
        let row = UIView()
        
        let iconContainer = UIView()
        iconContainer.backgroundColor = isActive ? AppColors.primaryNeon : AppColors.surfaceCard
        iconContainer.layer.cornerRadius = 16
        iconContainer.layer.borderWidth = isActive ? 0 : 2
        iconContainer.layer.borderColor = AppColors.textSec.withAlphaComponent(0.2).cgColor
        
        let iconView = UIImageView(image: UIImage(systemName: icon))
        iconView.tintColor = isActive ? .white : AppColors.textSec
        iconContainer.addSubview(iconView)
        iconView.snp.makeConstraints { $0.center.equalToSuperview(); $0.size.equalTo(16) }
        
        let line = UIView()
        line.backgroundColor = AppColors.textSec.withAlphaComponent(0.2)
        line.isHidden = isLast
        
        let titleLbl = UILabel(); titleLbl.text = title; titleLbl.font = .systemFont(ofSize: 16, weight: .bold); titleLbl.textColor = isActive ? AppColors.textMain : AppColors.textSec
        let timeLbl = UILabel(); timeLbl.text = time; timeLbl.font = .systemFont(ofSize: 12); timeLbl.textColor = AppColors.textSec
        
        row.addSubview(iconContainer); row.addSubview(line); row.addSubview(titleLbl); row.addSubview(timeLbl)
        
        iconContainer.snp.makeConstraints { $0.leading.top.equalToSuperview(); $0.size.equalTo(32) }
        line.snp.makeConstraints { $0.top.equalTo(iconContainer.snp.bottom); $0.centerX.equalTo(iconContainer); $0.width.equalTo(2); $0.bottom.equalToSuperview() }
        titleLbl.snp.makeConstraints { $0.leading.equalTo(iconContainer.snp.trailing).offset(15); $0.top.equalToSuperview() }
        timeLbl.snp.makeConstraints { $0.leading.equalTo(titleLbl); $0.top.equalTo(titleLbl.snp.bottom).offset(4); $0.bottom.equalToSuperview().offset(-25) }
        
        return row
    }
    
    private func setupBottomBar() {
        let bar = UIView(); bar.backgroundColor = AppColors.surfaceCard.withAlphaComponent(0.95)
        view.addSubview(bar)
        bar.snp.makeConstraints { $0.leading.trailing.bottom.equalToSuperview(); $0.height.equalTo(100) }
        
        let btn = UIButton(type: .system)
        btn.setTitle("Contact Support", for: .normal); btn.backgroundColor = AppColors.primaryNeon; btn.setTitleColor(.white, for: .normal); btn.layer.cornerRadius = 12
        btn.titleLabel?.font = .systemFont(ofSize: 16, weight: .bold)
        
        bar.addSubview(btn)
        btn.snp.makeConstraints { $0.top.equalToSuperview().offset(15); $0.leading.trailing.equalToSuperview().inset(16); $0.height.equalTo(50) }
    }
    
    @objc private func handleBack() { navigationController?.popViewController(animated: true) }
}
