import { CheckoutBreadcrumbSection } from "./CheckoutBreadcrumbSection";
import { MainNavigationSection } from "./MainNavigationSection";
import { OrderSuccessMessageSection } from "./OrderSuccessMessageSection";
import { SiteFooterSection } from "./SiteFooterSection";

export const ElementCheckOutSuccess = ({
  cartCount = 0,
  onGoShop,
  onGoCart,
  onGoManagement,
  onGoOrderDetail,
}) => {
  return (
    <div className="inline-flex flex-col items-stretch relative bg-white w-full max-w-[1920px] mx-auto min-h-screen overflow-x-hidden">
      <MainNavigationSection
        cartCount={cartCount}
        onFaqClick={() => {}}
        onCartClick={onGoCart}
      />
      <CheckoutBreadcrumbSection onGoShop={onGoShop} onGoCart={onGoCart} />
      <OrderSuccessMessageSection
        onGoManagement={onGoManagement}
        onGoOrderDetail={onGoOrderDetail}
      />
      <SiteFooterSection />
    </div>
  );
};

