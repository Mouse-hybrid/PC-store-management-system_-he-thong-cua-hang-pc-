import { PaymentQRCodeSection } from "./PaymentQRCodeSection";
import { MainNavigationSection } from "./MainNavigationSection";
import { CheckoutBreadcrumbSection } from "./CheckOutBreadcrumbSection";
import { SiteFooterSection } from "./SiteFooterSection";

export const MoMo = ({
  cartCount = 0,
  onGoShop,
  onGoCart,
  onGoPaymentSuccess,
  checkoutSummary,
  orderCode,
}) => {
  const totalAmount =
    checkoutSummary?.totalValue ?? checkoutSummary?.subtotalValue ?? 0;

  return (
    <div className="inline-flex flex-col items-stretch justify-start relative bg-white w-full max-w-[1920px] mx-auto min-h-screen overflow-x-hidden">
      <MainNavigationSection
        cartCount={cartCount}
        onCartClick={onGoCart}
      />
      <CheckoutBreadcrumbSection onGoShop={onGoShop} onGoCart={onGoCart} />
      <div className="w-full px-[300px] py-8 bg-gray-50 box-border overflow-x-auto flex justify-center">
        <PaymentQRCodeSection
          onGoPaymentSuccess={onGoPaymentSuccess}
          amount={totalAmount}
          orderCode={orderCode}
        />
      </div>
      <SiteFooterSection />
    </div>
  );
};

