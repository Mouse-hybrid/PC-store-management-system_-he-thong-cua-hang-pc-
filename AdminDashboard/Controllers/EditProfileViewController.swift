import UIKit
import SnapKit
import Kingfisher

class EditProfileViewController: UIViewController {

    // MARK: - UI Components
    private let scrollView = UIScrollView()
    private let contentView = UIView()
    
    // Khối Avatar
    private let avatarImageView: UIImageView = {
        let iv = UIImageView()
        iv.image = UIImage(systemName: "person.circle.fill") // Ảnh mặc định
        iv.tintColor = .systemGray4
        iv.contentMode = .scaleAspectFill
        iv.layer.cornerRadius = 50
        iv.clipsToBounds = true
        return iv
    }()
    
    private let cameraButton: UIButton = {
        let btn = UIButton(type: .system)
        btn.setImage(UIImage(systemName: "camera.circle.fill"), for: .normal)
        btn.tintColor = .white
        btn.backgroundColor = .systemBlue
        btn.layer.cornerRadius = 15
        return btn
    }()
    
    private let nameLabel: UILabel = {
        let lbl = UILabel()
        lbl.text = "Alex Johnson"
        lbl.font = .systemFont(ofSize: 22, weight: .bold)
        lbl.textAlignment = .center
        return lbl
    }()
    
    private let changePhotoLabel: UILabel = {
        let lbl = UILabel()
        lbl.text = "Change Profile Photo"
        lbl.font = .systemFont(ofSize: 14, weight: .medium)
        lbl.textColor = .systemBlue
        lbl.textAlignment = .center
        return lbl
    }()
    
    // Khối Form nhập liệu
    private let sectionTitleLabel: UILabel = {
        let lbl = UILabel()
        lbl.text = "Personal Information"
        lbl.font = .systemFont(ofSize: 18, weight: .bold)
        return lbl
    }()
    
    private let formStackView: UIStackView = {
        let stack = UIStackView()
        stack.axis = .vertical
        stack.spacing = 16
        return stack
    }()
    
    // Khối Nút bấm
    private let saveButton: UIButton = {
        let btn = UIButton(type: .system)
        btn.setTitle("Save Changes", for: .normal)
        btn.setImage(UIImage(systemName: "externaldrive.fill"), for: .normal)
        btn.tintColor = .white
        btn.backgroundColor = UIColor(red: 0.05, green: 0.4, blue: 0.85, alpha: 1.0) // Màu xanh đậm
        btn.layer.cornerRadius = 10
        btn.titleLabel?.font = .systemFont(ofSize: 16, weight: .semibold)
        btn.imageEdgeInsets = UIEdgeInsets(top: 0, left: -10, bottom: 0, right: 0)
        return btn
    }()
    
    private let cancelButton: UIButton = {
        let btn = UIButton(type: .system)
        btn.setTitle("Cancel", for: .normal)
        btn.setTitleColor(.gray, for: .normal)
        btn.backgroundColor = UIColor(white: 0.95, alpha: 1.0)
        btn.layer.cornerRadius = 10
        btn.titleLabel?.font = .systemFont(ofSize: 16, weight: .semibold)
        return btn
    }()

    // MARK: - Lifecycle
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(white: 0.98, alpha: 1.0) // Màu nền xám cực nhạt
        title = "Edit Profile"
        
