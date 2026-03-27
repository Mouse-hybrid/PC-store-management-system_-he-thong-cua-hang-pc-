//
//  OrdersViewController.swift
//  AdminDashboard
//
//  Created by Nguyen on 21/3/26.
//

import UIKit
import SnapKit

class OrdersViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    
    private let tableView = UITableView()
    private var orders: [Order] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = AppColors.bgMain
        setupHeader()
        setupTableView()
        loadOrders()
    }
    
    private func loadOrders() {
        APIManager.shared.fetchOrders { [weak self] result in
            DispatchQueue.main.async {
                if case .success(let fetchedOrders) = result {
                    self?.orders = fetchedOrders
                    self?.tableView.reloadData()
                }
            }
        }
    }
    
    private func setupHeader() {
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
        titleLbl.text = "Order Management"
        titleLbl.font = .systemFont(ofSize: 18, weight: .bold)
        titleLbl.textColor = AppColors.textMain
        
        header.addSubview(backBtn)
        header.addSubview(titleLbl)
        
        backBtn.snp.makeConstraints { $0.leading.equalToSuperview().offset(15); $0.centerY.equalToSuperview() }
        titleLbl.snp.makeConstraints { $0.center.equalToSuperview() }
    }
    
    private func setupTableView() {
        view.addSubview(tableView)
        tableView.backgroundColor = .clear
        tableView.separatorStyle = .none
        tableView.delegate = self
        tableView.dataSource = self
        tableView.register(OrderCell.self, forCellReuseIdentifier: "OrderCell")
        
        tableView.snp.makeConstraints { make in
            make.top.equalTo(view.safeAreaLayoutGuide).offset(70)
            make.leading.trailing.bottom.equalToSuperview()
        }
    }
    
    @objc private func handleBack() { navigationController?.popViewController(animated: true) }
    
    // MARK: - TableView DataSource
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int { return orders.count }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "OrderCell", for: indexPath) as! OrderCell
        cell.configure(with: orders[indexPath.row])
        return cell
    }
}

// MARK: - Giao diện từng Ô Đơn Hàng (Order Cell)
class OrderCell: UITableViewCell {
    private let container = UIView()
    private let orderIdLbl = UILabel()
    private let customerLbl = UILabel()
    private let dateLbl = UILabel()
    private let amountLbl = UILabel()
    private let statusBadge = UILabel()
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        backgroundColor = .clear; selectionStyle = .none
        
        container.backgroundColor = AppColors.surfaceCard
        container.layer.cornerRadius = 12
        contentView.addSubview(container)
        container.snp.makeConstraints { $0.edges.equalToSuperview().inset(UIEdgeInsets(top: 8, left: 15, bottom: 8, right: 15)) }
        
        orderIdLbl.font = .systemFont(ofSize: 16, weight: .bold)
        orderIdLbl.textColor = AppColors.textMain
        
        amountLbl.font = .systemFont(ofSize: 16, weight: .bold)
        amountLbl.textColor = AppColors.primaryNeon
        
        customerLbl.font = .systemFont(ofSize: 14, weight: .medium)
        customerLbl.textColor = AppColors.textSec
        
        dateLbl.font = .systemFont(ofSize: 12)
        dateLbl.textColor = AppColors.textSec
        
        statusBadge.font = .systemFont(ofSize: 10, weight: .bold)
        statusBadge.textColor = .white
        statusBadge.layer.cornerRadius = 8
        statusBadge.clipsToBounds = true
        statusBadge.textAlignment = .center
        
        container.addSubview(orderIdLbl); container.addSubview(amountLbl)
        container.addSubview(customerLbl); container.addSubview(dateLbl); container.addSubview(statusBadge)
        
        orderIdLbl.snp.makeConstraints { $0.top.leading.equalToSuperview().offset(15) }
        amountLbl.snp.makeConstraints { $0.top.trailing.equalToSuperview().inset(15) }
        customerLbl.snp.makeConstraints { $0.top.equalTo(orderIdLbl.snp.bottom).offset(8); $0.leading.equalTo(orderIdLbl) }
        dateLbl.snp.makeConstraints { $0.top.equalTo(customerLbl.snp.bottom).offset(4); $0.leading.equalTo(orderIdLbl); $0.bottom.equalToSuperview().offset(-15) }
        statusBadge.snp.makeConstraints { $0.centerY.equalTo(dateLbl); $0.trailing.equalToSuperview().offset(-15); $0.height.equalTo(20); $0.width.equalTo(80) }
    }
    
    func configure(with order: Order) {
        orderIdLbl.text = "Order #\(order.id)"
        amountLbl.text = order.formattedTotal
        customerLbl.text = order.guestName ?? "Khách vãng lai"
        dateLbl.text = order.formattedDate
        statusBadge.text = order.status.uppercased()
        statusBadge.backgroundColor = order.statusColor
    }
    required init?(coder: NSCoder) { fatalError() }
}
