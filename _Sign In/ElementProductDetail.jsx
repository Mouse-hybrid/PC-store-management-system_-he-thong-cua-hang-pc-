import { MainNavigationSection } from "./MainNavigationSection";
import { BreadcrumbNavigationSection } from "./BreadcrumbNavigationSection";
import { SiteFooterSection } from "./SiteFooterSection";
import productPh from "./shop-product-placeholder.svg";
import { ProductGallerySection } from "./ProductGallerySection";
import { ProductSpecsSection } from "./ProductSpecsSection";
import { RelatedProductsSection } from "./RelatedProductsSection";

export const ElementProductDetail = ({
  onGoHome,
  selectedProduct,
  onGoFaq,
  cartCount,
  onGoShoppingCard,
}) => {
  return (
    <div className="inline-flex flex-col items-center justify-center relative bg-white w-full max-w-[1920px] mx-auto min-h-screen overflow-x-hidden">
      <MainNavigationSection
        cartCount={cartCount}
        onFaqClick={onGoFaq}
        onCartClick={onGoShoppingCard}
      />
      <BreadcrumbNavigationSection onGoHome={onGoHome} />
      {/* selectedProduct hiện tại đang dùng cho demo hiển thị tên; UI chính là layout tĩnh như mẫu */}
      <ProductGallerySection product={selectedProduct} fallbackImage={productPh} />
      <ProductSpecsSection />
      <RelatedProductsSection />

      <SiteFooterSection />
    </div>
  );
};

