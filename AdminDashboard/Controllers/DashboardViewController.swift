import UIKit
import SnapKit
import DGCharts

class DashboardViewController: UIViewController {

    private let scrollView = UIScrollView()
    private let contentView = UIView()
    private var products: [Product] = []
    
    // MARK: - UI Components
    private let titleLabel: UILabel = {
        let lbl = UILabel()
        lbl.text = "Admin Analytics"
        lbl.font = .systemFont(ofSize: 18, weight: .semibold)
        return lbl
    }()
    
    private let totalSalesValue: UILabel = {
        let lbl = UILabel()
        lbl.text = "0₫"
        lbl.font = .systemFont(ofSize: 22, weight: .bold)
        return lbl
    }()
    
    private let totalOrdersValue: UILabel = {
        let lbl = UILabel()
        lbl.text = "0"
        lbl.font = .systemFont(ofSize: 22, weight: .bold)
        return lbl
    }()
    
    private let inventoryValueLabel: UILabel = {
        let lbl = UILabel()
        lbl.text = "0₫"
        lbl.font = .systemFont(ofSize: 18, weight: .bold)
        lbl.textColor = AppColors.primaryNeon
        return lbl
    }()
    
    private let lineChartView = LineChartView()
    private let pieChartView = PieChartView()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = AppColors.bgMain
        navigationController?.setNavigationBarHidden(true, animated: false)
        