        setupUI()
        setupConstraints()
    }
    
    // MARK: - Setup UI
    private func setupUI() {
        view.addSubview(scrollView)
        scrollView.addSubview(contentView)
        
        // Thêm các thành phần vào contentView
        contentView.addSubview(avatarImageView)
        contentView.addSubview(cameraButton)
        contentView.addSubview(nameLabel)
        contentView.addSubview(changePhotoLabel)
        contentView.addSubview(sectionTitleLabel)
        contentView.addSubview(formStackView)
        contentView.addSubview(saveButton)
        contentView.addSubview(cancelButton)
        
        // Tạo các trường nhập liệu và đưa vào StackView
        let nameField = createFormField(title: "Full Name", icon: "person", placeholder: "Alex Johnson")
        let emailField = createFormField(title: "Email Address", icon: "envelope", placeholder: "alex.johnson@example.com")
        let phoneField = createFormField(title: "Phone Number", icon: "phone", placeholder: "+1 (555) 000-1234")
        let locationField = createFormField(title: "Location / Address", icon: "mappin.and.ellipse", placeholder: "123 Designer St, San Francisco")
        
        formStackView.addArrangedSubview(nameField)
        formStackView.addArrangedSubview(emailField)
        formStackView.addArrangedSubview(phoneField)
        formStackView.addArrangedSubview(locationField)
        
        // --- 1. SỰ KIỆN ẨN BÀN PHÍM ---
        let tapOutside = UITapGestureRecognizer(target: self, action: #selector(dismissKeyboard))
        view.addGestureRecognizer(tapOutside)
        
        // --- 2. SỰ KIỆN BẤM CHỌN ẢNH ---
        // Bật cờ cho phép tương tác (Vì ImageView và Label mặc định không cho bấm)
        avatarImageView.isUserInteractionEnabled = true
        changePhotoLabel.isUserInteractionEnabled = true
        
        // Gán sự kiện chạm cho Avatar
        let avatarTap = UITapGestureRecognizer(target: self, action: #selector(changePhotoTapped))
        avatarImageView.addGestureRecognizer(avatarTap)
        
        // Gán sự kiện chạm cho dòng chữ xanh
        let labelTap = UITapGestureRecognizer(target: self, action: #selector(changePhotoTapped))
        changePhotoLabel.addGestureRecognizer(labelTap)
        
        // Gán sự kiện cho nút Camera
        cameraButton.addTarget(self, action: #selector(changePhotoTapped), for: .touchUpInside)
    }
    
    // MARK: - Setup Constraints (SnapKit)
    private func setupConstraints() {
        scrollView.snp.makeConstraints { make in
            make.edges.equalTo(view.safeAreaLayoutGuide)
        }
        
        contentView.snp.makeConstraints { make in
            make.edges.equalToSuperview()
            make.width.equalTo(scrollView) // Chốt chiều rộng để cuộn dọc
        }
        
        avatarImageView.snp.makeConstraints { make in
            make.top.equalToSuperview().offset(30)
            make.centerX.equalToSuperview()
            make.width.height.equalTo(100)
        }
        
        cameraButton.snp.makeConstraints { make in
            make.bottom.trailing.equalTo(avatarImageView)
            make.width.height.equalTo(30)
        }
        
        nameLabel.snp.makeConstraints { make in
            make.top.equalTo(avatarImageView.snp.bottom).offset(15)
            make.centerX.equalToSuperview()
        }
        
        changePhotoLabel.snp.makeConstraints { make in
            make.top.equalTo(nameLabel.snp.bottom).offset(5)
            make.centerX.equalToSuperview()
        }
        
        sectionTitleLabel.snp.makeConstraints { make in
            make.top.equalTo(changePhotoLabel.snp.bottom).offset(30)
            make.leading.equalToSuperview().offset(20)
        }
        
        formStackView.snp.makeConstraints { make in
            make.top.equalTo(sectionTitleLabel.snp.bottom).offset(15)
            make.leading.trailing.equalToSuperview().inset(20)
        }
        
        saveButton.snp.makeConstraints { make in
            make.top.equalTo(formStackView.snp.bottom).offset(40)
            make.leading.trailing.equalToSuperview().inset(20)
            make.height.equalTo(50)
        }
        
        cancelButton.snp.makeConstraints { make in
            make.top.equalTo(saveButton.snp.bottom).offset(15)
            make.leading.trailing.equalToSuperview().inset(20)
            make.height.equalTo(50)
            make.bottom.equalToSuperview().offset(-30) // Chốt đáy của ScrollView
        }
    }
    
    // MARK: - Helper function tạo Form Field
    private func createFormField(title: String, icon: String, placeholder: String) -> UIView {
        let container = UIView()
        
        let titleLabel = UILabel()
        titleLabel.text = title
        titleLabel.font = .systemFont(ofSize: 13, weight: .bold)
        titleLabel.textColor = .darkGray
        
        let textFieldContainer = UIView()
        textFieldContainer.backgroundColor = .white
        textFieldContainer.layer.cornerRadius = 8
        textFieldContainer.layer.borderWidth = 1
        textFieldContainer.layer.borderColor = UIColor.systemGray5.cgColor
        
        let iconImageView = UIImageView(image: UIImage(systemName: icon))
        iconImageView.tintColor = .gray
        iconImageView.contentMode = .scaleAspectFit
        
        let textField = UITextField()
        textField.placeholder = placeholder
        textField.font = .systemFont(ofSize: 15)
        
        container.addSubview(titleLabel)
        container.addSubview(textFieldContainer)
        textFieldContainer.addSubview(iconImageView)
        textFieldContainer.addSubview(textField)
        
        titleLabel.snp.makeConstraints { make in
            make.top.leading.trailing.equalToSuperview()
        }
        
        textFieldContainer.snp.makeConstraints { make in
            make.top.equalTo(titleLabel.snp.bottom).offset(8)
            make.leading.trailing.bottom.equalToSuperview()
            make.height.equalTo(48)
        }
        
        iconImageView.snp.makeConstraints { make in
            make.leading.equalToSuperview().offset(15)
            make.centerY.equalToSuperview()
            make.width.height.equalTo(20)
        }
        
        textField.snp.makeConstraints { make in
            make.leading.equalTo(iconImageView.snp.trailing).offset(10)
            make.trailing.equalToSuperview().offset(-15)
            make.top.bottom.equalToSuperview()
        }
        
        return container
    }
    
    // MARK: - Actions (Hàm xử lý sự kiện)
    @objc private func dismissKeyboard() {
        view.endEditing(true) // Thu hồi bàn phím ảo
    }
    
    @objc private func changePhotoTapped() {
        // Mở thư viện ảnh
        let imagePicker = UIImagePickerController()
        imagePicker.delegate = self
        imagePicker.sourceType = .photoLibrary
        imagePicker.allowsEditing = true // Cho phép crop ảnh
        
        present(imagePicker, animated: true, completion: nil)
    }
}

// MARK: - Image Picker Delegate
extension EditProfileViewController: UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
        // Lấy ảnh đã crop (vuông) hoặc ảnh gốc
        if let selectedImage = info[.editedImage] as? UIImage {
            avatarImageView.image = selectedImage
        } else if let originalImage = info[.originalImage] as? UIImage {
            avatarImageView.image = originalImage
        }
        
        picker.dismiss(animated: true, completion: nil)
    }
    
    func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
        picker.dismiss(animated: true, completion: nil)
    }
}
