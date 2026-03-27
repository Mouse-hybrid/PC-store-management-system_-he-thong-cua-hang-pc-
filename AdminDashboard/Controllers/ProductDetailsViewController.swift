//  Created by Nguyen on 22/3/26.

import UIKit
import SnapKit

class ProductDetailsViewController: UIViewController {
    
    private var product: Product
    var onProductUpdated: ((Product) -> Void)?
    
    // MARK: - UI Components
    private let scrollView = UIScrollView()
    private let contentView = UIView()
    
    private let nameLbl = UILabel()
    private let skuLbl = UILabel()
    private let stockValLbl = UILabel()
    private let priceValLbl = UILabel()
    private let valueValLbl = UILabel()
    
    init(product: Product) {
        self.product = product
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) { fatalError() }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = AppColors.bgMain
        setupUI()
        updateUIInfo()
    }
    
    private func setupUI() {
        let headerView = createHeader()
        view.addSubview(headerView)
        headerView.snp.makeConstraints { make in
            make.top.equalTo(view.safeAreaLayoutGuide)
            make.leading.trailing.equalToSuperview()
            make.height.equalTo(60)
        }
        
        view.addSubview(scrollView)
        scrollView.addSubview(contentView)
        
        scrollView.snp.makeConstraints { make in
            make.top.equalTo(headerView.snp.bottom)
            make.leading.trailing.equalToSuperview()
            make.bottom.equalToSuperview().offset(-80) // Chừa chỗ cho Sticky Footer
        }
        
        contentView.snp.makeConstraints { make in
            make.edges.equalToSuperview()
            make.width.equalTo(scrollView)
        }
        
        let imageArea = createImageArea()
        let infoArea = createInfoArea()
        let statsGrid = createStatsGrid()
        
        // Nút Xóa Sản Phẩm
        let deleteBtn = UIButton(type: .system)
        deleteBtn.setTitle("Xóa Sản Phẩm (Delete)", for: .normal)
        deleteBtn.setTitleColor(.systemRed, for: .normal)
        deleteBtn.titleLabel?.font = .systemFont(ofSize: 16, weight: .bold)
        deleteBtn.addTarget(self, action: #selector(confirmDelete), for: .touchUpInside)
        
        contentView.addSubview(imageArea)
        contentView.addSubview(infoArea)
        contentView.addSubview(statsGrid)
        contentView.addSubview(deleteBtn)
        
        imageArea.snp.makeConstraints { make in
            make.top.equalToSuperview().offset(10)
            make.leading.trailing.equalToSuperview().inset(16)
            make.height.equalTo(260)
        }
        
        infoArea.snp.makeConstraints { make in
            make.top.equalTo(imageArea.snp.bottom).offset(20)
            make.leading.trailing.equalToSuperview().inset(16)
        }
        
        statsGrid.snp.makeConstraints { make in
            make.top.equalTo(infoArea.snp.bottom).offset(20)
            make.leading.trailing.equalToSuperview().inset(16)
        }
        
        // Nút Xóa chốt đáy ContentView để ScrollView tính toán độ cao
        deleteBtn.snp.makeConstraints { make in
            make.top.equalTo(statsGrid.snp.bottom).offset(30)
            make.centerX.equalToSuperview()
            make.bottom.equalToSuperview().offset(-40)
        }
        
        let footerBtn = createStickyFooter()
        view.addSubview(footerBtn)
        footerBtn.snp.makeConstraints { make in
            make.leading.trailing.bottom.equalToSuperview()
            make.height.equalTo(80)
        }
    }
    
    private func updateUIInfo() {
        nameLbl.text = product.name
        skuLbl.text = "SKU: \(product.sku)"
        priceValLbl.text = product.formattedPrice
        stockValLbl.text = "\(product.realStock)"
        
        let priceNum = Double(product.price) ?? 0.0
        let totalValue = priceNum * Double(product.realStock)
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencySymbol = "₫"
        formatter.maximumFractionDigits = 0
        valueValLbl.text = formatter.string(from: NSNumber(value: totalValue)) ?? "0₫"
    }
    
    // MARK: - UI Builders
    private func createHeader() -> UIView {
        let view = UIView()
        let backBtn = UIButton(type: .system)
        backBtn.setImage(UIImage(systemName: "arrow.left"), for: .normal)
        backBtn.tintColor = AppColors.textMain
        backBtn.addTarget(self, action: #selector(handleBack), for: .touchUpInside)
        
        let titleLbl = UILabel()
        titleLbl.text = "Product Details"
        titleLbl.font = .systemFont(ofSize: 18, weight: .bold)
        titleLbl.textColor = AppColors.textMain
        
        let editBtn = UIButton(type: .system)
        editBtn.setTitle("Edit", for: .normal)
        editBtn.titleLabel?.font = .systemFont(ofSize: 16, weight: .bold)
        editBtn.setTitleColor(AppColors.primaryNeon, for: .normal)
        editBtn.addTarget(self, action: #selector(handleEdit), for: .touchUpInside)
        
        view.addSubview(backBtn)
        view.addSubview(titleLbl)
        view.addSubview(editBtn)
        
        backBtn.snp.makeConstraints { $0.leading.equalToSuperview().offset(16); $0.centerY.equalToSuperview() }
        titleLbl.snp.makeConstraints { $0.center.equalToSuperview() }
        editBtn.snp.makeConstraints { $0.trailing.equalToSuperview().offset(-16); $0.centerY.equalToSuperview() }
        
        return view
    }
    
    private func createImageArea() -> UIView {
        let imgView = UIView()
        imgView.backgroundColor = AppColors.surfaceCard
        imgView.layer.cornerRadius = 16
        imgView.clipsToBounds = true
        
        let mockIcon = UIImageView(image: UIImage(systemName: "desktopcomputer"))
        mockIcon.tintColor = AppColors.textSec.withAlphaComponent(0.3)
        mockIcon.contentMode = .scaleAspectFit
        imgView.addSubview(mockIcon)
        mockIcon.snp.makeConstraints { $0.center.equalToSuperview(); $0.size.equalTo(80) }
        
        let badge = UILabel()
        badge.text = product.realStock > 0 ? "In Stock" : "Out of Stock"
        badge.font = .systemFont(ofSize: 12, weight: .bold)
        badge.textColor = .white
        badge.backgroundColor = product.realStock > 0 ? AppColors.success : .red
        badge.layer.cornerRadius = 12
        badge.clipsToBounds = true
        badge.textAlignment = .center
        
        imgView.addSubview(badge)
        badge.snp.makeConstraints { make in
            make.top.right.equalToSuperview().inset(16)
            make.width.equalTo(70)
            make.height.equalTo(24)
        }
        return imgView
    }
    
    private func createInfoArea() -> UIView {
        let view = UIView()
        nameLbl.font = .systemFont(ofSize: 24, weight: .bold)
        nameLbl.textColor = AppColors.textMain
        nameLbl.numberOfLines = 0
        
        skuLbl.font = .systemFont(ofSize: 14, weight: .medium)
        skuLbl.textColor = AppColors.textSec
        
        let catLbl = UILabel()
        catLbl.text = "Category: \(product.catName) (\(product.brandName))"
        catLbl.font = .systemFont(ofSize: 14, weight: .medium)
        catLbl.textColor = AppColors.textSec
        
        view.addSubview(nameLbl)
        view.addSubview(skuLbl)
        view.addSubview(catLbl)
        
        nameLbl.snp.makeConstraints { $0.top.leading.trailing.equalToSuperview() }
        skuLbl.snp.makeConstraints { $0.top.equalTo(nameLbl.snp.bottom).offset(10); $0.leading.trailing.equalToSuperview() }
        catLbl.snp.makeConstraints { $0.top.equalTo(skuLbl.snp.bottom).offset(4); $0.leading.trailing.bottom.equalToSuperview() }
        return view
    }
    
    private func createStatsGrid() -> UIView {
        let stack = UIStackView()
        stack.axis = .horizontal
        stack.spacing = 12
        stack.distribution = .fillEqually
        
        let stockCard = createSmallCard(title: "STOCK", valueLabel: stockValLbl, icon: "cube.box", color: AppColors.primaryNeon)
        let priceCard = createSmallCard(title: "PRICE", valueLabel: priceValLbl, icon: "tag", color: AppColors.primaryNeon)
        let valueCard = createSmallCard(title: "VALUE", valueLabel: valueValLbl, icon: "chart.bar", color: AppColors.primaryNeon)
        
        stack.addArrangedSubview(stockCard)
        stack.addArrangedSubview(priceCard)
        stack.addArrangedSubview(valueCard)
        
        return stack
    }
    
    private func createSmallCard(title: String, valueLabel: UILabel, icon: String, color: UIColor) -> UIView {
        let card = UIView()
        card.backgroundColor = AppColors.surfaceCard
        card.layer.cornerRadius = 12
        card.layer.borderWidth = 1
        card.layer.borderColor = AppColors.textSec.withAlphaComponent(0.2).cgColor
        
        let iconView = UIImageView(image: UIImage(systemName: icon))
        iconView.tintColor = color
        
        let titleLbl = UILabel()
        titleLbl.text = title
        titleLbl.font = .systemFont(ofSize: 10, weight: .bold)
        titleLbl.textColor = AppColors.textSec
        
        valueLabel.font = .systemFont(ofSize: 16, weight: .bold)
        valueLabel.textColor = AppColors.textMain
        valueLabel.adjustsFontSizeToFitWidth = true
        
        card.addSubview(iconView)
        card.addSubview(titleLbl)
        card.addSubview(valueLabel)
        
        iconView.snp.makeConstraints { $0.top.leading.equalToSuperview().offset(12); $0.size.equalTo(18) }
        titleLbl.snp.makeConstraints { $0.centerY.equalTo(iconView); $0.leading.equalTo(iconView.snp.trailing).offset(6) }
        valueLabel.snp.makeConstraints { $0.top.equalTo(iconView.snp.bottom).offset(8); $0.leading.trailing.equalToSuperview().inset(12); $0.bottom.equalToSuperview().offset(-12) }
        return card
    }
    
    private func createStickyFooter() -> UIView {
        let footer = UIView()
        footer.backgroundColor = AppColors.bgMain.withAlphaComponent(0.95)
        
        let btn = UIButton(type: .system)
        btn.setTitle("Restock Inventory", for: .normal)
        btn.setTitleColor(.white, for: .normal)
        btn.titleLabel?.font = .systemFont(ofSize: 16, weight: .bold)
        btn.backgroundColor = AppColors.primaryNeon
        btn.layer.cornerRadius = 12
        btn.addTarget(self, action: #selector(handleRestock), for: .touchUpInside)
        
        footer.addSubview(btn)
        btn.snp.makeConstraints { make in
            make.top.equalToSuperview().offset(10)
            make.leading.trailing.equalToSuperview().inset(16)
            make.height.equalTo(50)
        }
        return footer
    }
    
    // MARK: - Actions
    @objc private func handleBack() { navigationController?.popViewController(animated: true) }
    
    @objc private func confirmDelete() {
        let alert = UIAlertController(title: "Cảnh báo!", message: "Bạn có chắc chắn muốn xóa vĩnh viễn linh kiện này?", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Hủy", style: .cancel))
        alert.addAction(UIAlertAction(title: "Xóa", style: .destructive) { [weak self] _ in
            guard let self = self else { return }
            
            APIManager.shared.deleteProduct(id: self.product.id) { success in
                if success {
                    self.onProductUpdated?(self.product) // Kích hoạt reload ở ngoài
                    self.navigationController?.popViewController(animated: true)
                } else {
                    let err = UIAlertController(title: "Lỗi", message: "Không thể xóa. Vui lòng kiểm tra lại server.", preferredStyle: .alert)
                    err.addAction(UIAlertAction(title: "OK", style: .default))
                    self.present(err, animated: true)
                }
            }
        })
        present(alert, animated: true)
    }
    
    @objc private func handleEdit() {
        let editVC = EditProductViewController(product: product)
        editVC.onSaveSuccess = { [weak self] newName, newSKU, newPrice in
            guard let self = self else { return }
            self.product = Product(
                id: self.product.id, name: newName, price: newPrice, sku: newSKU,
                realStock: self.product.realStock, catName: self.product.catName, brandName: self.product.brandName
            )
            self.updateUIInfo()
            self.onProductUpdated?(self.product)
        }
        if let sheet = editVC.sheetPresentationController { sheet.detents = [.medium(), .large()] }
        present(editVC, animated: true)
    }
    
    @objc private func handleRestock() {
        let alert = UIAlertController(title: "Nhập thêm hàng", message: "Nhập số lượng:", preferredStyle: .alert)
        alert.addTextField { textField in
            textField.keyboardType = .numberPad
            textField.placeholder = "Ví dụ: 10"
        }
        let cancelAction = UIAlertAction(title: "Hủy", style: .cancel)
        let addAction = UIAlertAction(title: "Nhập", style: .default) { [weak self] _ in
            guard let self = self, let text = alert.textFields?.first?.text, let qty = Int(text), qty > 0 else { return }
            
            APIManager.shared.restockProduct(id: self.product.id, addedQuantity: qty) { success in
                if success {
                    let newStock = self.product.realStock + qty
                    self.product = Product(
                        id: self.product.id, name: self.product.name, price: self.product.price, sku: self.product.sku,
                        realStock: newStock, catName: self.product.catName, brandName: self.product.brandName
                    )
                    self.updateUIInfo()
                    self.onProductUpdated?(self.product)
                    
                    let successAlert = UIAlertController(title: "Thành công", message: "Đã thêm \(qty) sản phẩm!", preferredStyle: .alert)
                    successAlert.addAction(UIAlertAction(title: "OK", style: .default))
                    self.present(successAlert, animated: true)
                } else {
                    // Xử lý báo lỗi
                }
            }
        }
        alert.addAction(cancelAction)
        alert.addAction(addAction)
        present(alert, animated: true)
    }
}
