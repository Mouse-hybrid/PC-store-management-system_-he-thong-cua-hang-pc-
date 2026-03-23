//
//  CategoryManagerViewController.swift
//  AdminDashboard
//
//  Created by khoa on 21/3/26.
//

import UIKit
import SnapKit

// MARK: - Models
struct SubCategory {
    let name: String
    let subtitle: String?
    let count: Int
}

struct MainCategory {
    let name: String
    let subtitle: String
    let icon: String
    let iconColor: UIColor
    var subCategories: [SubCategory] // 👉 Đổi thành 'var' để có thể lọc bớt con bên trong
    var isExpanded: Bool = false
}

class CategoryManagerViewController: UIViewController {
    
    private var categories: [MainCategory] = []
    private var filteredCategories: [MainCategory] = [] // 👉 Mảng dùng để hiển thị và tìm kiếm
    
    // UI Components
    private let searchTextField = UITextField()
    private let tableView = UITableView(frame: .zero, style: .grouped)
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = AppColors.bgMain
        setupHeader()
        setupTopControls()
        setupTableView()
        
        loadRealData()
    }
    
    // MARK: - API & Logic Xử lý Dữ liệu Thực
    private func loadRealData() {
        APIManager.shared.fetchProducts { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success(let products):
                    self?.processData(products)
                case .failure(let error):
                    print("❌ Lỗi tải dữ liệu danh mục: \(error.localizedDescription)")
                }
            }
        }
    }
    
    private func processData(_ products: [Product]) {
        let groupedByCategory = Dictionary(grouping: products, by: { $0.catName })
        var newCategories: [MainCategory] = []
        
        for (catName, catProducts) in groupedByCategory {
            let groupedByBrand = Dictionary(grouping: catProducts, by: { $0.brandName })
            var subCats: [SubCategory] = []
            
            for (brandName, brandProducts) in groupedByBrand {
                subCats.append(SubCategory(name: brandName, subtitle: nil, count: brandProducts.count))
            }
            
            subCats.sort { $0.name < $1.name }
            let (icon, color) = getIconAndColor(for: catName)
            
            let mainCat = MainCategory(
                name: catName,
                subtitle: "\(catProducts.count) Products",
                icon: icon,
                iconColor: color,
                subCategories: subCats,
                isExpanded: true
            )
            newCategories.append(mainCat)
        }
        
        newCategories.sort { $0.name < $1.name }
        
        self.categories = newCategories
        self.filteredCategories = newCategories // 👉 Gán cho mảng hiển thị
        self.tableView.reloadData()
    }
    
    private func getIconAndColor(for name: String) -> (String, UIColor) {
        let lowerName = name.lowercased()
        if lowerName.contains("cpu") || lowerName.contains("vi xử lý") {
            return ("cpu", .systemBlue)
        } else if lowerName.contains("vga") || lowerName.contains("card") || lowerName.contains("màn hình") {
            return ("display", .systemPurple)
        } else if lowerName.contains("main") || lowerName.contains("bo mạch") {
            return ("memorychip", .systemTeal)
        } else if lowerName.contains("ram") || lowerName.contains("bộ nhớ") {
            return ("memorychip.fill", .systemGreen)
        } else if lowerName.contains("ổ cứng") || lowerName.contains("ssd") || lowerName.contains("hdd") {
            return ("internaldrive", .systemOrange)
        } else {
            return ("folder.fill", AppColors.primaryNeon)
        }
    }
    
    // MARK: - UI Setups
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
        titleLbl.text = "Categories"
        titleLbl.font = .systemFont(ofSize: 18, weight: .bold)
        titleLbl.textColor = AppColors.textMain
        
        let addBtn = UIButton(type: .system)
        addBtn.setImage(UIImage(systemName: "plus"), for: .normal)
        addBtn.addTarget(self, action: #selector(openAddProduct), for: .touchUpInside)
        addBtn.tintColor = .white
        addBtn.backgroundColor = AppColors.primaryNeon
        addBtn.layer.cornerRadius = 20
        
        header.addSubview(backBtn)
        header.addSubview(titleLbl)
        header.addSubview(addBtn)
        
        backBtn.snp.makeConstraints { $0.leading.equalToSuperview().offset(15); $0.centerY.equalToSuperview() }
        titleLbl.snp.makeConstraints { $0.center.equalToSuperview() }
        addBtn.snp.makeConstraints { $0.trailing.equalToSuperview().offset(-15); $0.centerY.equalToSuperview(); $0.size.equalTo(40) }
    }
    
    private func setupTopControls() {
        searchTextField.placeholder = "Search categories..."
        searchTextField.backgroundColor = AppColors.surfaceCard
        searchTextField.layer.cornerRadius = 12
        searchTextField.layer.borderWidth = 1
        searchTextField.layer.borderColor = AppColors.textSec.withAlphaComponent(0.2).cgColor
        searchTextField.textColor = AppColors.textMain
        
        let iconView = UIImageView(image: UIImage(systemName: "magnifyingglass"))
        iconView.tintColor = AppColors.textSec
        let iconContainer = UIView(frame: CGRect(x: 0, y: 0, width: 40, height: 20))
        iconView.frame = CGRect(x: 12, y: 0, width: 20, height: 20)
        iconContainer.addSubview(iconView)
        searchTextField.leftView = iconContainer
        searchTextField.leftViewMode = .always
        
        // 👉 Bắt sự kiện gõ tìm kiếm
        searchTextField.addTarget(self, action: #selector(handleSearch(_:)), for: .editingChanged)
        
        view.addSubview(searchTextField)
        searchTextField.snp.makeConstraints { make in
            make.top.equalTo(view.safeAreaLayoutGuide).offset(70)
            make.leading.trailing.equalToSuperview().inset(15)
            make.height.equalTo(48)
        }
        
        let stack = UIStackView()
        stack.axis = .horizontal
        stack.spacing = 15
        stack.distribution = .fillEqually
        
        let editBtn = createActionButton(title: "Edit Mode", icon: "pencil")
        let reorderBtn = createActionButton(title: "Reorder", icon: "arrow.up.arrow.down")
        
        stack.addArrangedSubview(editBtn)
        stack.addArrangedSubview(reorderBtn)
        
        view.addSubview(stack)
        stack.snp.makeConstraints { make in
            make.top.equalTo(searchTextField.snp.bottom).offset(15)
            make.leading.trailing.equalToSuperview().inset(15)
            make.height.equalTo(80)
        }
    }
    
    // 👉 Logic Tìm kiếm thông minh (Deep Filter)
    @objc private func handleSearch(_ textField: UITextField) {
        guard let searchText = textField.text?.lowercased(), !searchText.isEmpty else {
            filteredCategories = categories // Trả lại toàn bộ
            tableView.reloadData()
            return
        }
        
        filteredCategories = categories.compactMap { mainCat in
            let isParentMatch = mainCat.name.lowercased().contains(searchText)
            
            if isParentMatch {
                // Nếu tên Danh mục khớp -> Giữ lại toàn bộ
                var expandedCat = mainCat
                expandedCat.isExpanded = true // Tự động mở ra
                return expandedCat
            } else {
                // Nếu Danh mục không khớp -> Tìm thử trong các Hãng con
                let matchingSubs = mainCat.subCategories.filter { $0.name.lowercased().contains(searchText) }
                
                if !matchingSubs.isEmpty {
                    // Nếu có Hãng con khớp -> Giữ lại Danh mục nhưng chỉ hiện các Hãng khớp
                    var modifiedCat = mainCat
                    modifiedCat.subCategories = matchingSubs
                    modifiedCat.isExpanded = true // Tự động mở ra để thấy hãng
                    return modifiedCat
                } else {
                    // Nếu cả cha lẫn con đều không khớp -> Xóa bỏ
                    return nil
                }
            }
        }
        
        tableView.reloadData()
    }
    
    private func createActionButton(title: String, icon: String) -> UIView {
        let btn = UIView()
        btn.backgroundColor = AppColors.surfaceCard
        btn.layer.cornerRadius = 12
        btn.layer.borderWidth = 1
        btn.layer.borderColor = AppColors.textSec.withAlphaComponent(0.2).cgColor
        
        let iconView = UIImageView(image: UIImage(systemName: icon))
        iconView.tintColor = AppColors.primaryNeon
        
        let titleLbl = UILabel()
        titleLbl.text = title
        titleLbl.font = .systemFont(ofSize: 14, weight: .semibold)
        titleLbl.textColor = AppColors.textMain
        
        btn.addSubview(iconView)
        btn.addSubview(titleLbl)
        
        iconView.snp.makeConstraints { make in
            make.top.equalToSuperview().offset(15)
            make.centerX.equalToSuperview()
            make.size.equalTo(24)
        }
        titleLbl.snp.makeConstraints { make in
            make.top.equalTo(iconView.snp.bottom).offset(8)
            make.centerX.equalToSuperview()
        }
        return btn
    }
    
    private func setupTableView() {
        view.addSubview(tableView)
        tableView.backgroundColor = .clear
        tableView.separatorStyle = .none
        tableView.delegate = self
        tableView.dataSource = self
        tableView.sectionHeaderHeight = UITableView.automaticDimension
        tableView.estimatedSectionHeaderHeight = 80
        
        tableView.snp.makeConstraints { make in
            make.top.equalTo(searchTextField.snp.bottom).offset(110)
            make.leading.trailing.bottom.equalToSuperview()
        }
    }
    
    @objc private func handleBack() { navigationController?.popViewController(animated: true) }
}

