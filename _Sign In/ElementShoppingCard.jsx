import { MainNavigationSection } from "./MainNavigationSection";
import { CartBreadcrumbSection } from "./CartBreadcrumbSection";
import { ShoppingCartSection } from "./ShoppingCartSection";
import { SiteFooterSection } from "./SiteFooterSection";

export const ElementShoppingCard = ({
  cartCount = 0,
  onGoShop,
  onGoCheckout,
}) => {
  return (
    <div className="inline-flex flex-col min-h-screen w-full max-w-[1920px] mx-auto bg-white">
      <MainNavigationSection
        cartCount={cartCount}
        onFaqClick={() => {}}
        onCartClick={() => {}}
      />
      <CartBreadcrumbSection onGoHome={onGoShop} />
      <ShoppingCartSection
        cartCount={cartCount}
        onGoShop={onGoShop}
        onGoCheckout={onGoCheckout}
      />
      <SiteFooterSection />
    </div>
  );
};

