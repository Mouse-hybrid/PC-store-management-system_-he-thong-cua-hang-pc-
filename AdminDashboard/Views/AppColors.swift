import UIKit

struct AppColors {
    static let bgMain: UIColor = {
        return UIColor { trait in
            return trait.userInterfaceStyle == .dark
                ? UIColor(red: 5/255, green: 8/255, blue: 15/255, alpha: 1)
                : UIColor(white: 0.96, alpha: 1.0)
        }
    }()
    
    static let surfaceCard: UIColor = {
        return UIColor { trait in
            return trait.userInterfaceStyle == .dark
                ? UIColor(red: 19/255, green: 27/255, blue: 44/255, alpha: 1)
                : .white
        }
    }()
    
    static let textMain: UIColor = {
        return UIColor { trait in
            return trait.userInterfaceStyle == .dark
                ? .white
                : UIColor(red: 5/255, green: 8/255, blue: 15/255, alpha: 1)
        }
    }()
    
    static let primaryNeon = UIColor(red: 0, green: 242/255, blue: 255/255, alpha: 1)
    static let textSec = UIColor(red: 148/255, green: 163/255, blue: 184/255, alpha: 1)
    static let success = UIColor(red: 0, green: 255/255, blue: 163/255, alpha: 1)
    static let accentPurple = UIColor(red: 217/255, green: 70/255, blue: 239/255, alpha: 1)
}