// MARK: - TableView (Xử lý Gập/Mở Category)
extension CategoryManagerViewController: UITableViewDelegate, UITableViewDataSource {
    
    func numberOfSections(in tableView: UITableView) -> Int {
        return filteredCategories.count // 👉 Dùng mảng đã lọc
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return filteredCategories[section].isExpanded ? filteredCategories[section].subCategories.count : 0
    }
    
    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        let cat = filteredCategories[section] // 👉 Dùng mảng đã lọc
        let header = UIView()
        header.backgroundColor = AppColors.bgMain
        
        let container = UIView()
        container.backgroundColor = AppColors.surfaceCard
        container.layer.cornerRadius = 12
        container.layer.borderWidth = 1
        container.layer.borderColor = AppColors.textSec.withAlphaComponent(0.2).cgColor
        
        let iconBg = UIView()
        iconBg.backgroundColor = cat.iconColor.withAlphaComponent(0.2)
        iconBg.layer.cornerRadius = 10
        let iconView = UIImageView(image: UIImage(systemName: cat.icon))
        iconView.tintColor = cat.iconColor
        iconView.contentMode = .scaleAspectFit
        iconBg.addSubview(iconView)
        
        let titleLbl = UILabel()
        titleLbl.text = cat.name
        titleLbl.font = .systemFont(ofSize: 16, weight: .bold)
        titleLbl.textColor = AppColors.textMain
        
