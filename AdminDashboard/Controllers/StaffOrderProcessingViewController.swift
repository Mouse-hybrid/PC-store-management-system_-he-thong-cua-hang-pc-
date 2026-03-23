import UIKit
import SnapKit

class StaffOrderProcessingViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    
    private let tableView = UITableView()
    private var allOrders: [Order] = []
    private var filteredOrders: [Order] = []
    private var currentFilter: String = "PENDING"
    
    private let filterScrollView = UIScrollView()
    private let filterStackView = UIStackView()
    private var filterButtons: [UIButton] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = AppColors.bgMain
        setupUI()
        loadOrders()
    }
    
    private func setupUI() {
        let header = setupHeader()
        setupFilterChips(below: header)
        
        view.addSubview(tableView)
        tableView.backgroundColor = .clear
        tableView.separatorStyle = .none
        tableView.delegate = self
        tableView.dataSource = self
        tableView.register(StaffOrderCell.self, forCellReuseIdentifier: "StaffOrderCell")
        
        tableView.rowHeight = UITableView.automaticDimension
        tableView.estimatedRowHeight = 160
        
        tableView.snp.makeConstraints { make in
            make.top.equalTo(filterScrollView.snp.bottom).offset(10)
            make.leading.trailing.bottom.equalToSuperview()
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
        titleLbl.text = "Order Processing"
        titleLbl.font = .systemFont(ofSize: 18, weight: .bold)
        titleLbl.textColor = AppColors.textMain
        
        header.addSubview(backBtn)
        header.addSubview(titleLbl)
        
        backBtn.snp.makeConstraints { $0.leading.equalToSuperview().offset(15); $0.centerY.equalToSuperview() }
        titleLbl.snp.makeConstraints { $0.center.equalToSuperview() }
        
        return header
    }
    
    private func setupFilterChips(below view: UIView) {
        self.view.addSubview(filterScrollView)
        filterScrollView.showsHorizontalScrollIndicator = false
        filterScrollView.contentInset = UIEdgeInsets(top: 0, left: 16, bottom: 0, right: 16)
        
        filterScrollView.snp.makeConstraints { make in
            make.top.equalTo(view.snp.bottom)
            make.leading.trailing.equalToSuperview()
            make.height.equalTo(50)
        }
        
        filterStackView.axis = .horizontal
        filterStackView.spacing = 10
        filterScrollView.addSubview(filterStackView)
        filterStackView.snp.makeConstraints { $0.edges.height.equalToSuperview() }
        
        // 👉 ĐÃ THÊM TAB "COMPLETED" ĐỂ HIỂN THỊ ĐƠN ĐÃ DUYỆT
        let filters = [
            ("New", "PENDING"),
            ("Packed", "PROCESSING"),
            ("Shipped", "SHIPPED"),
            ("Completed", "COMPLETED"),
            ("Canceled", "CANCELLED")
        ]
        
        for filter in filters {
            let btn = UIButton(type: .system)
            btn.setTitle(filter.0, for: .normal)
            btn.titleLabel?.font = .systemFont(ofSize: 14, weight: .semibold)
            btn.layer.cornerRadius = 16
            btn.contentEdgeInsets = UIEdgeInsets(top: 8, left: 16, bottom: 8, right: 16)
            
            btn.accessibilityIdentifier = filter.1
            btn.addTarget(self, action: #selector(filterTapped(_:)), for: .touchUpInside)
            
            filterButtons.append(btn)
            filterStackView.addArrangedSubview(btn)
        }
        
        updateFilterUI()
    }
    
    @objc private func filterTapped(_ sender: UIButton) {
        currentFilter = sender.accessibilityIdentifier ?? "PENDING"
        updateFilterUI()
        applyFilter()
    }
    
    private func updateFilterUI() {
        for btn in filterButtons {
            if btn.accessibilityIdentifier == currentFilter {
                // Tùy chỉnh màu theo từng Tab cho ngầu
                if currentFilter == "CANCELLED" {
                    btn.backgroundColor = .systemRed
                } else if currentFilter == "COMPLETED" {
                    btn.backgroundColor = .systemGreen
                } else {
                    btn.backgroundColor = AppColors.primaryNeon
                }
                btn.setTitleColor(.white, for: .normal)
            } else {
                btn.backgroundColor = AppColors.surfaceCard
                btn.setTitleColor(AppColors.textSec, for: .normal)
                btn.layer.borderWidth = 1
                btn.layer.borderColor = AppColors.textSec.withAlphaComponent(0.2).cgColor
            }
        }
    }
    
    private func applyFilter() {
        filteredOrders = allOrders.filter { order in
            let dbStatus = order.status.uppercased()
            let filter = currentFilter.uppercased()
            
            switch filter {
            case "PENDING":
                return dbStatus == "PENDING" || dbStatus == "NEW" || dbStatus == "UNPAID"
            case "CONFIRMED":
                return dbStatus == "CONFIRMED" || dbStatus == "VERIFIED"
            case "PROCESSING":
                return dbStatus == "PROCESSING" || dbStatus == "PACKED"
            case "SHIPPED":
                return dbStatus == "SHIPPED"
            case "COMPLETED": // Lọc cho Tab mới
                return dbStatus == "COMPLETED"
            case "CANCELLED":
                return dbStatus == "CANCELLED" || dbStatus == "CANCELED" || dbStatus == "REFUNDED"
            default:
                return dbStatus == filter
            }
        }
        tableView.reloadData()
    }
    
    private func loadOrders() {
        APIManager.shared.fetchOrders { [weak self] result in
            DispatchQueue.main.async {
                if case .success(let orders) = result {
                    self?.allOrders = orders.sorted { $0.id > $1.id }
                    self?.applyFilter()
                }
            }
        }
    }
    
    @objc private func handleBack() { navigationController?.popViewController(animated: true) }
    
    // MARK: - TableView
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return filteredOrders.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "StaffOrderCell", for: indexPath) as! StaffOrderCell
        let order = filteredOrders[indexPath.row]
        cell.configure(with: order)
        
        cell.onActionTapped = { [weak self] in
            self?.processOrder(order)
        }
        
        cell.onCancelTapped = { [weak self] in
            self?.cancelOrder(order)
        }
        
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let selectedOrder = filteredOrders[indexPath.row]
        let trackingVC = OrderTrackingViewController()
        trackingVC.order = selectedOrder
        navigationController?.pushViewController(trackingVC, animated: true)
    }
    
    private func processOrder(_ order: Order) {
        var nextStatus = ""
        var actionName = ""
        var isVerifyAction = false
        
        switch order.status.uppercased() {
        case "PENDING":
            // 👉 ÉP CHUYỂN THẲNG SANG COMPLETED ĐỂ KHỚP VỚI NODE.JS
            nextStatus = "COMPLETED"
            actionName = "Hoàn tất đơn hàng"
            isVerifyAction = true // Vẫn dùng API Verify
        case "CONFIRMED", "VERIFIED":
            nextStatus = "PROCESSING"
            actionName = "Bắt đầu đóng gói"
        case "PROCESSING", "PACKED":
            nextStatus = "SHIPPED"
            actionName = "Giao cho đơn vị vận chuyển"
        case "SHIPPED":
            nextStatus = "COMPLETED"
            actionName = "Xác nhận giao thành công"
        default: return
        }
        
        let alert = UIAlertController(title: actionName, message: "Bạn có chắc muốn chuyển đơn hàng #\(order.id) sang trạng thái \(nextStatus)?", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Hủy", style: .cancel))
        alert.addAction(UIAlertAction(title: "Đồng ý", style: .default) { _ in
            
            let handleAPIResult: (Bool) -> Void = { [weak self] success in
                if success {
                    // 👉 TỰ ĐỘNG NHẢY ĐẾN TAB HIỂN THỊ TRẠNG THÁI MỚI (Vd: COMPLETED)
                    self?.currentFilter = nextStatus
                    self?.updateFilterUI()
                    self?.loadOrders()
                } else {
                    let errAlert = UIAlertController(title: "Lỗi", message: "Không thể xử lý đơn hàng!", preferredStyle: .alert)
                    errAlert.addAction(UIAlertAction(title: "OK", style: .default))
                    self?.present(errAlert, animated: true)
                }
            }
            
            if isVerifyAction {
                APIManager.shared.verifyOrder(orderId: order.id, completion: handleAPIResult)
            } else {
                APIManager.shared.updateOrderStatus(orderId: order.id, newStatus: nextStatus, completion: handleAPIResult)
            }
        })
        
        present(alert, animated: true)
    }
    
    private func cancelOrder(_ order: Order) {
        let alert = UIAlertController(title: "Hủy Đơn Hàng", message: "Bạn có chắc chắn muốn hủy đơn hàng #\(order.id)?", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Không", style: .cancel))
        alert.addAction(UIAlertAction(title: "Hủy Đơn", style: .destructive) { _ in
            APIManager.shared.cancelOrder(orderId: order.id) { [weak self] success in
                if success {
                    self?.currentFilter = "CANCELLED"
                    self?.updateFilterUI()
                    self?.loadOrders()
                } else {
                    let errAlert = UIAlertController(title: "Lỗi", message: "Không thể hủy đơn hàng này!", preferredStyle: .alert)
                    errAlert.addAction(UIAlertAction(title: "OK", style: .default))
                    self?.present(errAlert, animated: true)
                }
            }
        })
        present(alert, animated: true)
    }
}

// MARK: - Custom Cell
class StaffOrderCell: UITableViewCell {
    private let container = UIView()
    private let orderIdLbl = UILabel()
    private let nameLbl = UILabel()
    private let timeLbl = UILabel()
    private let badgeLbl = UILabel()
    
    private let btnStack = UIStackView()
    private let actionBtn = UIButton(type: .system)
    private let cancelBtn = UIButton(type: .system)
    
    var onActionTapped: (() -> Void)?
    var onCancelTapped: (() -> Void)?
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        backgroundColor = .clear; selectionStyle = .none
        
        container.backgroundColor = AppColors.surfaceCard
        container.layer.cornerRadius = 12
        container.layer.borderWidth = 1
        container.layer.borderColor = AppColors.textSec.withAlphaComponent(0.2).cgColor
        
        contentView.addSubview(container)
        container.snp.makeConstraints { $0.edges.equalToSuperview().inset(UIEdgeInsets(top: 8, left: 16, bottom: 8, right: 16)) }
        
        orderIdLbl.font = .systemFont(ofSize: 16, weight: .bold); orderIdLbl.textColor = AppColors.textMain
        nameLbl.font = .systemFont(ofSize: 12, weight: .medium); nameLbl.textColor = AppColors.textSec
        timeLbl.font = .systemFont(ofSize: 12); timeLbl.textColor = AppColors.textSec
        badgeLbl.font = .systemFont(ofSize: 10, weight: .bold); badgeLbl.layer.cornerRadius = 6; badgeLbl.clipsToBounds = true; badgeLbl.textAlignment = .center
        
        actionBtn.layer.cornerRadius = 8; actionBtn.titleLabel?.font = .systemFont(ofSize: 14, weight: .bold)
        actionBtn.addTarget(self, action: #selector(btnTapped), for: .touchUpInside)
        
        cancelBtn.layer.cornerRadius = 8; cancelBtn.titleLabel?.font = .systemFont(ofSize: 14, weight: .bold)
        cancelBtn.setTitle("Cancel", for: .normal)
        cancelBtn.backgroundColor = UIColor.systemRed.withAlphaComponent(0.1)
        cancelBtn.setTitleColor(.systemRed, for: .normal)
        cancelBtn.addTarget(self, action: #selector(cancelTapped), for: .touchUpInside)
        
        btnStack.axis = .horizontal
        btnStack.spacing = 10
        btnStack.distribution = .fillEqually
        btnStack.addArrangedSubview(cancelBtn)
        btnStack.addArrangedSubview(actionBtn)
        
        let icon = UIImageView(image: UIImage(systemName: "shippingbox.fill")); icon.tintColor = .systemGray
        
        container.addSubview(icon); container.addSubview(orderIdLbl); container.addSubview(nameLbl)
        container.addSubview(timeLbl); container.addSubview(badgeLbl); container.addSubview(btnStack)
        
        icon.snp.makeConstraints { $0.leading.equalToSuperview().offset(15); $0.top.equalToSuperview().offset(15); $0.size.equalTo(40) }
        orderIdLbl.snp.makeConstraints { $0.top.equalToSuperview().offset(15); $0.leading.equalTo(icon.snp.trailing).offset(12) }
        badgeLbl.snp.makeConstraints { $0.centerY.equalTo(orderIdLbl); $0.trailing.equalToSuperview().offset(-15); $0.height.equalTo(20); $0.width.equalTo(90) }
        nameLbl.snp.makeConstraints { $0.top.equalTo(orderIdLbl.snp.bottom).offset(4); $0.leading.equalTo(orderIdLbl) }
        timeLbl.snp.makeConstraints { $0.centerY.equalTo(nameLbl); $0.leading.equalTo(nameLbl.snp.trailing).offset(8) }
        
        btnStack.snp.makeConstraints { $0.top.equalTo(nameLbl.snp.bottom).offset(15); $0.leading.trailing.equalToSuperview().inset(15); $0.bottom.equalToSuperview().offset(-15); $0.height.equalTo(40) }
    }
    
    @objc private func btnTapped() { onActionTapped?() }
    @objc private func cancelTapped() { onCancelTapped?() }
    
    func configure(with order: Order) {
        orderIdLbl.text = "Order #\(order.id)"
        nameLbl.text = order.guestName ?? "Khách Vãng Lai"
        timeLbl.text = "• \(order.formattedDate)"
        
        btnStack.isHidden = false
        actionBtn.isHidden = false
        cancelBtn.isHidden = false
        
        switch order.status.uppercased() {
        case "PENDING":
            badgeLbl.text = "NEEDS CONFIRM"
            badgeLbl.backgroundColor = UIColor.systemOrange.withAlphaComponent(0.2); badgeLbl.textColor = .systemOrange
            // 👉 ĐỔI NÚT THÀNH "COMPLETED" MÀU XANH LÁ
            actionBtn.setTitle("Completed", for: .normal)
            actionBtn.backgroundColor = .systemGreen
            actionBtn.setTitleColor(.white, for: .normal)
            cancelBtn.isHidden = false
        case "CONFIRMED", "VERIFIED":
            badgeLbl.text = "READY TO PACK"
            badgeLbl.backgroundColor = UIColor.systemPurple.withAlphaComponent(0.2); badgeLbl.textColor = .systemPurple
            actionBtn.setTitle("Start Packing", for: .normal); actionBtn.backgroundColor = .systemPurple; actionBtn.setTitleColor(.white, for: .normal)
            cancelBtn.isHidden = false
        case "PROCESSING", "PACKED":
            badgeLbl.text = "PACKED"
            badgeLbl.backgroundColor = UIColor.systemBlue.withAlphaComponent(0.2); badgeLbl.textColor = .systemBlue
            actionBtn.setTitle("Mark as Shipped", for: .normal); actionBtn.backgroundColor = .systemBlue; actionBtn.setTitleColor(.white, for: .normal)
            cancelBtn.isHidden = true
        case "SHIPPED":
            badgeLbl.text = "SHIPPED"
            badgeLbl.backgroundColor = UIColor.systemTeal.withAlphaComponent(0.2); badgeLbl.textColor = .systemTeal
            actionBtn.setTitle("Complete Order", for: .normal); actionBtn.backgroundColor = .systemGreen; actionBtn.setTitleColor(.white, for: .normal)
            cancelBtn.isHidden = true
        case "COMPLETED": // Trạng thái cho Tab Completed
            badgeLbl.text = "COMPLETED"
            badgeLbl.backgroundColor = UIColor.systemGreen.withAlphaComponent(0.2); badgeLbl.textColor = .systemGreen
            btnStack.isHidden = true // Đã xong thì ẩn hết 2 nút
        case "CANCELLED", "CANCELED":
            badgeLbl.text = "CANCELED"
            badgeLbl.backgroundColor = UIColor.systemRed.withAlphaComponent(0.2); badgeLbl.textColor = .systemRed
            btnStack.isHidden = true
        default:
            badgeLbl.text = order.status.uppercased()
            badgeLbl.backgroundColor = .systemGray; badgeLbl.textColor = .white
            btnStack.isHidden = true
        }
    }
    
    required init?(coder: NSCoder) { fatalError() }
}
