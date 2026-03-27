//
//  AddProductViewController.swift
//  AdminDashboard
//
//  Created by khoa on 21/3/26.
//

import UIKit
import SnapKit

class AddProductViewController: UIViewController {
    
    var onAddSuccess: (() -> Void)?
    
    private let scrollView = UIScrollView()
    private let contentView = UIView()
    
    private let nameField = UITextField()
    private let skuField = UITextField()
    private let priceField = UITextField()
    private let qtyField = UITextField()
    
    // Nút Dropdown
    private let categoryButton = UIButton(type: .system)
    private let brandButton = UIButton(type: .system)
    
    // Lưu trữ ID thực tế để gửi lên API
    private var selectedCatId: Int?
    private var selectedBrandId: Int?
    
    private let saveButton = UIButton(type: .system)

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = AppColors.bgMain
        setupUI()
        
        // Gọi API tải danh sách Category và Brand
        loadDropdownData()
    }
    
    // MARK: - Lấy Dữ Liệu Thực Từ API
    private func loadDropdownData() {
        // Tạm khóa nút Save khi đang load data
        saveButton.isEnabled = false
        saveButton.setTitle("Đang tải dữ liệu...", for: .normal)
        
        let group = DispatchGroup()
        var fetchedCategories: [CategoryModel] = []
        var fetchedBrands: [BrandModel] = []
        
        // 1. Tải Category
        group.enter()
        APIManager.shared.fetchCategories { result in
            switch result {
            case .success(let cats): fetchedCategories = cats
            case .failure(let err): print("❌ Lỗi tải Category: \(err.localizedDescription)")
            }
            group.leave()
        }
        
        // 2. Tải Brand
        group.enter()
        APIManager.shared.fetchBrands { result in
            switch result {
            case .success(let brands): fetchedBrands = brands
            case .failure(let err): print("❌ Lỗi tải Brand: \(err.localizedDescription)")
            }
            group.leave()
        }
        
        // 3. Khi cả 2 API đều xử lý xong
        group.notify(queue: .main) { [weak self] in
            guard let self = self else { return }
            self.buildCategoryMenu(with: fetchedCategories)
            self.buildBrandMenu(with: fetchedBrands)
            
            self.saveButton.isEnabled = true
            self.saveButton.setTitle("Lưu Sản Phẩm", for: .normal)
        }
    }
    
    private func buildCategoryMenu(with categories: [CategoryModel]) {
        // Kiểm tra và báo lỗi nếu mảng rỗng
        let placeholderText = categories.isEmpty ? "Lỗi: Không có dữ liệu API" : "Chọn Danh Mục"
        if #available(iOS 15.0, *) {
            self.categoryButton.configuration?.title = placeholderText
            self.categoryButton.configuration?.baseForegroundColor = categories.isEmpty ? .systemRed : AppColors.textSec
        } else {
            self.categoryButton.setTitle("  \(placeholderText)", for: .normal)
            self.categoryButton.setTitleColor(categories.isEmpty ? .systemRed : AppColors.textSec, for: .normal)
        }

        let catActions = categories.map { cat in
            UIAction(title: cat.name) { [weak self] _ in
                self?.selectedCatId = cat.id
                if #available(iOS 15.0, *) {
                    self?.categoryButton.configuration?.title = cat.name
                    self?.categoryButton.configuration?.baseForegroundColor = AppColors.textMain
                } else {
                    self?.categoryButton.setTitle(cat.name, for: .normal)
                    self?.categoryButton.setTitleColor(AppColors.textMain, for: .normal)
                }
            }
        }
        categoryButton.menu = UIMenu(title: "Chọn Danh Mục", children: catActions)
        categoryButton.showsMenuAsPrimaryAction = true
    }
    
    private func buildBrandMenu(with brands: [BrandModel]) {
        // Kiểm tra và báo lỗi nếu mảng rỗng
        let placeholderText = brands.isEmpty ? "Lỗi: Không có dữ liệu API" : "Chọn Thương Hiệu"
        if #available(iOS 15.0, *) {
            self.brandButton.configuration?.title = placeholderText
            self.brandButton.configuration?.baseForegroundColor = brands.isEmpty ? .systemRed : AppColors.textSec
        } else {
            self.brandButton.setTitle("  \(placeholderText)", for: .normal)
            self.brandButton.setTitleColor(brands.isEmpty ? .systemRed : AppColors.textSec, for: .normal)
        }

        let brandActions = brands.map { brand in
            UIAction(title: brand.name) { [weak self] _ in
                self?.selectedBrandId = brand.id
                if #available(iOS 15.0, *) {
                    self?.brandButton.configuration?.title = brand.name
                    self?.brandButton.configuration?.baseForegroundColor = AppColors.textMain
                } else {
                    self?.brandButton.setTitle(brand.name, for: .normal)
                    self?.brandButton.setTitleColor(AppColors.textMain, for: .normal)
                }
            }
        }
        brandButton.menu = UIMenu(title: "Chọn Thương Hiệu", children: brandActions)
        brandButton.showsMenuAsPrimaryAction = true
    }
    
    // MARK: - UI Setup
    private func setupUI() {
        let titleLbl = UILabel()
        titleLbl.text = "Thêm Sản Phẩm Mới"
        titleLbl.font = .systemFont(ofSize: 20, weight: .bold)
        titleLbl.textColor = AppColors.textMain
        
        view.addSubview(titleLbl)
        titleLbl.snp.makeConstraints { make in
            make.top.equalTo(view.safeAreaLayoutGuide).offset(20)
            make.centerX.equalToSuperview()
        }
        
        view.addSubview(scrollView)
        scrollView.addSubview(contentView)
        
        scrollView.snp.makeConstraints { make in
            make.top.equalTo(titleLbl.snp.bottom).offset(20)
            make.leading.trailing.bottom.equalToSuperview()
        }
        contentView.snp.makeConstraints { make in
            make.edges.equalToSuperview()
            make.width.equalTo(scrollView)
        }
        
        let formStack = UIStackView()
        formStack.axis = .vertical
        formStack.spacing = 20
        contentView.addSubview(formStack)
        
        // Tạo form nhập liệu
        formStack.addArrangedSubview(createInputRow(title: "Tên linh kiện", field: nameField, placeholder: "VD: CPU Intel Core i9..."))
        formStack.addArrangedSubview(createInputRow(title: "Mã SKU", field: skuField, placeholder: "VD: CPU-I9-14900K"))
        formStack.addArrangedSubview(createInputRow(title: "Giá bán (VNĐ)", field: priceField, placeholder: "VD: 15000000", isNumber: true))
        formStack.addArrangedSubview(createInputRow(title: "Số lượng ban đầu", field: qtyField, placeholder: "VD: 10", isNumber: true))
        
        formStack.addArrangedSubview(createDropdownRow(title: "Danh mục (Category)", button: categoryButton, placeholder: "Đang tải dữ liệu..."))
        formStack.addArrangedSubview(createDropdownRow(title: "Thương hiệu (Brand)", button: brandButton, placeholder: "Đang tải dữ liệu..."))
        
        formStack.snp.makeConstraints { make in
            make.top.equalToSuperview().offset(10)
            make.leading.trailing.equalToSuperview().inset(20)
        }
        
        saveButton.setTitle("Lưu Sản Phẩm", for: .normal)
        saveButton.setTitleColor(.white, for: .normal)
        saveButton.backgroundColor = AppColors.primaryNeon
        saveButton.titleLabel?.font = .systemFont(ofSize: 18, weight: .bold)
        saveButton.layer.cornerRadius = 12
        saveButton.addTarget(self, action: #selector(handleSave), for: .touchUpInside)
        
        contentView.addSubview(saveButton)
        saveButton.snp.makeConstraints { make in
            make.top.equalTo(formStack.snp.bottom).offset(40)
            make.leading.trailing.equalToSuperview().inset(20)
            make.height.equalTo(55)
            make.bottom.equalToSuperview().offset(-40) // Chốt layout
        }
    }
    
    private func createInputRow(title: String, field: UITextField, placeholder: String, isNumber: Bool = false) -> UIView {
        let container = UIView()
        let lbl = UILabel()
        lbl.text = title
        lbl.font = .systemFont(ofSize: 14, weight: .medium)
        lbl.textColor = AppColors.textSec
        
        field.placeholder = placeholder
        field.textColor = AppColors.textMain
        field.backgroundColor = AppColors.surfaceCard
        field.layer.cornerRadius = 10
        field.layer.borderWidth = 1
        field.layer.borderColor = AppColors.textSec.withAlphaComponent(0.3).cgColor
        field.leftView = UIView(frame: CGRect(x: 0, y: 0, width: 12, height: 10))
        field.leftViewMode = .always
        
        if isNumber { field.keyboardType = .numberPad }
        
        container.addSubview(lbl)
        container.addSubview(field)
        
        lbl.snp.makeConstraints { make in make.top.leading.equalToSuperview() }
        field.snp.makeConstraints { make in
            make.top.equalTo(lbl.snp.bottom).offset(8)
            make.leading.trailing.bottom.equalToSuperview()
            make.height.equalTo(48)
        }
        return container
    }
    
    private func createDropdownRow(title: String, button: UIButton, placeholder: String) -> UIView {
        let container = UIView()
        let lbl = UILabel()
        lbl.text = title
        lbl.font = .systemFont(ofSize: 14, weight: .medium)
        lbl.textColor = AppColors.textSec
        
        button.backgroundColor = AppColors.surfaceCard
        button.layer.cornerRadius = 10
        button.layer.borderWidth = 1
        button.layer.borderColor = AppColors.textSec.withAlphaComponent(0.3).cgColor
        button.contentHorizontalAlignment = .left
        
        if #available(iOS 15.0, *) {
            var config = UIButton.Configuration.plain()
            config.title = placeholder
            config.baseForegroundColor = AppColors.textSec
            config.contentInsets = NSDirectionalEdgeInsets(top: 0, leading: 12, bottom: 0, trailing: 30)
            button.configuration = config
        } else {
            button.setTitle("  \(placeholder)", for: .normal)
            button.setTitleColor(AppColors.textSec, for: .normal)
        }

        let arrow = UIImageView(image: UIImage(systemName: "chevron.up.chevron.down"))
        arrow.tintColor = AppColors.textSec
        button.addSubview(arrow)
        arrow.snp.makeConstraints { make in
            make.trailing.equalToSuperview().offset(-12)
            make.centerY.equalToSuperview()
            make.size.equalTo(16)
        }

        container.addSubview(lbl)
        container.addSubview(button)

        lbl.snp.makeConstraints { make in make.top.leading.equalToSuperview() }
        button.snp.makeConstraints { make in
            make.top.equalTo(lbl.snp.bottom).offset(8)
            make.leading.trailing.bottom.equalToSuperview()
            make.height.equalTo(48)
        }
        return container
    }
    
    // MARK: - Save Logic
    @objc private func handleSave() {
        guard let name = nameField.text, !name.isEmpty,
              let sku = skuField.text, !sku.isEmpty,
              let price = priceField.text, !price.isEmpty,
              let qtyStr = qtyField.text, let qty = Int(qtyStr),
              let catId = selectedCatId,
              let brandId = selectedBrandId else {
            
            let alert = UIAlertController(title: "Thiếu thông tin", message: "Vui lòng điền đầy đủ và chọn Danh mục/Thương hiệu.", preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default))
            present(alert, animated: true)
            return
        }
        
        saveButton.setTitle("Đang lưu...", for: .normal)
        saveButton.isEnabled = false
        
        APIManager.shared.addProduct(name: name, sku: sku, price: price, qty: qty, catId: catId, brandId: brandId) { [weak self] success in
            guard let self = self else { return }
            self.saveButton.setTitle("Lưu Sản Phẩm", for: .normal)
            self.saveButton.isEnabled = true
            
            if success {
                let alert = UIAlertController(title: "Thành công!", message: "Sản phẩm mới đã được thêm vào kho.", preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in
                    self.onAddSuccess?()
                    self.dismiss(animated: true)
                })
                self.present(alert, animated: true)
            } else {
                let alert = UIAlertController(title: "Lỗi", message: "Không thể thêm sản phẩm, vui lòng thử lại.", preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default))
                self.present(alert, animated: true)
            }
        }
    }
}
