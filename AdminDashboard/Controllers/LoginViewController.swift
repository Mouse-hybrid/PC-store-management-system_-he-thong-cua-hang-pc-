import UIKit
import SnapKit

class LoginViewController: UIViewController {
    
    //  Đổi thành usernameField
    private let usernameField = UITextField()
    private let passField = UITextField()
    private let loginBtn = UIButton(type: .system)
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = AppColors.bgMain
        setupUI()
    }
    
    private func setupUI() {
        // Logo
        let logoView = UIImageView(image: UIImage(systemName: "desktopcomputer"))
        logoView.tintColor = AppColors.primaryNeon
        logoView.contentMode = .scaleAspectFit
        
        // Tiêu đề
        let titleLbl = UILabel()
        titleLbl.text = "PC Store Admin"
        titleLbl.font = .systemFont(ofSize: 28, weight: .bold)
        titleLbl.textColor = AppColors.textMain
        titleLbl.textAlignment = .center
        
        let subLbl = UILabel()
        subLbl.text = "Đăng nhập để quản lý hệ thống"
        subLbl.font = .systemFont(ofSize: 14)
        subLbl.textColor = AppColors.textSec
        subLbl.textAlignment = .center
        
        // 👉 Đổi placeholder thành "Username" và icon thành "person.fill"
        setupTextField(usernameField, placeholder: "Username", icon: "person.fill")
        setupTextField(passField, placeholder: "Mật khẩu", icon: "lock.fill")
        passField.isSecureTextEntry = true
        
        // Nút Đăng nhập
        loginBtn.setTitle("ĐĂNG NHẬP", for: .normal)
        loginBtn.setTitleColor(.white, for: .normal)
        loginBtn.titleLabel?.font = .systemFont(ofSize: 16, weight: .bold)
        loginBtn.backgroundColor = AppColors.primaryNeon
        loginBtn.layer.cornerRadius = 12
        loginBtn.addTarget(self, action: #selector(handleLogin), for: .touchUpInside)
        
        view.addSubview(logoView); view.addSubview(titleLbl); view.addSubview(subLbl)
        view.addSubview(usernameField); view.addSubview(passField); view.addSubview(loginBtn)
        
        logoView.snp.makeConstraints { make in
            make.top.equalTo(view.safeAreaLayoutGuide).offset(80)
            make.centerX.equalToSuperview()
            make.size.equalTo(80)
        }
        titleLbl.snp.makeConstraints { make in
            make.top.equalTo(logoView.snp.bottom).offset(20)
            make.leading.trailing.equalToSuperview().inset(20)
        }
        subLbl.snp.makeConstraints { make in
            make.top.equalTo(titleLbl.snp.bottom).offset(8)
            make.leading.trailing.equalToSuperview().inset(20)
        }
        usernameField.snp.makeConstraints { make in
            make.top.equalTo(subLbl.snp.bottom).offset(50)
            make.leading.trailing.equalToSuperview().inset(20)
            make.height.equalTo(50)
        }
        passField.snp.makeConstraints { make in
            make.top.equalTo(usernameField.snp.bottom).offset(20)
            make.leading.trailing.equalToSuperview().inset(20)
            make.height.equalTo(50)
        }
        loginBtn.snp.makeConstraints { make in
            make.top.equalTo(passField.snp.bottom).offset(40)
            make.leading.trailing.equalToSuperview().inset(20)
            make.height.equalTo(55)
        }
    }
    
    private func setupTextField(_ tf: UITextField, placeholder: String, icon: String) {
        tf.placeholder = placeholder
        tf.backgroundColor = AppColors.surfaceCard
        tf.layer.cornerRadius = 12
        tf.layer.borderWidth = 1
        tf.layer.borderColor = AppColors.textSec.withAlphaComponent(0.2).cgColor
        tf.textColor = AppColors.textMain
        tf.autocapitalizationType = .none
        
        let iconView = UIImageView(image: UIImage(systemName: icon))
        iconView.tintColor = AppColors.textSec
        let iconContainer = UIView(frame: CGRect(x: 0, y: 0, width: 45, height: 20))
        iconView.frame = CGRect(x: 15, y: 0, width: 20, height: 20)
        iconContainer.addSubview(iconView)
        
        tf.leftView = iconContainer
        tf.leftViewMode = .always
    }
    
    @objc private func handleLogin() {
        guard let username = usernameField.text, !username.isEmpty,
              let pass = passField.text, !pass.isEmpty else {
            showAlert("Vui lòng nhập đầy đủ thông tin")
            return
        }
        
        loginBtn.setTitle("Đang xử lý...", for: .normal)
        loginBtn.isEnabled = false
        
        APIManager.shared.login(username: username, pass: pass) { [weak self] success, errorMsg in
            self?.loginBtn.setTitle("ĐĂNG NHẬP", for: .normal)
            self?.loginBtn.isEnabled = true
            
            if success {
                // 👉 KIỂM TRA QUYỀN ĐỂ CHUYỂN TRANG
                let role = APIManager.shared.currentUserRole?.uppercased() ?? "STAFF"
                let rootVC: UIViewController
                
                if role == "ADMIN" {
                    rootVC = DashboardViewController() // Trùm cuối vào đây
                } else {
                    rootVC = StaffDashboardViewController() // Nhân viên vào đây
                }
                
                let dashboardNav = UINavigationController(rootViewController: rootVC)
                
                if let window = UIApplication.shared.windows.first {
                    window.rootViewController = dashboardNav
                    UIView.transition(with: window, duration: 0.3, options: .transitionCrossDissolve, animations: nil, completion: nil)
                }
            } else {
                self?.showAlert(errorMsg ?? "Lỗi kết nối")
            }
        }
    }
    private func showAlert(_ msg: String) {
            let alert = UIAlertController(title: "Thông báo", message: msg, preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default))
            present(alert, animated: true)
        }
}
