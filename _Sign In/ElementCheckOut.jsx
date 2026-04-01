import { CheckOutBreadcrumbSection } from "./CheckOutBreadcrumbSection";
import { MainNavigationSection } from "./MainNavigationSection";
import { PaymentFormSection } from "./PaymentFormSection";
import { SiteFooterSection } from "./SiteFooterSection";

export const ElementCheckOut = ({
  cartCount = 0,
  onGoShop,
  onGoCart,
  onGoPaymentSuccess,
  onGoMoMo,
  checkoutSummary,
}) => {
  return (
    <div className="inline-flex flex-col items-stretch relative bg-white w-full max-w-[1920px] mx-auto min-h-screen overflow-x-hidden">
      <MainNavigationSection
        cartCount={cartCount}
        onFaqClick={() => {}}
        onCartClick={onGoCart}
      />
      <CheckOutBreadcrumbSection onGoShop={onGoShop} onGoCart={onGoCart} />
      <PaymentFormSection
        cartCount={cartCount}
        onGoPaymentSuccess={onGoPaymentSuccess}
        onGoMoMo={onGoMoMo}
        checkoutSummary={checkoutSummary}
      />
      <SiteFooterSection />
    </div>
  );
};

