import Foundation
import Alamofire

struct APIResponse<T: Codable>: Codable {
    let status: String
    let message: String?
    let data: T
}

// 👉 ĐÃ THÊM: Model để hứng dữ liệu Category và Brand từ DB
struct CategoryModel: Codable {
    let id: Int
    let name: String
    enum CodingKeys: String, CodingKey {
        case id = "category_id"
        case name = "cat_name"
    }
}

struct BrandModel: Codable {
    let id: Int
    let name: String
    enum CodingKeys: String, CodingKey {
        case id = "brand_id"
        case name = "brand_name"
    }
}

class APIManager {
    static let shared = APIManager()
    private let baseURL = "https://192.168.200.1:3443/api/v1"
    private let session: Session
    
    var currentToken: String? {
        return UserDefaults.standard.string(forKey: "jwt_token")
    }
    
    var currentUserRole: String? {
        return UserDefaults.standard.string(forKey: "user_role")
    }
    
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
    
    // MARK: - Auth
    struct LoginUser: Codable { let role: String? }
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
            .validate()
            .responseDecodable(of: LoginResponse.self) { response in
                switch response.result {
                case .success(let res):
                    let token = res.data?.accessToken ?? res.data?.token ?? ""
                    let role = res.data?.user?.role ?? res.data?.role ?? "STAFF"
                    if !token.isEmpty {
                        UserDefaults.standard.set(token, forKey: "jwt_token")
                        UserDefaults.standard.set(role, forKey: "user_role")
                        completion(true, nil)
                    } else {
                        completion(false, "Không lấy được Token")
                    }
                case .failure:
                    completion(false, "Sai Username hoặc mật khẩu!")
                }
            }
    }
    
    func logout() {
        UserDefaults.standard.removeObject(forKey: "jwt_token")
        UserDefaults.standard.removeObject(forKey: "user_role")
    }
    
    // MARK: - Reports
    func fetchDailyRevenue(completion: @escaping (Result<[DailyRevenue], AFError>) -> Void) {
        session.request("\(baseURL)/reports/revenue", method: .get, headers: authHeaders)
            .validate().responseDecodable(of: APIResponse<[DailyRevenue]>.self) { res in
                switch res.result {
                case .success(let api): completion(.success(api.data))
                case .failure(let err): completion(.failure(err))
                }
            }
    }
    
    func fetchOrderStats(completion: @escaping (Result<OrderStats, AFError>) -> Void) {
        session.request("\(baseURL)/reports/order-stats", method: .get, headers: authHeaders)
            .validate().responseDecodable(of: APIResponse<OrderStats>.self) { res in
                switch res.result {
                case .success(let api): completion(.success(api.data))
                case .failure(let err): completion(.failure(err))
                }
            }
    }
    
    // MARK: - Dropdown Data (Categories & Brands)
    // 👉 ĐÃ THÊM: Gọi API lấy danh sách Danh mục
    func fetchCategories(completion: @escaping (Result<[CategoryModel], Error>) -> Void) {
        session.request("\(baseURL)/products/catalog/categories", method: .get, headers: authHeaders)
            .validate()
            .responseDecodable(of: APIResponse<[CategoryModel]>.self) { response in
                switch response.result {
                case .success(let res): completion(.success(res.data))
                case .failure(let err): completion(.failure(err))
                }
            }
    }
    
    // 👉 ĐÃ SỬA URL: Thêm /products/catalog/
    func fetchBrands(completion: @escaping (Result<[BrandModel], Error>) -> Void) {
        session.request("\(baseURL)/products/catalog/brands", method: .get, headers: authHeaders)
            .validate()
            .responseDecodable(of: APIResponse<[BrandModel]>.self) { response in
                switch response.result {
                case .success(let res): completion(.success(res.data))
                case .failure(let err): completion(.failure(err))
                }
            }
    }
    
    // MARK: - Products
    func fetchProducts(completion: @escaping (Result<[Product], AFError>) -> Void) {
        session.request("\(baseURL)/products", method: .get, headers: authHeaders)
            .validate().responseDecodable(of: APIResponse<[Product]>.self) { res in
                switch res.result {
                case .success(let api): completion(.success(api.data))
                case .failure(let err): completion(.failure(err))
                }
            }
    }
    
    func searchProducts(keyword: String, completion: @escaping (Result<[Product], AFError>) -> Void) {
        let parameters: [String: String] = ["q": keyword]
        session.request("\(baseURL)/products/search", method: .get, parameters: parameters, headers: authHeaders)
            .validate().responseDecodable(of: APIResponse<[Product]>.self) { res in
                switch res.result {
                case .success(let api): completion(.success(api.data))
                case .failure(let err): completion(.failure(err))
                }
            }
    }
    
    func updateProduct(id: Int, name: String, sku: String, price: String, completion: @escaping (Bool) -> Void) {
        let params: [String: Any] = ["pro_name": name, "pro_sku": sku, "pro_price": price]
        session.request("\(baseURL)/products/\(id)", method: .put, parameters: params, encoding: JSONEncoding.default, headers: authHeaders)
            .validate().response { res in completion(res.error == nil) }
    }
    
    func restockProduct(id: Int, addedQuantity: Int, completion: @escaping (Bool) -> Void) {
        let params: [String: Any] = ["quantity": addedQuantity]
        session.request("\(baseURL)/products/\(id)/restock", method: .post, parameters: params, encoding: JSONEncoding.default, headers: authHeaders)
            .validate().response { res in completion(res.error == nil) }
    }
    
    func deleteProduct(id: Int, completion: @escaping (Bool) -> Void) {
        session.request("\(baseURL)/products/\(id)", method: .delete, headers: authHeaders)
            .validate().response { res in completion(res.error == nil) }
    }
    
    func addProduct(name: String, sku: String, price: String, qty: Int, catId: Int, brandId: Int, completion: @escaping (Bool) -> Void) {
        let params: [String: Any] = [
            "pro_name": name,
            "pro_sku": sku,
            "pro_price": price,
            "pro_quantity": qty,
            "cat_id": catId,
            "brand_id": brandId,
            "description": "New product added from iOS"
        ]
        
        session.request("\(baseURL)/products/import", method: .post, parameters: params, encoding: JSONEncoding.default, headers: authHeaders)
            .validate()
            .response { response in
                completion(response.error == nil)
            }
    }
    
    // MARK: - Users
    struct UserResponse: Codable {
        let status: String
        let data: [User]
    }
    
    func fetchUsers(completion: @escaping (Result<[User], Error>) -> Void) {
        session.request("\(baseURL)/users", method: .get, headers: authHeaders)
            .validate()
            .responseDecodable(of: UserResponse.self) { response in
                switch response.result {
                case .success(let userResponse): completion(.success(userResponse.data))
                case .failure(let error): completion(.failure(error))
                }
            }
    }
    
    // MARK: - Orders
    func fetchOrders(completion: @escaping (Result<[Order], Error>) -> Void) {
        session.request("\(baseURL)/orders", method: .get, headers: authHeaders)
            .validate().responseDecodable(of: OrderResponse.self) { res in
                switch res.result {
                case .success(let api): completion(.success(api.data))
                case .failure(let err): completion(.failure(err))
                }
            }
    }
    
    // MARK: - Finance
    func fetchFinanceOverview(completion: @escaping (Result<FinanceData, Error>) -> Void) {
        session.request("\(baseURL)/reports/finance-overview", method: .get, headers: authHeaders)
            .validate().responseDecodable(of: FinanceResponse.self) { res in
                switch res.result {
                case .success(let api): completion(.success(api.data))
                case .failure(let err): completion(.failure(err))
                }
            }
    }
    
    func fetchRecentTransactions(completion: @escaping (Result<[Transaction], Error>) -> Void) {
        session.request("\(baseURL)/reports/recent-transactions", method: .get, headers: authHeaders)
            .validate().responseDecodable(of: TransactionResponse.self) { res in
                switch res.result {
                case .success(let api): completion(.success(api.data))
                case .failure(let err): completion(.failure(err))
                }
            }
    }
    
    func verifyOrder(orderId: Int, completion: @escaping (Bool) -> Void) {
        session.request("\(baseURL)/orders/\(orderId)/verify", method: .patch, headers: authHeaders)
            .validate().response { res in completion(res.error == nil) }
    }
    
    func updateOrderStatus(orderId: Int, newStatus: String, completion: @escaping (Bool) -> Void) {
        let params: [String: Any] = ["status": newStatus]
        session.request("\(baseURL)/orders/\(orderId)/status", method: .patch, parameters: params, encoding: JSONEncoding.default, headers: authHeaders)
            .validate().response { res in completion(res.error == nil) }
    }
    
    func cancelOrder(orderId: Int, completion: @escaping (Bool) -> Void) {
        session.request("\(baseURL)/orders/\(orderId)/cancel", method: .patch, headers: authHeaders)
            .validate().response { res in completion(res.error == nil) }
    }
}
