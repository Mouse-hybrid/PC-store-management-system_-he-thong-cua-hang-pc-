import Foundation
import Alamofire

// 👉 1. TẠO KHUÔN ĐỂ BÓC LỚP VỎ "data" CỦA NODE.JS
struct APIResponse<T: Codable>: Codable {
    let status: String
    let message: String?
    let data: T
}

class APIManager {
    static let shared = APIManager()
    private let baseURL = "https://192.168.200.1:3443/api/v1"
    private let session: Session
    
    // MARK: - Quản lý Token & Role (Lưu trong điện thoại)
    var currentToken: String? {
        return UserDefaults.standard.string(forKey: "jwt_token")
    }
    
    var currentUserRole: String? {
        return UserDefaults.standard.string(forKey: "user_role")
    }
    
    // Tự động gắn Token vào mọi API
    private var authHeaders: HTTPHeaders {
        if let token = currentToken {
            return ["Authorization": "Bearer \(token)"]
        }
        return []
    }
    
    private init() {
        let manager = ServerTrustManager(evaluators: ["192.168.200.1": DisabledTrustEvaluator()])
        self.session = Session(serverTrustManager: manager)
    }
    
    // MARK: - Xác Thực (Auth)
    
    // Tạo Model riêng biệt và dễ dãi (Optional) để không bị sập App khi Decode
    struct LoginUser: Codable {
        let role: String?
    }
    
    struct LoginData: Codable {
        let accessToken: String?
        let token: String?
        let role: String?
        let user: LoginUser?
    }
    
    struct LoginResponse: Codable {
        let status: String
        let message: String?
        let data: LoginData?
    }
    
    func login(username: String, pass: String, completion: @escaping (Bool, String?) -> Void) {
        let params: [String: Any] = ["username": username, "password": pass]
        
        session.request("\(baseURL)/auth/login", method: .post, parameters: params, encoding: JSONEncoding.default)
            .responseString { response in
                // In ra màn hình console để biết chính xác Server trả về cái gì
                print("RAW LOGIN RESPONSE: \(response.value ?? "Rỗng")")
            }
            .validate()
            .responseDecodable(of: LoginResponse.self) { response in
                switch response.result {
                case .success(let res):
                    // Bắt thông minh: Lấy accessToken, nếu không có thì lấy token
                    let token = res.data?.accessToken ?? res.data?.token ?? ""
                    // Bắt thông minh: Lấy role trong user, nếu không có thì lấy thẳng role
                    let role = res.data?.user?.role ?? res.data?.role ?? "STAFF"
                    
                    if !token.isEmpty {
                        UserDefaults.standard.set(token, forKey: "jwt_token")
                        UserDefaults.standard.set(role, forKey: "user_role")
                        completion(true, nil)
                    } else {
                        completion(false, "Không lấy được Thẻ ra vào (Token) từ Server")
                    }
                case .failure(let error):
                    print("❌ LỖI DECODE LOGIN: \(error)")
                    completion(false, "Sai Username hoặc mật khẩu!")
                }
            }
    }
    
    func logout() {
        UserDefaults.standard.removeObject(forKey: "jwt_token")
        UserDefaults.standard.removeObject(forKey: "user_role")
    }
    
    // MARK: - Doanh thu
    func fetchDailyRevenue(completion: @escaping (Result<[DailyRevenue], AFError>) -> Void) {
        session.request("\(baseURL)/reports/revenue", method: .get, headers: authHeaders)
            .validate()
            .responseDecodable(of: APIResponse<[DailyRevenue]>.self) { response in
                switch response.result {
                case .success(let apiResponse):
                    completion(.success(apiResponse.data))
                case .failure(let error):
                    completion(.failure(error))
                }
            }
    }
    
    // MARK: - Đơn hàng
    func fetchOrderStats(completion: @escaping (Result<OrderStats, AFError>) -> Void) {
        session.request("\(baseURL)/reports/order-stats", method: .get, headers: authHeaders)
            .validate()
            .responseDecodable(of: APIResponse<OrderStats>.self) { response in
                switch response.result {
                case .success(let apiResponse):
                    completion(.success(apiResponse.data))
                case .failure(let error):
                    completion(.failure(error))
                }
            }
    }
    
    // MARK: - Quản lý Sản phẩm
    func fetchProducts(completion: @escaping (Result<[Product], AFError>) -> Void) {
        session.request("\(baseURL)/products", method: .get, headers: authHeaders)
            .validate()
            .responseDecodable(of: APIResponse<[Product]>.self) { response in
                switch response.result {
                case .success(let apiResponse):
                    completion(.success(apiResponse.data))
                case .failure(let error):
                    completion(.failure(error))
                }
            }
    }
    
    // MARK: - Tìm kiếm Sản phẩm
    func searchProducts(keyword: String, completion: @escaping (Result<[Product], AFError>) -> Void) {
        let parameters: [String: String] = ["q": keyword]
        
        session.request("\(baseURL)/products/search", method: .get, parameters: parameters, headers: authHeaders)
            .validate()
            .responseDecodable(of: APIResponse<[Product]>.self) { response in
                switch response.result {
                case .success(let apiResponse):
                    completion(.success(apiResponse.data))
                case .failure(let error):
                    completion(.failure(error))
                }
            }
    }
    
