import { useEffect } from "react";
import { MainNavigationSection } from "./MainNavigationSection";
import { OrderTrackingBreadcrumbSection } from "./OrderTrackingBreadcrumbSection";
import { OrderTrackingDetailSection } from "./OrderTrackingDetailSection";
import { SiteFooterSection } from "./SiteFooterSection";

export const ElementTrackOrder = ({
  cartCount = 0,
  orderTotal = 0,
  orderPlacedAt,
  orderCode,
  onGoBack,
  onGoHome,
}) => {
  useEffect(() => {
    document.title = "Track Order_Details";
  }, []);

  return (
    <div className="bg-white w-full max-w-[1920px] mx-auto min-h-[1704px] flex flex-col overflow-x-hidden">
      <MainNavigationSection
        cartCount={cartCount}
        onFaqClick={() => {}}
        onCartClick={onGoBack}
      />
      <OrderTrackingBreadcrumbSection onGoHome={onGoHome} onGoTracking={onGoBack} />
      <OrderTrackingDetailSection
        orderTotal={orderTotal}
        orderPlacedAt={orderPlacedAt}
        orderCode={orderCode}
      />
      <SiteFooterSection />
    </div>
  );
};