        let subLbl = UILabel()
        subLbl.text = cat.subtitle
        subLbl.font = .systemFont(ofSize: 12, weight: .medium)
        subLbl.textColor = AppColors.textSec
        
        let chevron = UIImageView(image: UIImage(systemName: "chevron.down"))
        chevron.tintColor = AppColors.textSec
        if !cat.isExpanded { chevron.transform = CGAffineTransform(rotationAngle: -.pi / 2) }
        
        container.addSubview(iconBg)
        container.addSubview(titleLbl)
        container.addSubview(subLbl)
        container.addSubview(chevron)
        header.addSubview(container)
        
        container.snp.makeConstraints { make in
            make.top.bottom.equalToSuperview().inset(6)
            make.leading.trailing.equalToSuperview().inset(15)
            make.height.equalTo(70)
        }
        
        iconBg.snp.makeConstraints { make in
            make.leading.equalToSuperview().offset(15); make.centerY.equalToSuperview()
            make.size.equalTo(44)
        }
        iconView.snp.makeConstraints { $0.center.equalToSuperview(); $0.size.equalTo(24) }
        
        titleLbl.snp.makeConstraints { make in
            make.top.equalToSuperview().offset(15)
            make.leading.equalTo(iconBg.snp.trailing).offset(12)
        }
        subLbl.snp.makeConstraints { make in
            make.top.equalTo(titleLbl.snp.bottom).offset(2)
            make.leading.equalTo(titleLbl)
        }
        chevron.snp.makeConstraints { make in
            make.trailing.equalToSuperview().offset(-15); make.centerY.equalToSuperview()
        }
        
        let tap = UITapGestureRecognizer(target: self, action: #selector(toggleSection(_:)))
        header.tag = section
        header.addGestureRecognizer(tap)
        
        return header
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = UITableViewCell(style: .subtitle, reuseIdentifier: "SubCatCell")
        cell.backgroundColor = .clear
        cell.selectionStyle = .none
        
        let subCat = filteredCategories[indexPath.section].subCategories[indexPath.row] // 👉 Dùng mảng đã lọc
        
        let container = UIView()
        container.backgroundColor = AppColors.surfaceCard.withAlphaComponent(0.5)
        container.layer.cornerRadius = 8
        cell.contentView.addSubview(container)
        
        let titleLbl = UILabel()
        titleLbl.text = subCat.name
        titleLbl.font = .systemFont(ofSize: 14, weight: .semibold)
        titleLbl.textColor = AppColors.textMain
        
        let countLbl = UILabel()
        countLbl.text = "\(subCat.count)"
        countLbl.font = .systemFont(ofSize: 12, weight: .semibold)
        countLbl.textColor = AppColors.textSec
        countLbl.backgroundColor = AppColors.surfaceCard
        countLbl.layer.cornerRadius = 4
        countLbl.clipsToBounds = true
        countLbl.textAlignment = .center
        
        container.addSubview(titleLbl)
        container.addSubview(countLbl)
        
        container.snp.makeConstraints { make in
            make.top.bottom.equalToSuperview().inset(2)
            make.leading.equalToSuperview().offset(50)
            make.trailing.equalToSuperview().offset(-15)
            make.height.equalTo(50)
        }
        
        titleLbl.snp.makeConstraints { $0.leading.equalToSuperview().offset(15); $0.centerY.equalToSuperview() }
        countLbl.snp.makeConstraints { $0.trailing.equalToSuperview().offset(-15); $0.centerY.equalToSuperview(); $0.width.equalTo(40); $0.height.equalTo(24) }
        
        return cell
    }
    
    @objc private func toggleSection(_ sender: UITapGestureRecognizer) {
        guard let section = sender.view?.tag else { return }
        filteredCategories[section].isExpanded.toggle() // 👉 Chỉ đóng mở trên mảng đang hiển thị
        tableView.reloadSections(IndexSet(integer: section), with: .fade)
    }
    
    @objc private func openAddProduct() {
        let addVC = AddProductViewController()
        addVC.onAddSuccess = { [weak self] in
            self?.loadRealData()
        }
        if let sheet = addVC.sheetPresentationController {
            sheet.detents = [.large()]
        }
        present(addVC, animated: true)
    }
}
