import { Eye } from "../../Eye";
import { ShoppingCartSimple } from "../../ShoppingCartSimple";
import { Star } from "../../Star";
import { Star1 } from "../../Star1";
import {
  formatPrice,
  getProductImageUrl,
  getProductPlaceholderByCategory,
  handleProductImageError,
} from "@/utils/productUtils";

const renderStars = (count) =>
  Array.from({ length: 5 }, (_, i) =>
    i < count ? (
      <Star key={i} className="!relative !w-4 !h-4" />
    ) : (
      <Star1 key={i} className="!relative !w-4 !h-4" />
    ),
  );

export const ProductCard = ({
  product,
  onSelect,
  onOpenDetail,
  onAddToCart,
  onHoverStart,
  onHoverEnd,
  showActions,
  isSelected,
}) => {
  if (!product) return null;

  const hasProImage = product.pro_image != null && String(product.pro_image).trim() !== "";
  const category = product.category ?? null;
  const imgSrc = hasProImage
    ? getProductImageUrl(product.pro_image, category)
    : product.thumbnail || getProductPlaceholderByCategory(category);

  return (
    <div
      onClick={() => onSelect?.(product)}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      className={`group relative rounded-2xl bg-gray-00 border border-solid overflow-hidden transition-all duration-200 ${
        isSelected
          ? "border-primary-500 shadow-[0_18px_40px_rgba(0,0,0,0.10)]"
          : "border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_18px_45px_rgba(0,0,0,0.12)]"
      } hover:-translate-y-0.5`}
      role="button"
      tabIndex={0}
    >
      {(product.badge || product.tag) && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          {product.badge ? (
            <div className="px-2.5 py-1 rounded-full bg-danger-500 text-gray-00 text-xs font-body-small-600">
              {product.badge.label}
            </div>
          ) : null}
          {product.tag ? (
            <div className="px-2.5 py-1 rounded-full bg-primary-50 border border-solid border-primary-100 text-primary-500 text-xs font-body-small-600">
              {String(product.tag)}
            </div>
          ) : null}
        </div>
      )}

      <div className="relative aspect-[4/3] overflow-hidden bg-[#f8f9fa]">
        <img
          src={imgSrc}
          alt={product.title ?? ""}
          className="h-full w-full object-contain bg-[#f8f9fa] transition-transform duration-300 group-hover:scale-[1.06]"
          loading="lazy"
          crossOrigin="anonymous"
          onError={(e) => handleProductImageError(e, getProductPlaceholderByCategory(category))}
        />

        <div
          className={`absolute right-3 top-3 z-10 flex flex-col gap-2 transition-all duration-200 ${
            showActions ? "opacity-100 translate-x-0" : "opacity-0 translate-x-1"
          }`}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail?.(product);
            }}
            className="h-10 w-10 rounded-full bg-gray-00/95 border border-solid border-gray-100 shadow-sm backdrop-blur hover:bg-gray-00 active:scale-95 transition"
            aria-label="Xem nhanh"
          >
            <Eye className="!relative !w-5 !h-5 text-gray-900 mx-auto" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(product, 1);
            }}
            className="h-10 w-10 rounded-full bg-primary-500 shadow-sm hover:opacity-95 active:scale-95 transition"
            aria-label="Thêm vào giỏ"
          >
            <ShoppingCartSimple className="!relative !w-5 !h-5 mx-auto" color="white" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1">
            <div className="inline-flex items-center gap-0.5">{renderStars(product.stars ?? 5)}</div>
            <div className="text-gray-600 text-xs">{product.rating ? product.rating.toFixed(1) : ""}</div>
          </div>
          {Number(product.stock) >= 0 ? (
            <div className="text-xs text-gray-600">{`Kho: ${product.stock}`}</div>
          ) : null}
        </div>

        <div className="mt-2 text-gray-900 font-body-small-600 leading-6 overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] min-h-[48px]">
          {product.title}
        </div>

        <div className="mt-3 flex items-end justify-between gap-2">
          <div className="text-secondary-500 font-body-medium-600 text-lg">
            {formatPrice(product.price)}
          </div>
          {product.performance ? (
            <div className="text-xs px-2 py-1 rounded-full bg-gray-50 border border-solid border-gray-100 text-gray-700 whitespace-nowrap">
              {`Gaming: ${product.performance}`}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

