//
//  SceneDelegate.swift
//  AdminDashboard
//
//  Created by NHDkhoa on 16/3/26.
//

import UIKit

class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    var window: UIWindow?

func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = (scene as? UIWindowScene) else { return }
        window = UIWindow(windowScene: windowScene)
                
        // 👉 KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP VÀ QUYỀN
        if APIManager.shared.currentToken != nil {
            let role = APIManager.shared.currentUserRole?.uppercased() ?? "STAFF"
            let rootVC = role == "ADMIN" ? DashboardViewController() : StaffDashboardViewController()
            
            let navigationController = UINavigationController(rootViewController: rootVC)
            window?.rootViewController = navigationController
        } else {
            let loginVC = LoginViewController()
            let navigationController = UINavigationController(rootViewController: loginVC)
            window?.rootViewController = navigationController
        }
                
        window?.makeKeyAndVisible()
    }

    func sceneDidDisconnect(_ scene: UIScene) {
        // Called as the scene is being released by the system.
    }

    func sceneDidBecomeActive(_ scene: UIScene) {
        // Called when the scene has moved from an inactive state to an active state.
    }

    func sceneWillResignActive(_ scene: UIScene) {
        // Called when the scene will move from an active state to an inactive state.
    }

    func sceneWillEnterForeground(_ scene: UIScene) {
        // Called as the scene transitions from the background to the foreground.
    }

    func sceneDidEnterBackground(_ scene: UIScene) {
        // Called as the scene transitions from the foreground to the background.
    }
}
