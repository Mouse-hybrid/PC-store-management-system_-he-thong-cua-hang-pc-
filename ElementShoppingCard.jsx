import { MainNavigationSection } from "./MainNavigationSection";
import { CartBreadcrumbSection } from "./CartBreadcrumbSection";
import { CartPage } from "@/pages/CartPage";
import { SiteFooterSection } from "./SiteFooterSection";

export const ElementShoppingCard = ({
  cartCount = 0,
  onGoShop,
  onGoCheckout,
  onCartChange,
}) => {
  return (
    <div className="inline-flex flex-col min-h-screen w-full max-w-[1920px] mx-auto bg-white">
      <MainNavigationSection
        cartCount={cartCount}
        onFaqClick={() => {}}
        onCartClick={() => {}}
      />
      <CartBreadcrumbSection onGoHome={onGoShop} />
      <CartPage onGoShop={onGoShop} onGoCheckout={onGoCheckout} onCartChange={onCartChange} />
      <SiteFooterSection />
    </div>
  );
};

