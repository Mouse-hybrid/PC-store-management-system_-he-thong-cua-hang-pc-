//
//  AddProductViewController.swift
//  AdminDashboard
//
//  Created by khoa on 21/3/26.
//

import UIKit
import SnapKit

class AddProductViewController: UIViewController {
    
    // Nơi báo về Dashboard hoặc CategoryManager khi thêm thành công
    var onAddSuccess: (() -> Void)?
    
    private let scrollView = UIScrollView()
    private let contentView = UIView()
    
    private let nameField = UITextField()
    private let skuField = UITextField()
    private let priceField = UITextField()
    private let qtyField = UITextField()
    private let catIdField = UITextField()
    private let brandIdField = UITextField()
    
    private let saveButton = UIButton(type: .system)

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = AppColors.bgMain
        setupUI()
    }
    
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
        
        // Tạo các ô nhập liệu
        formStack.addArrangedSubview(createInputRow(title: "Tên linh kiện", field: nameField, placeholder: "VD: CPU Intel Core i9..."))
        formStack.addArrangedSubview(createInputRow(title: "Mã SKU", field: skuField, placeholder: "VD: CPU-I9-14900K"))
        formStack.addArrangedSubview(createInputRow(title: "Giá bán (VNĐ)", field: priceField, placeholder: "VD: 15000000", isNumber: true))
        formStack.addArrangedSubview(createInputRow(title: "Số lượng ban đầu", field: qtyField, placeholder: "VD: 10", isNumber: true))
        formStack.addArrangedSubview(createInputRow(title: "ID Danh mục (Category)", field: catIdField, placeholder: "VD: 1 (CPU), 2 (VGA)...", isNumber: true))
        formStack.addArrangedSubview(createInputRow(title: "ID Thương hiệu (Brand)", field: brandIdField, placeholder: "VD: 1 (Intel), 4 (ASUS)...", isNumber: true))
        
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
        
        lbl.snp.makeConstraints { make in
            make.top.leading.equalToSuperview()
        }
        field.snp.makeConstraints { make in
            make.top.equalTo(lbl.snp.bottom).offset(8)
            make.leading.trailing.bottom.equalToSuperview()
            make.height.equalTo(48)
        }
        return container
    }
    
    @objc private func handleSave() {
        guard let name = nameField.text, !name.isEmpty,
              let sku = skuField.text, !sku.isEmpty,
              let price = priceField.text, !price.isEmpty,
              let qtyStr = qtyField.text, let qty = Int(qtyStr),
              let catStr = catIdField.text, let catId = Int(catStr),
              let brandStr = brandIdField.text, let brandId = Int(brandStr) else {
            
            let alert = UIAlertController(title: "Thiếu thông tin", message: "Vui lòng điền đầy đủ và đúng định dạng các ô.", preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default))
            present(alert, animated: true)
            return
        }
        
        saveButton.setTitle("Đang lưu...", for: .normal)
        saveButton.isEnabled = false
        
        // GỌI API ADD PRODUCT TỪ APIMANAGER (Nhớ thêm hàm này vào APIManager nhé)
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
