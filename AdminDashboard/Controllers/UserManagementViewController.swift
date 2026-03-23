//
//  UserManagementViewController.swift
//  AdminDashboard
//
//  Created by khoa on 21/3/26.
//

import UIKit
import SnapKit

struct User: Codable {
    let id: Int
    let username: String
    let email: String
    let role: String
    let isActive: Int // Hoặc Bool tùy database trả về (is_active)
    
    enum CodingKeys: String, CodingKey {
        case id = "user_id" // Khớp với DB của bạn
        case username, email, role
        case isActive = "is_active"
    }
}

class UserManagementViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    
    private let tableView = UITableView()
    private var users: [User] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = AppColors.bgMain
        setupUI()
        loadUsers()
    }
    
    private func setupUI() {
        let titleLbl = UILabel()
        titleLbl.text = "User Management"
        titleLbl.font = .systemFont(ofSize: 20, weight: .bold)
        titleLbl.textColor = AppColors.textMain
        
        view.addSubview(titleLbl)
        titleLbl.snp.makeConstraints { make in
            make.top.equalTo(view.safeAreaLayoutGuide).offset(10)
            make.centerX.equalToSuperview()
        }
        
        view.addSubview(tableView)
        tableView.backgroundColor = .clear
        tableView.separatorStyle = .none
        tableView.delegate = self
        tableView.dataSource = self
        tableView.register(UserCell.self, forCellReuseIdentifier: "UserCell")
        
        tableView.snp.makeConstraints { make in
            make.top.equalTo(titleLbl.snp.bottom).offset(20)
            make.leading.trailing.bottom.equalToSuperview()
        }
    }
    
    private func loadUsers() {
        // TẠO HÀM NÀY TRONG APIManager
        APIManager.shared.fetchUsers { [weak self] result in
            DispatchQueue.main.async {
                if case .success(let fetchedUsers) = result {
                    self?.users = fetchedUsers
                    self?.tableView.reloadData()
                }
            }
        }
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int { return users.count }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "UserCell", for: indexPath) as! UserCell
        let user = users[indexPath.row]
        cell.configure(with: user)
        
        // Bắt sự kiện bấm nút Block
        cell.onBlockTapped = { [weak self] in
            self?.blockUser(user)
        }
        return cell
    }
    
    private func blockUser(_ user: User) {
        let alert = UIAlertController(title: "Khóa tài khoản?", message: "Khóa \(user.username)?", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Hủy", style: .cancel))
        alert.addAction(UIAlertAction(title: "Khóa", style: .destructive) { _ in
            // Gọi API Khóa User ở đây
            print("Đã gọi API khóa user ID: \(user.id)")
        })
        present(alert, animated: true)
    }
}

// MARK: - User Cell
class UserCell: UITableViewCell {
    private let container = UIView()
    private let nameLbl = UILabel()
    private let emailLbl = UILabel()
    private let roleBadge = UILabel()
    private let blockBtn = UIButton(type: .system)
    
    var onBlockTapped: (() -> Void)?
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        backgroundColor = .clear; selectionStyle = .none
        
        container.backgroundColor = AppColors.surfaceCard
        container.layer.cornerRadius = 12
        contentView.addSubview(container)
        container.snp.makeConstraints { $0.edges.equalToSuperview().inset(UIEdgeInsets(top: 6, left: 16, bottom: 6, right: 16)) }
        
        let avatar = UIImageView(image: UIImage(systemName: "person.circle.fill"))
        avatar.tintColor = .gray
        
        nameLbl.font = .systemFont(ofSize: 16, weight: .bold); nameLbl.textColor = AppColors.textMain
        emailLbl.font = .systemFont(ofSize: 12); emailLbl.textColor = AppColors.textSec
        
        roleBadge.font = .systemFont(ofSize: 10, weight: .bold)
        roleBadge.textColor = .white; roleBadge.layer.cornerRadius = 6; roleBadge.clipsToBounds = true
        roleBadge.textAlignment = .center
        
        blockBtn.setImage(UIImage(systemName: "hand.raised.fill"), for: .normal)
        blockBtn.tintColor = .systemRed
        blockBtn.addTarget(self, action: #selector(handleBlock), for: .touchUpInside)
        
        container.addSubview(avatar); container.addSubview(nameLbl); container.addSubview(emailLbl)
        container.addSubview(roleBadge); container.addSubview(blockBtn)
        
        avatar.snp.makeConstraints { $0.leading.equalToSuperview().offset(15); $0.centerY.equalToSuperview(); $0.size.equalTo(40) }
        nameLbl.snp.makeConstraints { $0.top.equalToSuperview().offset(15); $0.leading.equalTo(avatar.snp.trailing).offset(12) }
        emailLbl.snp.makeConstraints { $0.top.equalTo(nameLbl.snp.bottom).offset(2); $0.leading.equalTo(nameLbl); $0.bottom.equalToSuperview().offset(-15) }
        roleBadge.snp.makeConstraints { $0.centerY.equalTo(nameLbl); $0.leading.equalTo(nameLbl.snp.trailing).offset(8); $0.width.equalTo(50); $0.height.equalTo(16) }
        blockBtn.snp.makeConstraints { $0.trailing.equalToSuperview().offset(-15); $0.centerY.equalToSuperview(); $0.size.equalTo(30) }
    }
    
    @objc private func handleBlock() { onBlockTapped?() }
    
    func configure(with user: User) {
        nameLbl.text = user.username
        emailLbl.text = user.email
        roleBadge.text = user.role.uppercased()
        roleBadge.backgroundColor = user.role == "ADMIN" ? .systemPurple : (user.role == "STAFF" ? .systemBlue : .systemGray)
        
        if user.isActive == 0 {
            container.alpha = 0.5
            blockBtn.isHidden = true
        } else {
            container.alpha = 1.0
            blockBtn.isHidden = false
        }
    }
    required init?(coder: NSCoder) { fatalError() }
}
