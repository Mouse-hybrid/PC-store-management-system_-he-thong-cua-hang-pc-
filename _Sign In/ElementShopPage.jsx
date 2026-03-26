import { useState } from "react";
import { MainNavigationSection } from "./MainNavigationSection";
import { ProductBreadcrumbSection } from "./ProductBreadcrumbSection";
import { ProductGridSection } from "./ProductGridSection";
import { ElementProductDetail } from "./ElementProductDetail";
import { ElementFaqs } from "./ElementFaqs";
import { SiteFooterSection } from "./SiteFooterSection";
import { ElementShoppingCard } from "./ElementShoppingCard";
import { ElementCheckOut } from "./ElementCheckOut";
import { ElementCheckOutSuccess } from "./ElementCheckOutSuccess";
import { ElementTrackOrder } from "./ElementTrackOrder";
import { MoMo } from "./MoMo";

export const ElementShopPage = () => {
  const [activeView, setActiveView] = useState("shop"); // "shop" | ... | "check-out" | "momo" | "payment-success" | "track-order"
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [orderPlacedAt, setOrderPlacedAt] = useState(null);
  const [orderCode, setOrderCode] = useState("#96459761");
  const [checkoutSummary, setCheckoutSummary] = useState({
    subtotalValue: 0,
    totalValue: 0,
  });

  if (activeView === "product-detail") {
    return (
      <ElementProductDetail
        selectedProduct={selectedProduct}
        onGoHome={() => setActiveView("shop")}
        onGoFaq={() => setActiveView("faqs")}
        cartCount={cartCount}
        onGoShoppingCard={() => setActiveView("shopping-card")}
      />
    );
  }

  if (activeView === "faqs") {
    return (
      <ElementFaqs
        onGoHome={() => setActiveView("shop")}
        cartCount={cartCount}
        onGoShoppingCard={() => setActiveView("shopping-card")}
      />
    );
  }

  if (activeView === "shopping-card") {
    return (
      <ElementShoppingCard
        cartCount={cartCount}
        onGoShop={() => setActiveView("shop")}
        onGoCheckout={(summary) => {
          setCheckoutSummary(summary);
          setActiveView("check-out");
        }}
      />
    );
  }

  if (activeView === "check-out") {
    return (
      <ElementCheckOut
        cartCount={cartCount}
        onGoShop={() => setActiveView("shop")}
        onGoCart={() => setActiveView("shopping-card")}
        checkoutSummary={checkoutSummary}
        onGoPaymentSuccess={() => {
          // Non-MoMo: bấm xác nhận thanh toán -> tạo thời điểm đặt hàng và chuyển thẳng sang thành công
          setOrderPlacedAt(new Date());
          setCartCount(0);
          setOrderCode("#96459761");
          setActiveView("payment-success");
        }}
        onGoMoMo={() => {
          // MoMo: bấm xác nhận thanh toán -> chuyển sang trang MoMo (lưu thời điểm đặt hàng tại đây)
          setOrderPlacedAt(new Date());
          setCartCount(0);
          setOrderCode("MOMO123456789");
          setActiveView("momo");
        }}
      />
    );
  }

  if (activeView === "momo") {
    return (
      <MoMo
        cartCount={cartCount}
        checkoutSummary={checkoutSummary}
        orderCode={orderCode}
        onGoShop={() => setActiveView("shop")}
        onGoCart={() => setActiveView("shopping-card")}
        onGoPaymentSuccess={() => {
          // MoMo: bấm "ĐÃ THANH TOÁN" -> sang thành công (không cập nhật lại thời điểm đặt hàng)
          setCartCount(0);
          setActiveView("payment-success");
        }}
      />
    );
  }

  if (activeView === "payment-success") {
    return (
      <ElementCheckOutSuccess
        cartCount={cartCount}
        onGoShop={() => setActiveView("shop")}
        onGoCart={() => setActiveView("shopping-card")}
        onGoManagement={() => setActiveView("shop")}
        onGoOrderDetail={() => setActiveView("track-order")}
      />
    );
  }

  if (activeView === "track-order") {
    const orderTotal =
      checkoutSummary?.totalValue ?? checkoutSummary?.subtotalValue ?? 0;

    return (
      <ElementTrackOrder
        cartCount={cartCount}
        orderTotal={orderTotal}
        orderPlacedAt={orderPlacedAt}
        orderCode={orderCode}
        onGoBack={() => setActiveView("payment-success")}
        onGoHome={() => setActiveView("shop")}
      />
    );
  }

  return (
    <div className="inline-flex flex-col items-stretch justify-start relative bg-white w-full max-w-[1920px] mx-auto min-h-screen overflow-x-hidden">
      <MainNavigationSection
        cartCount={cartCount}
        onFaqClick={() => setActiveView("faqs")}
        onCartClick={() => setActiveView("shopping-card")}
      />
      <ProductBreadcrumbSection />
      <div className="w-full px-[300px] box-border overflow-x-auto">
        <ProductGridSection
          onAddToCart={() => setCartCount((c) => c + 1)}
          onOpenProductDetail={(product) => {
            setSelectedProduct(product);
            setActiveView("product-detail");
          }}
        />
      </div>
      <SiteFooterSection />
    </div>
  );
};