        setupUI()
        loadAllDashboardData()
    }
    
    private func loadAllDashboardData() {
        loadRealRevenueData()
        loadRealOrderData()
        loadRealInventoryStats()
    }
    
    // MARK: - API Calls
    
    private func loadRealRevenueData() {
        APIManager.shared.fetchDailyRevenue { [weak self] result in
            DispatchQueue.main.async {
                if case .success(let dailyRevenues) = result {
                    let total = dailyRevenues.reduce(0) { $0 + $1.totalRevenue }
                    self?.totalSalesValue.text = self?.formatCurrency(total)
                    self?.setupLineChart(with: dailyRevenues)
                }
            }
        }
    }
    
    private func loadRealOrderData() {
        APIManager.shared.fetchOrderStats { [weak self] result in
            DispatchQueue.main.async {
                if case .success(let stats) = result {
                    self?.totalOrdersValue.text = "\(stats.totalOrders)"
                }
            }
        }
    }
    
    private func loadRealInventoryStats() {
        APIManager.shared.fetchProducts { [weak self] result in
            DispatchQueue.main.async {
                guard let self = self, case .success(let fetchedProducts) = result else { return }
                self.products = fetchedProducts
                
                // 1. Tính tổng giá trị tồn kho
                let totalValue = fetchedProducts.reduce(0.0) {
                    $0 + ((Double($1.price) ?? 0) * Double($1.realStock))
                }
                self.inventoryValueLabel.text = self.formatCurrency(totalValue)
                
                // 2. Vẽ biểu đồ tròn phân bổ theo danh mục
                self.setupPieChart(with: fetchedProducts)
            }
        }
    }
    
    // MARK: - UI Setup
    private func setupUI() {
        view.addSubview(scrollView)
        scrollView.addSubview(contentView)
        
        scrollView.snp.makeConstraints { make in make.edges.equalTo(view.safeAreaLayoutGuide) }
        contentView.snp.makeConstraints { make in
            make.edges.equalToSuperview()
            make.width.equalTo(scrollView)
        }
        
        let headerView = createHeader()
        let tabsView = createTabs()
        let filtersView = createFilters()
        
        let statsStack = UIStackView()
        statsStack.axis = .horizontal
        statsStack.spacing = 15
        statsStack.distribution = .fillEqually
        
        let salesCard = createStatCard(title: "TOTAL REVENUE", valueLabel: totalSalesValue, icon: "dongsign.circle.fill", color: AppColors.primaryNeon)
        
        let ordersCard = createStatCard(title: "TOTAL ORDERS", valueLabel: totalOrdersValue, icon: "cart.fill", color: AppColors.accentPurple)
        ordersCard.isUserInteractionEnabled = true
        ordersCard.addGestureRecognizer(UITapGestureRecognizer(target: self, action: #selector(goToOrders)))
        
        statsStack.addArrangedSubview(salesCard)
        statsStack.addArrangedSubview(ordersCard)
        
        let lineChartCard = createChartCard(title: "Revenue Trends", chart: lineChartView)
        let pieChartCard = createInventoryDistributionCard()
        
        contentView.addSubview(headerView)
        contentView.addSubview(tabsView)
        contentView.addSubview(filtersView)
        contentView.addSubview(statsStack)
        contentView.addSubview(lineChartCard)
        contentView.addSubview(pieChartCard)
        
        headerView.snp.makeConstraints { $0.top.leading.trailing.equalToSuperview(); $0.height.equalTo(50) }
        tabsView.snp.makeConstraints { $0.top.equalTo(headerView.snp.bottom); $0.leading.trailing.equalToSuperview(); $0.height.equalTo(50) }
        filtersView.snp.makeConstraints { $0.top.equalTo(tabsView.snp.bottom).offset(10); $0.leading.trailing.equalToSuperview().inset(15); $0.height.equalTo(35) }
        statsStack.snp.makeConstraints { $0.top.equalTo(filtersView.snp.bottom).offset(20); $0.leading.trailing.equalToSuperview().inset(15); $0.height.equalTo(100) }
        lineChartCard.snp.makeConstraints { $0.top.equalTo(statsStack.snp.bottom).offset(20); $0.leading.trailing.equalToSuperview().inset(15); $0.height.equalTo(280) }
        pieChartCard.snp.makeConstraints { $0.top.equalTo(lineChartCard.snp.bottom).offset(20); $0.leading.trailing.equalToSuperview().inset(15); $0.bottom.equalToSuperview().offset(-30) }
    }
    
    // MARK: - Chart Logic
    private func setupPieChart(with products: [Product]) {
        let grouped = Dictionary(grouping: products, by: { $0.catName })
        var entries: [PieChartDataEntry] = []
        
        for (category, items) in grouped {
            let totalStock = items.reduce(0) { $0 + $1.realStock }
            if totalStock > 0 {
                entries.append(PieChartDataEntry(value: Double(totalStock), label: category))
            }
        }

        let dataSet = PieChartDataSet(entries: entries, label: "")
        dataSet.colors = [.systemBlue, .systemPurple, .systemCyan, .systemOrange, .systemGreen]
        dataSet.valueTextColor = .white
        dataSet.entryLabelColor = .white
        dataSet.entryLabelFont = .systemFont(ofSize: 10, weight: .medium)
        dataSet.sliceSpace = 2
        
        let data = PieChartData(dataSet: dataSet)
        pieChartView.data = data
        pieChartView.animate(xAxisDuration: 1.0, easingOption: .easeOutBack)
        pieChartView.notifyDataSetChanged()
    }
    
    private func createInventoryDistributionCard() -> UIView {
        let card = UIView()
        card.backgroundColor = AppColors.surfaceCard
        card.layer.cornerRadius = 20
        
        let titleLbl = createLabel("Stock Distribution", size: 16, weight: .bold, color: AppColors.textMain)
        let subTitle = createLabel("Inventory Value:", size: 12, weight: .medium, color: AppColors.textSec)
        
        card.addSubview(titleLbl)
        card.addSubview(subTitle)
        card.addSubview(inventoryValueLabel)
        card.addSubview(pieChartView)
        
        titleLbl.snp.makeConstraints { $0.top.leading.equalToSuperview().offset(20) }
        subTitle.snp.makeConstraints { $0.top.equalTo(titleLbl.snp.bottom).offset(5); $0.leading.equalTo(titleLbl) }
        inventoryValueLabel.snp.makeConstraints { $0.centerY.equalTo(subTitle); $0.leading.equalTo(subTitle.snp.trailing).offset(5) }
        
        pieChartView.snp.makeConstraints { make in
            make.top.equalTo(inventoryValueLabel.snp.bottom).offset(10)
            make.leading.trailing.bottom.equalToSuperview().inset(15)
            make.height.equalTo(250)
        }
        
        // Cấu hình Style Pie Chart
        pieChartView.chartDescription.enabled = false
        pieChartView.legend.enabled = true
        pieChartView.legend.textColor = AppColors.textSec
        pieChartView.holeColor = .clear
        pieChartView.transparentCircleColor = .clear
        pieChartView.drawHoleEnabled = true
        pieChartView.holeRadiusPercent = 0.5
        
        return card
    }

    private func setupLineChart(with data: [DailyRevenue]) {
        var entries: [ChartDataEntry] = []
        for (index, rev) in data.enumerated() {
            entries.append(ChartDataEntry(x: Double(index), y: rev.totalRevenue))
        }
        let dataSet = LineChartDataSet(entries: entries, label: "")
        dataSet.colors = [AppColors.primaryNeon]; dataSet.lineWidth = 3
        dataSet.drawCirclesEnabled = false; dataSet.mode = .cubicBezier
        dataSet.drawValuesEnabled = false
        
        let gradientColors = [AppColors.primaryNeon.withAlphaComponent(0.3).cgColor, UIColor.clear.cgColor]
        if let gradient = CGGradient(colorsSpace: nil, colors: gradientColors as CFArray, locations: nil) {
            dataSet.fill = LinearGradientFill(gradient: gradient, angle: 90)
            dataSet.drawFilledEnabled = true
        }
        lineChartView.data = LineChartData(dataSet: dataSet)
        lineChartView.xAxis.enabled = false; lineChartView.leftAxis.enabled = false; lineChartView.rightAxis.enabled = false; lineChartView.legend.enabled = false
    }

    // MARK: - Helper Methods
    private func createHeader() -> UIView {
        let view = UIView()
        let logo = UIImageView(image: UIImage(systemName: "cpu.fill"))
        logo.tintColor = AppColors.primaryNeon
        titleLabel.textColor = AppColors.textMain
        
        let themeSwitch = UISwitch()
        themeSwitch.onTintColor = AppColors.primaryNeon
        themeSwitch.isOn = self.traitCollection.userInterfaceStyle == .dark
        themeSwitch.addTarget(self, action: #selector(handleThemeChange(_:)), for: .valueChanged)
        
        // THÊM NÚT ĐĂNG XUẤT Ở ĐÂY
        let logoutBtn = UIButton(type: .system)
        logoutBtn.setImage(UIImage(systemName: "rectangle.portrait.and.arrow.right"), for: .normal)
        logoutBtn.tintColor = .systemRed
        logoutBtn.addTarget(self, action: #selector(handleLogout), for: .touchUpInside)
        
        view.addSubview(logo)
        view.addSubview(titleLabel)
        view.addSubview(themeSwitch)
        view.addSubview(logoutBtn) // Gắn vào UI
        
        logo.snp.makeConstraints { $0.leading.equalToSuperview().offset(15); $0.centerY.equalToSuperview(); $0.size.equalTo(24) }
        titleLabel.snp.makeConstraints { $0.leading.equalTo(logo.snp.trailing).offset(10); $0.centerY.equalToSuperview() }
        
        // Đẩy nút Logout ra góc phải, nút Theme Switch xích vào trong 1 tí
        logoutBtn.snp.makeConstraints { $0.trailing.equalToSuperview().offset(-15); $0.centerY.equalToSuperview(); $0.size.equalTo(28) }
        themeSwitch.snp.makeConstraints { $0.trailing.equalTo(logoutBtn.snp.leading).offset(-15); $0.centerY.equalToSuperview() }
        
        return view
    }

    private func createTabs() -> UIView {
        let scrollView = UIScrollView()
        scrollView.showsHorizontalScrollIndicator = false
        // 👉 Tuyệt chiêu 1: Dùng contentInset để tạo lề trái/phải mượt mà khi cuộn
        scrollView.contentInset = UIEdgeInsets(top: 0, left: 20, bottom: 0, right: 20)
        
        let stackView = UIStackView()
        stackView.axis = .horizontal
        stackView.alignment = .center
        // 👉 Tuyệt chiêu 2: Chia đều khoảng trống cho các chữ
        stackView.distribution = .equalSpacing
        stackView.spacing = 20
        
        let overViewLbl = createLabel("Overview", size: 14, weight: .semibold, color: AppColors.primaryNeon)
        let indicator = UIView()
        indicator.backgroundColor = AppColors.primaryNeon
        
        let inventoryLbl = createLabel("Inventory", size: 14, weight: .medium, color: AppColors.textSec)
        inventoryLbl.isUserInteractionEnabled = true
        inventoryLbl.addGestureRecognizer(UITapGestureRecognizer(target: self, action: #selector(goToInventory)))
        
        let categoryLbl = createLabel("Categories", size: 14, weight: .medium, color: AppColors.textSec)
        categoryLbl.isUserInteractionEnabled = true
        categoryLbl.addGestureRecognizer(UITapGestureRecognizer(target: self, action: #selector(goToCategories)))
        
        let financeLbl = createLabel("Finance", size: 14, weight: .medium, color: AppColors.textSec)
        financeLbl.isUserInteractionEnabled = true
        financeLbl.addGestureRecognizer(UITapGestureRecognizer(target: self, action: #selector(goToFinance)))
        
        stackView.addArrangedSubview(overViewLbl)
        stackView.addArrangedSubview(inventoryLbl)
        stackView.addArrangedSubview(categoryLbl)
        stackView.addArrangedSubview(financeLbl)
        
        scrollView.addSubview(stackView)
        stackView.snp.makeConstraints { make in
            make.edges.equalToSuperview()
            make.height.equalToSuperview()
            // 👉 Tuyệt chiêu 3: Đảm bảo StackView luôn giãn hết chiều ngang màn hình (trừ đi 40 padding)
            make.width.greaterThanOrEqualTo(scrollView.snp.width).offset(-40)
        }
        
        // Thêm gạch chân (indicator) dưới chữ Overview
        overViewLbl.addSubview(indicator)
        indicator.snp.makeConstraints { make in
            make.top.equalTo(overViewLbl.snp.bottom).offset(5)
            make.centerX.equalToSuperview()
            make.width.equalTo(60)
            make.height.equalTo(2)
        }
        
        return scrollView
    }
    
    private func formatCurrency(_ value: Double) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencySymbol = "₫"
        formatter.maximumFractionDigits = 0
        return formatter.string(from: NSNumber(value: value)) ?? "0₫"
    }

    private func createChartCard(title: String, chart: UIView) -> UIView {
        let container = UIView()
        let titleLbl = createLabel(title, size: 16, weight: .bold, color: AppColors.textMain)
        let card = UIView(); card.backgroundColor = AppColors.surfaceCard; card.layer.cornerRadius = 16
        card.addSubview(chart); chart.snp.makeConstraints { $0.edges.equalToSuperview().inset(10) }
        container.addSubview(titleLbl); container.addSubview(card)
        titleLbl.snp.makeConstraints { $0.top.leading.equalToSuperview() }
        card.snp.makeConstraints { $0.top.equalTo(titleLbl.snp.bottom).offset(10); $0.leading.trailing.bottom.equalToSuperview() }
        return container
    }

    private func createStatCard(title: String, valueLabel: UILabel, icon: String, color: UIColor) -> UIView {
        let card = UIView(); card.backgroundColor = AppColors.surfaceCard; card.layer.cornerRadius = 16
        let iconView = UIImageView(image: UIImage(systemName: icon)); iconView.tintColor = color
        let titleLbl = createLabel(title, size: 10, weight: .medium, color: AppColors.textSec)
        card.addSubview(iconView); card.addSubview(titleLbl); card.addSubview(valueLabel)
        valueLabel.textColor = AppColors.textMain
        iconView.snp.makeConstraints { $0.top.leading.equalToSuperview().offset(15); $0.size.equalTo(20) }
        titleLbl.snp.makeConstraints { $0.top.equalTo(iconView.snp.bottom).offset(8); $0.leading.equalToSuperview().offset(15) }
        valueLabel.snp.makeConstraints { $0.top.equalTo(titleLbl.snp.bottom).offset(2); $0.leading.equalToSuperview().offset(15) }
        return card
    }

    private func createFilters() -> UIView {
        let view = UIView(); let btn = UIButton(type: .system)
        btn.setTitle("This Week", for: .normal); btn.setTitleColor(AppColors.primaryNeon, for: .normal)
        btn.titleLabel?.font = .systemFont(ofSize: 12, weight: .bold); btn.backgroundColor = AppColors.primaryNeon.withAlphaComponent(0.1)
        btn.layer.cornerRadius = 15; view.addSubview(btn)
        btn.snp.makeConstraints { $0.leading.centerY.equalToSuperview(); $0.height.equalTo(30); $0.width.equalTo(90) }
        return view
    }

    private func createLabel(_ text: String, size: CGFloat, weight: UIFont.Weight, color: UIColor) -> UILabel {
        let lbl = UILabel(); lbl.text = text; lbl.font = .systemFont(ofSize: size, weight: weight); lbl.textColor = color
        return lbl
    }
    
    @objc private func goToInventory() { navigationController?.pushViewController(InventoryViewController(), animated: true) }
    @objc private func goToCategories() { navigationController?.pushViewController(CategoryManagerViewController(), animated: true) }
    
    //HÀM ĐƯỢC GỌI KHI BẤM VÀO TAB FINANCE
    @objc private func goToFinance() { navigationController?.pushViewController(FinanceViewController(), animated: true) }
    
    @objc private func handleThemeChange(_ sender: UISwitch) { self.view.window?.overrideUserInterfaceStyle = sender.isOn ? .dark : .light }
    @objc private func goToOrders() {
        let ordersVC = OrdersViewController()
        navigationController?.pushViewController(ordersVC, animated: true)
    }
    
    @objc private func handleLogout() {
        // 1. Gọi hàm xóa Token và Role trong APIManager
        APIManager.shared.logout()
        
        // 2. Mở lại trang Login với hiệu ứng mờ dần (Cross Dissolve)
        let loginVC = LoginViewController() // (Nếu file login của bạn tên là ViewController thì đổi lại nhé)
        let nav = UINavigationController(rootViewController: loginVC)
        
        if let window = UIApplication.shared.windows.first {
            window.rootViewController = nav
            UIView.transition(with: window, duration: 0.3, options: .transitionCrossDissolve, animations: nil, completion: nil)
        }
    }
}