    // MARK: - Cập nhật & Nhập kho (Gửi lên Backend)
    
    func updateProduct(id: Int, name: String, sku: String, price: String, completion: @escaping (Bool) -> Void) {
        let parameters: [String: Any] = [
            "pro_name": name,
            "pro_sku": sku,
            "pro_price": price
        ]
        
        session.request("\(baseURL)/products/\(id)", method: .put, parameters: parameters, encoding: JSONEncoding.default, headers: authHeaders)
            .validate()
            .response { response in
                switch response.result {
                case .success:
                    completion(true)
                case .failure(let error):
                    print("❌ Lỗi Update API: \(error)")
                    completion(false)
                }
            }
    }
    
    func restockProduct(id: Int, addedQuantity: Int, completion: @escaping (Bool) -> Void) {
        let parameters: [String: Any] = [
            "quantity": addedQuantity
        ]
        
        session.request("\(baseURL)/products/\(id)/restock", method: .post, parameters: parameters, encoding: JSONEncoding.default, headers: authHeaders)
            .validate()
            .response { response in
                completion(response.error == nil)
            }
    }
    
    func deleteProduct(id: Int, completion: @escaping (Bool) -> Void) {
        session.request("\(baseURL)/products/\(id)", method: .delete, headers: authHeaders)
            .validate()
            .response { response in
                completion(response.error == nil)
            }
    }
    
    func addProduct(name: String, sku: String, price: String, qty: Int, catId: Int, brandId: Int, completion: @escaping (Bool) -> Void) {
        let params: [String: Any] = [
            "name": name,
            "sku": sku,
            "price": price,
            "qty": qty,
            "catId": catId,
            "brandId": brandId,
            "description": "New product added from iOS"
        ]
        
        session.request("\(baseURL)/products/import", method: .post, parameters: params, encoding: JSONEncoding.default, headers: authHeaders)
            .validate()
            .response { response in
                completion(response.error == nil)
            }
    }
    
    // MARK: - Quản lý Người Dùng (Users)
    struct UserResponse: Codable {
        let status: String
        let data: [User]
    }
    
    func fetchUsers(completion: @escaping (Result<[User], Error>) -> Void) {
        session.request("\(baseURL)/users", method: .get, headers: authHeaders)
            .validate()
            .responseDecodable(of: UserResponse.self) { response in
                switch response.result {
                case .success(let userResponse):
                    completion(.success(userResponse.data))
                case .failure(let error):
                    print("Lỗi tải danh sách Users: \(error)")
                    completion(.failure(error))
                }
            }
    }
    
    // MARK: - Quản lý Đơn hàng
    func fetchOrders(completion: @escaping (Result<[Order], Error>) -> Void) {
        session.request("\(baseURL)/orders", method: .get, headers: authHeaders)
            .validate()
            .responseDecodable(of: OrderResponse.self) { response in
                switch response.result {
                case .success(let orderResponse):
                    // Bóc lớp "data" tùy theo cấu trúc OrderResponse của bạn
                    completion(.success(orderResponse.data))
                case .failure(let error):
                    print("Lỗi tải đơn hàng: \(error)")
                    completion(.failure(error))
                }
            }
    }
    
    // MARK: - Tài chính & Thanh toán (Finance)
    func fetchFinanceOverview(completion: @escaping (Result<FinanceData, Error>) -> Void) {
        session.request("\(baseURL)/reports/finance-overview", method: .get, headers: authHeaders)
            .validate()
            .responseDecodable(of: FinanceResponse.self) { response in
                switch response.result {
                case .success(let res): completion(.success(res.data))
                case .failure(let error): completion(.failure(error))
                }
            }
    }
    
    func fetchRecentTransactions(completion: @escaping (Result<[Transaction], Error>) -> Void) {
        session.request("\(baseURL)/reports/recent-transactions", method: .get, headers: authHeaders)
            .validate()
            .responseDecodable(of: TransactionResponse.self) { response in
                switch response.result {
                case .success(let res): completion(.success(res.data))
                case .failure(let error): completion(.failure(error))
                }
            }
    }
    
    // API Cập nhật trạng thái đơn hàng
    func verifyOrder(orderId: Int, completion: @escaping (Bool) -> Void) {
        session.request("\(baseURL)/orders/\(orderId)/verify", method: .patch, headers: authHeaders)
            .validate()
            .response { response in
                completion(response.error == nil)
            }
    }
    
    // 2. API Cập nhật trạng thái chung (Đóng gói, Giao hàng...)
    func updateOrderStatus(orderId: Int, newStatus: String, completion: @escaping (Bool) -> Void) {
        let params: [String: Any] = ["status": newStatus]
        
        session.request("\(baseURL)/orders/\(orderId)/status", method: .patch, parameters: params, encoding: JSONEncoding.default, headers: authHeaders)
            .validate()
            .response { response in
                completion(response.error == nil)
            }
    }
    
    // API Hủy đơn hàng
    func cancelOrder(orderId: Int, completion: @escaping (Bool) -> Void) {
        session.request("\(baseURL)/orders/\(orderId)/cancel", method: .patch, headers: authHeaders)
            .validate()
            .response { response in
                completion(response.error == nil)
            }
    }
}
    
    
