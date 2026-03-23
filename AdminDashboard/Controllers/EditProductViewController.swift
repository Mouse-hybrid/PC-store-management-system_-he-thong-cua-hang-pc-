//
//  EditProductViewController.swift
//  AdminDashboard
//
//  Created by khoa on 21/3/26.
//

import UIKit
import SnapKit

class EditProductViewController: UIViewController {
    
    private let product: Product
    
    var onSaveSuccess: ((_ newName: String, _ newSKU: String, _ newPrice: String) -> Void)?
    
    // UI Components
    private let titleLabel = UILabel()
    private let nameField = UITextField()
    private let skuField = UITextField()
    private let priceField = UITextField()
    private let saveButton = UIButton(type: .system)
    
    init(product: Product) {
        self.product = product
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) { fatalError() }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = AppColors.bgMain
        setupUI()
        prefillData()
    }
    
    private func setupUI() {
        titleLabel.text = "Edit Product"
        titleLabel.font = .systemFont(ofSize: 20, weight: .bold)
        titleLabel.textColor = AppColors.textMain
        titleLabel.textAlignment = .center
        
        view.addSubview(titleLabel)
        titleLabel.snp.makeConstraints { make in
            make.top.equalToSuperview().offset(30)
            make.leading.trailing.equalToSuperview()
        }
        
        let stack = UIStackView()
        stack.axis = .vertical
        stack.spacing = 20
        
        let nameContainer = createInput(title: "Product Name", textField: nameField)
        let skuContainer = createInput(title: "SKU Code", textField: skuField)
        let priceContainer = createInput(title: "Price (VND)", textField: priceField)
        priceField.keyboardType = .numberPad
        
        stack.addArrangedSubview(nameContainer)
        stack.addArrangedSubview(skuContainer)
        stack.addArrangedSubview(priceContainer)
        
        view.addSubview(stack)
        stack.snp.makeConstraints { make in
            make.top.equalTo(titleLabel.snp.bottom).offset(30)
            make.leading.trailing.equalToSuperview().inset(20)
        }
        
        saveButton.setTitle("Save Changes", for: .normal)
        saveButton.backgroundColor = AppColors.primaryNeon
        saveButton.setTitleColor(.white, for: .normal)
        saveButton.titleLabel?.font = .systemFont(ofSize: 16, weight: .bold)
        saveButton.layer.cornerRadius = 12
        saveButton.addTarget(self, action: #selector(handleSave), for: .touchUpInside)
        
        view.addSubview(saveButton)
        saveButton.snp.makeConstraints { make in
            make.top.equalTo(stack.snp.bottom).offset(40)
            make.leading.trailing.equalToSuperview().inset(20)
            make.height.equalTo(50)
        }
    }
    
    private func createInput(title: String, textField: UITextField) -> UIView {
        let container = UIView()
        let lbl = UILabel()
        lbl.text = title
        lbl.font = .systemFont(ofSize: 14, weight: .medium)
        lbl.textColor = AppColors.textSec
        
        textField.backgroundColor = AppColors.surfaceCard
        textField.textColor = AppColors.textMain
        textField.layer.cornerRadius = 8
        textField.layer.borderWidth = 1
        textField.layer.borderColor = AppColors.textSec.withAlphaComponent(0.3).cgColor
        textField.leftView = UIView(frame: CGRect(x: 0, y: 0, width: 10, height: 1))
        textField.leftViewMode = .always
        
        container.addSubview(lbl)
        container.addSubview(textField)
        
        lbl.snp.makeConstraints { make in
            make.top.leading.trailing.equalToSuperview()
        }
        textField.snp.makeConstraints { make in
            make.top.equalTo(lbl.snp.bottom).offset(8)
            make.leading.trailing.bottom.equalToSuperview()
            make.height.equalTo(44)
        }
        return container
    }
    
    private func prefillData() {
        nameField.text = product.name
        skuField.text = product.sku == "Đang cập nhật" ? "" : product.sku
        priceField.text = product.price
    }
    
    @objc private func handleSave() {
        let newName = nameField.text ?? ""
        let newSKU = skuField.text ?? ""
        let newPrice = priceField.text ?? "0"
        
        // Hiển thị hiệu ứng loading (tùy chọn)
        saveButton.setTitle("Đang lưu...", for: .normal)
        saveButton.isEnabled = false
        
        // Gọi API lên Node.js
        APIManager.shared.updateProduct(id: product.id, name: newName, sku: newSKU, price: newPrice) { [weak self] success in
            guard let self = self else { return }
            
            self.saveButton.setTitle("Save Changes", for: .normal)
            self.saveButton.isEnabled = true
            
            if success {
                // Gửi dữ liệu về trang chi tiết để vẽ lại
                self.onSaveSuccess?(newName, newSKU, newPrice)
                
                let alert = UIAlertController(title: "Thành công", message: "Đã lưu vào Database!", preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default, handler: { _ in
                    self.dismiss(animated: true)
                }))
                self.present(alert, animated: true)
            } else {
                let alert = UIAlertController(title: "Lỗi", message: "Không thể lưu vào Database. Kiểm tra lại Node.js!", preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "Đã hiểu", style: .default))
                self.present(alert, animated: true)
            }
        }
    }
}
