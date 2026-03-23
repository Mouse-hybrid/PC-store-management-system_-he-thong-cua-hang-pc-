//
//  InventoryViewController.swift
//  AdminDashboard
//
//  Created by khoa on 21/3/26.
//

import UIKit
import SnapKit

class InventoryViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {
    
    private var products: [Product] = []
    private var filteredProducts: [Product] = [] // 👉 Mảng dùng để hiển thị và tìm kiếm
    private let tableView = UITableView()
    
    // Khai báo Thanh tìm kiếm
    private let searchTextField: UITextField = {
        let tf = UITextField()
        tf.placeholder = "Tìm linh kiện (VD: RTX, Core i9)..."
        tf.backgroundColor = AppColors.surfaceCard
        tf.layer.cornerRadius = 12
        tf.layer.borderWidth = 1
        tf.layer.borderColor = AppColors.textSec.withAlphaComponent(0.2).cgColor
        tf.textColor = AppColors.textMain
        
        let iconView = UIImageView(image: UIImage(systemName: "magnifyingglass"))
        iconView.tintColor = AppColors.textSec
        let iconContainer = UIView(frame: CGRect(x: 0, y: 0, width: 40, height: 20))
        iconView.frame = CGRect(x: 12, y: 0, width: 20, height: 20)
        iconContainer.addSubview(iconView)
        
        tf.leftView = iconContainer
        tf.leftViewMode = .always
        
        return tf
    }()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = AppColors.bgMain
        setupHeader()
        setupSearchBar()
        setupTableView()
        loadData()
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
        titleLbl.text = "Inventory Management"
        titleLbl.font = .systemFont(ofSize: 18, weight: .bold)
        titleLbl.textColor = AppColors.textMain
        
        header.addSubview(backBtn)
        header.addSubview(titleLbl)
        
        backBtn.snp.makeConstraints { $0.leading.equalToSuperview().offset(15); $0.centerY.equalToSuperview() }
        titleLbl.snp.makeConstraints { $0.center.equalToSuperview() }
    }
    
    private func setupSearchBar() {
        view.addSubview(searchTextField)
        searchTextField.snp.makeConstraints { make in
            make.top.equalTo(view.safeAreaLayoutGuide).offset(60)
            make.leading.trailing.equalToSuperview().inset(15)
            make.height.equalTo(48)
        }
        // 👉 Gắn sự kiện tìm kiếm ở đây (chỉ 1 lần)
        searchTextField.addTarget(self, action: #selector(handleSearch(_:)), for: .editingChanged)
    }
    
    private func setupTableView() {
        view.addSubview(tableView)
        tableView.backgroundColor = .clear
        tableView.separatorStyle = .none
        tableView.dataSource = self
        tableView.delegate = self
        tableView.register(ProductCell.self, forCellReuseIdentifier: "ProductCell")
        
        tableView.snp.makeConstraints { make in
            make.top.equalTo(searchTextField.snp.bottom).offset(15)
            make.leading.trailing.bottom.equalToSuperview()
        }
    }
    
    private func loadData() {
        APIManager.shared.fetchProducts { [weak self] result in
            DispatchQueue.main.async {
                if case .success(let data) = result {
                    self?.products = data
                    self?.filteredProducts = data //  Cập nhật dữ liệu cho mảng hiển thị
                    self?.tableView.reloadData()
                }
            }
        }
    }
    
    // Lọc dữ liệu OFFLINE mượt mà, không gọi Server liên tục
    @objc private func handleSearch(_ textField: UITextField) {
        guard let searchText = textField.text, !searchText.isEmpty else {
            filteredProducts = products // trống thanh search, hiển thị lại toàn bộ
            tableView.reloadData()
            return
        }
        
        // Lọc theo Tên hoặc SKU (Không phân biệt chữ hoa, chữ thường)
        filteredProducts = products.filter { product in
            return product.name.lowercased().contains(searchText.lowercased()) ||
                   product.sku.lowercased().contains(searchText.lowercased())
        }
        tableView.reloadData()
    }
    
    @objc private func handleBack() { navigationController?.popViewController(animated: true) }
    
    // MARK: - TableView Methods
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return filteredProducts.count // Luôn đếm mảng Filtered
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "ProductCell", for: indexPath) as! ProductCell
        
        // 👉 Lấy data từ mảng Filtered
        let product = filteredProducts[indexPath.row]
        
        cell.configure(with: product)
        
        let stockCount = product.realStock
        
        if stockCount < 5 {
            cell.stockLabel.textColor = .systemRed
            cell.stockLabel.text = "⚠️ Low Stock: \(stockCount)"
            cell.stockLabel.font = .systemFont(ofSize: 12, weight: .bold)
        } else {
            cell.stockLabel.textColor = AppColors.textSec
            cell.stockLabel.text = "Stock: \(stockCount)"
            cell.stockLabel.font = .systemFont(ofSize: 12, weight: .regular)
        }
        
        return cell
    }
    
    // Mở trang chi tiết khi bấm vào sản phẩm
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        // 👉 FIX LỖI: Phải lấy sản phẩm đang được lọc ra (filteredProducts)
        let selectedProduct = filteredProducts[indexPath.row]
        let detailVC = ProductDetailsViewController(product: selectedProduct)
        
        detailVC.onProductUpdated = { [weak self] updatedProduct in
            guard let self = self else { return }
            
            // 1. Cập nhật vào mảng đang hiển thị (để nhìn thấy ngay)
            self.filteredProducts[indexPath.row] = updatedProduct
            
            // 2. Cập nhật luôn vào mảng gốc (để khi xóa chữ Search đi, dữ liệu không bị cũ)
            if let originalIndex = self.products.firstIndex(where: { $0.id == updatedProduct.id }) {
                self.products[originalIndex] = updatedProduct
            }
            
            self.tableView.reloadRows(at: [indexPath], with: .automatic)
        }
        
        navigationController?.pushViewController(detailVC, animated: true)
    }
}
