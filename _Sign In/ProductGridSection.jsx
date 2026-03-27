import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "./ArrowLeft";
import { ArrowRight } from "./ArrowRight";
import { ArrowRight1 } from "./ArrowRight1";
import { Eye } from "./Eye";
import { Heart1 } from "./Heart1";
import { IconComponentNode } from "./IconComponentNode";
import { MagnifyingGlass } from "./MagnifyingGlass";
import { ShoppingCartSimple } from "./ShoppingCartSimple";
import { Star } from "./Star";
import { Star1 } from "./Star1";
import { X } from "./X";
import fullLine from "./full-line.svg";
import productPh from "./shop-product-placeholder.svg";
import line13 from "./line-13.svg";
import line15 from "./line-15.svg";
import line16 from "./line-16.svg";
import shortLine from "./short-line.svg";
import { getProducts } from "./services/productApi";

const categories = [
  { label: "PC Văn Phòng", active: true },
  { label: "Laptop", active: false },
  { label: "PC Gaming", active: false },
  { label: "Linh kiện PC", active: false },
  { label: "Card đồ họa (GPU)", active: false },
  { label: "CPU – Bộ xử lý", active: false },
  { label: "Màn hình", active: false },
  { label: "Tai nghe", active: false },
  { label: "Chuột & Bàn phím", active: false },
  { label: "Ổ cứng SSD", active: false },
  { label: "RAM", active: false },
  { label: "Tản nhiệt CPU", active: false },
];

const priceRanges = [
  { label: "All Price", active: false },
  { label: "Under $20", active: false },
  { label: "$25 to $100", active: false },
  { label: "$100 to $300", active: false },
  { label: "$300 to $500", active: true },
  { label: "$500 to $1,000", active: false },
  { label: "$1,000 to $10,000", active: false },
];

const baseProducts = [
  {
    id: 1,
    stars: 5,
    reviews: "(738)",
    name: "Ghi tên sản phẩm",
    price: "$70",
    originalPrice: null,
    badge: { label: "HOT", bg: "bg-danger-500", textColor: "text-gray-00" },
    hovered: false,
  },
  {
    id: 2,
    stars: 5,
    reviews: "(536)",
    name: "Ghi tên sản phẩm",
    price: "$2,300",
    originalPrice: null,
    badge: null,
    hovered: false,
  },
  {
    id: 3,
    stars: 5,
    reviews: "(423)",
    name: "Ghi tên sản phẩm",
    price: "$360",
    originalPrice: null,
    badge: {
      label: "BEST DEALS",
      bg: "bg-secondary-500",
      textColor: "text-gray-00",
    },
    hovered: false,
  },
  {
    id: 4,
    stars: 4,
    reviews: "(816)",
    name: "Ghi tên sản phẩm",
    price: "$80",
    originalPrice: null,
    badge: null,
    hovered: false,
  },
  {
    id: 5,
    stars: 5,
    reviews: "(647)",
    name: "Ghi tên sản phẩm",
    price: "$1,500",
    originalPrice: null,
    badge: null,
    hovered: false,
  },
  {
    id: 6,
    stars: 4,
    reviews: "(877)",
    name: "Ghi tên sản phẩm",
    price: "$1,200",
    originalPrice: "$1600",
    badge: {
      label: "25% OFF",
      bg: "bg-warning-400",
      textColor: "text-gray-900",
    },
    hovered: false,
  },
  {
    id: 7,
    stars: 5,
    reviews: "(426)",
    name: "Ghi tên sản phẩm",
    price: "$250",
    originalPrice: null,
    badge: null,
    hovered: true,
  },
  {
    id: 8,
    stars: 5,
    reviews: "(583)",
    name: "Ghi tên sản phẩm",
    price: "$220",
    originalPrice: null,
    badge: { label: "SALE", bg: "bg-success-500", textColor: "text-gray-00" },
    hovered: false,
  },
  {
    id: 9,
    stars: 4,
    reviews: "(994)",
    name: "Ghi tên sản phẩm",
    price: "$360",
    originalPrice: null,
    badge: {
      label: "BEST DEALS",
      bg: "bg-secondary-500",
      textColor: "text-gray-00",
    },
    hovered: false,
  },
  {
    id: 10,
    stars: 5,
    reviews: "(798)",
    name: "Ghi tên sản phẩm",
    price: "$80",
    originalPrice: null,
    badge: null,
    hovered: false,
  },
  {
    id: 11,
    stars: 5,
    reviews: "(600)",
    name: "Ghi tên sản phẩm",
    price: "$70",
    originalPrice: null,
    badge: { label: "HOT", bg: "bg-danger-500", textColor: "text-gray-00" },
    hovered: false,
  },
  {
    id: 12,
    stars: 5,
    reviews: "(492)",
    name: "Ghi tên sản phẩm",
    price: "$250",
    originalPrice: null,
    badge: null,
    hovered: false,
  },
  {
    id: 13,
    stars: 4,
    reviews: "(740)",
    name: "Ghi tên sản phẩm",
    price: "$2,300",
    originalPrice: null,
    badge: null,
    hovered: false,
  },
  {
    id: 14,
    stars: 4,
    reviews: "(556)",
    name: "Ghi tên sản phẩm",
    price: "$220",
    originalPrice: null,
    badge: { label: "SALE", bg: "bg-success-500", textColor: "text-gray-00" },
    hovered: false,
  },
  {
    id: 15,
    stars: 4,
    reviews: "(536)",
    name: "Ghi tên sản phẩm",
    price: "$1,500",
    originalPrice: null,
    badge: null,
    hovered: false,
  },
  {
    id: 16,
    stars: 4,
    reviews: "(423)",
    name: "Ghi tên sản phẩm",
    price: "$1,200",
    originalPrice: "$1600",
    badge: {
      label: "25% OFF",
      bg: "bg-warning-400",
      textColor: "text-gray-900",
    },
    hovered: false,
  },
  {
    id: 17,
    stars: 5,
    reviews: "(738)",
    name: "Ghi tên sản phẩm",
    price: "$70",
    originalPrice: "$75",
    badge: { label: "HOT", bg: "bg-danger-500", textColor: "text-gray-00" },
    hovered: false,
  },
  {
    id: 18,
    stars: 5,
    reviews: "(536)",
    name: "Ghi tên sản phẩm",
    price: "$2,300",
    originalPrice: null,
    badge: null,
    hovered: false,
  },
  {
    id: 19,
    stars: 5,
    reviews: "(423)",
    name: "Ghi tên sản phẩm",
    price: "$360",
    originalPrice: null,
    badge: {
      label: "BEST DEALS",
      bg: "bg-secondary-500",
      textColor: "text-gray-00",
    },
    hovered: false,
  },
  {
    id: 20,
    stars: 4,
    reviews: "(816)",
    name: "Ghi tên sản phẩm",
    price: "$80",
    originalPrice: null,
    badge: null,
    hovered: false,
  },
  {
    id: 21,
    stars: 4,
    reviews: "(994)",
    name: "Ghi tên sản phẩm",
    price: "$360",
    originalPrice: null,
    badge: {
      label: "BEST DEALS",
      bg: "bg-secondary-500",
      textColor: "text-gray-00",
    },
    hovered: false,
  },
  {
    id: 22,
    stars: 5,
    reviews: "(492)",
    name: "Ghi tên sản phẩm",
    price: "$250",
    originalPrice: null,
    badge: null,
    hovered: false,
  },
  {
    id: 23,
    stars: 5,
    reviews: "(798)",
    name: "Ghi tên sản phẩm",
    price: "$80",
    originalPrice: "$124",
    badge: null,
    hovered: false,
  },
  {
    id: 24,
    stars: 5,
    reviews: "(600)",
    name: "Ghi tên sản phẩm",
    price: "$70",
    originalPrice: null,
    badge: { label: "HOT", bg: "bg-danger-500", textColor: "text-gray-00" },
    hovered: false,
  },
].map((p) => ({ ...p, image: productPh }));

const TOTAL_PRODUCTS = 120;
const PRODUCTS_PER_PAGE = 24;

const staticProducts = Array.from({ length: TOTAL_PRODUCTS }, (_, idx) => {
  const base = baseProducts[idx % baseProducts.length];
  return {
    ...base,
    id: idx + 1,
  };
});

const toUsd = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return "$0";
  return `$${n.toLocaleString("en-US")}`;
};

const unwrapProducts = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.products)) return payload.products;
  return [];
};

const mapApiProductToCard = (p, idx) => {
  const id = p?.id ?? p?._id ?? idx + 1;
  const name = p?.name ?? p?.title ?? "Sản phẩm";
  const priceValue = p?.price ?? p?.unitPrice ?? p?.salePrice ?? 0;
  const imageUrl =
    p?.image ??
    p?.imageUrl ??
    p?.thumbnail ??
    p?.thumbnailUrl ??
    p?.images?.[0] ??
    productPh;

  const price =
    typeof priceValue === "string" && priceValue.trim().startsWith("$")
      ? priceValue
      : toUsd(priceValue);

  return {
    id,
    stars: 5,
    reviews: "(0)",
    name,
    price,
    originalPrice: null,
    badge: null,
    hovered: false,
    image: imageUrl || productPh,
  };
};

const renderStars = (count) => {
  return Array.from({ length: 5 }, (_, i) =>
    i < count ? (
      <Star key={i} className="!relative !w-4 !h-4" />
    ) : (
      <Star1 key={i} className="!relative !w-4 !h-4" />
    ),
  );
};

const ProductCard = ({
  product,
  showActions,
  isSelected,
  onSelect,
  onOpenDetail,
  onAddToCart,
  onHoverStart,
  onHoverEnd,
}) => {
  return (
    <div
      onClick={() => onSelect?.(product)}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      className={`relative w-[234px] h-80 bg-gray-00 rounded-[3px] overflow-hidden border border-solid cursor-pointer ${
        isSelected
          ? "border-gray-200 shadow-[0px_8px_24px_#191c1e1f]"
          : "border-gray-100"
      }`}
    >
      <img
        className="absolute top-4 left-4 w-[202px] h-[172px] object-cover"
        alt=""
        src={product.image}
      />

      {showActions && (
        <div className="inline-flex items-start gap-2 absolute top-[86px] left-11 z-10">
          <div className="inline-flex items-start gap-2.5 p-3 relative flex-[0_0_auto] bg-gray-00 rounded-[100px] shadow-sm">
            <Heart1 className="!relative !w-6 !h-6 text-gray-900" />
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(product);
            }}
            className="inline-flex items-start gap-2.5 p-3 relative flex-[0_0_auto] bg-gray-00 rounded-[100px] shadow-sm cursor-pointer border-none"
            aria-label="Thêm vào giỏ hàng"
          >
            <ShoppingCartSimple className="!relative !w-6 !h-6" color="#191C1F" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail?.(product);
            }}
            className="p-3 bg-primary-500 inline-flex items-start gap-2.5 relative flex-[0_0_auto] rounded-[100px] cursor-pointer"
            aria-label="Xem chi tiết sản phẩm"
          >
            <Eye className="!relative !w-6 !h-6 text-white" />
          </button>
        </div>
      )}

      <div className="inline-flex flex-col items-start gap-2 absolute top-[212px] left-4 right-4">
        <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
          <div className="inline-flex items-center gap-0.5">{renderStars(product.stars)}</div>
          <div className="relative w-fit mt-[-1.00px] font-body-tiny-400 font-[number:var(--body-tiny-400-font-weight)] text-gray-500 text-[length:var(--body-tiny-400-font-size)] tracking-[var(--body-tiny-400-letter-spacing)] leading-[var(--body-tiny-400-line-height)] whitespace-nowrap [font-style:var(--body-tiny-400-font-style)]">
            {product.reviews}
          </div>
        </div>

        <div className="relative w-[202px] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-900 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)]">
          {product.name}
        </div>

        <div className="inline-flex items-start gap-1 relative flex-[0_0_auto]">
          {product.originalPrice && (
            <div className="relative w-fit mt-[-1.00px] [font-family:'Public_Sans-Regular',Helvetica] font-normal text-gray-400 text-sm tracking-[0] leading-5 line-through whitespace-nowrap">
              {product.originalPrice}
            </div>
          )}
          <div className="relative w-fit mt-[-1.00px] font-body-small-600 font-[number:var(--body-small-600-font-weight)] text-secondary-500 text-[length:var(--body-small-600-font-size)] tracking-[var(--body-small-600-letter-spacing)] leading-[var(--body-small-600-line-height)] whitespace-nowrap [font-style:var(--body-small-600-font-style)]">
            {product.price}
          </div>
        </div>
      </div>

      {product.badge && (
        <div
          className={`${product.badge.bg} inline-flex items-start gap-2.5 px-2.5 py-[5px] absolute top-3 left-3 rounded-sm z-[1]`}
        >
          <div
            className={`relative w-fit mt-[-1.00px] font-body-tiny-600 font-[number:var(--body-tiny-600-font-weight)] ${product.badge.textColor} text-[length:var(--body-tiny-600-font-size)] tracking-[var(--body-tiny-600-letter-spacing)] leading-[var(--body-tiny-600-line-height)] whitespace-nowrap [font-style:var(--body-tiny-600-font-style)]`}
          >
            {product.badge.label}
          </div>
        </div>
      )}
    </div>
  );
};

export const ProductGridSection = ({ onOpenProductDetail, onAddToCart }) => {
  const [activePage, setActivePage] = useState(0);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [products, setProducts] = useState(staticProducts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        const list = unwrapProducts(data);
        if (cancelled) return;

        if (list.length > 0) {
          setProducts(list.map(mapApiProductToCard));
          setActivePage(0);
        } else {
          setProducts(staticProducts);
        }
      } catch (err) {
        console.log("getProducts error:", err);
        if (!cancelled) setProducts(staticProducts);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const pageNumbers = Array.from({ length: totalPages }, (_, idx) =>
    String(idx + 1).padStart(2, "0"),
  );
  const startIndex = activePage * PRODUCTS_PER_PAGE;
  const currentPageProducts = useMemo(
    () => products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE),
    [products, startIndex],
  );

  const rows = [];
  for (let i = 0; i < currentPageProducts.length; i += 4) {
    rows.push(currentPageProducts.slice(i, i + 4));
  }

  return (
    <div className="inline-flex items-start gap-6 pt-10 pb-[72px] relative w-full box-border">
      <div className="inline-flex flex-col items-start gap-6 relative flex-[0_0_auto] shrink-0">
        <div className="inline-flex flex-col items-start gap-4 relative flex-[0_0_auto]">
          <div className="relative w-[312px] mt-[-1.00px] font-label-02 font-[number:var(--label-02-font-weight)] text-gray-900 text-[length:var(--label-02-font-size)] tracking-[var(--label-02-letter-spacing)] leading-[var(--label-02-line-height)] [font-style:var(--label-02-font-style)]">
            CATEGORY
          </div>

          <div className="inline-flex flex-col items-start gap-3 relative flex-[0_0_auto]">
            {categories.map((cat, idx) => (
              <div
                key={cat.label}
                className="inline-flex items-start gap-2 relative flex-[0_0_auto]"
              >
                {cat.active ? (
                  <div className="bg-primary-500 relative w-5 h-5 rounded-[100px] shrink-0">
                    <div className="relative top-1.5 left-1.5 w-2 h-2 bg-gray-00 rounded" />
                  </div>
                ) : (
                  <div className="relative w-5 h-5 bg-gray-00 rounded-[100px] border border-solid border-gray-200 shrink-0" />
                )}
                <div
                  className={`relative w-[284px] mt-[-1.00px] ${
                    cat.active
                      ? "font-body-small-500 font-[number:var(--body-small-500-font-weight)] text-gray-900 text-[length:var(--body-small-500-font-size)] tracking-[var(--body-small-500-letter-spacing)] leading-[var(--body-small-500-line-height)] [font-style:var(--body-small-500-font-style)]"
                      : "font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-700 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)]"
                  }`}
                >
                  {cat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <img
          className="relative w-[312px] h-px object-cover"
          alt=""
          src={line13}
        />

        <div className="inline-flex flex-col items-start gap-4 relative flex-[0_0_auto]">
          <div className="relative w-[312px] mt-[-1.00px] font-label-02 font-[number:var(--label-02-font-weight)] text-gray-900 text-[length:var(--label-02-font-size)] tracking-[var(--label-02-letter-spacing)] leading-[var(--label-02-line-height)] [font-style:var(--label-02-font-style)]">
            KHOẢNG GIÁ
          </div>

          <div className="relative w-[312px] h-3">
            <img
              className="absolute top-[5px] left-0 w-[312px] h-0.5"
              alt=""
              src={fullLine}
            />
            <img
              className="absolute top-[5px] left-12 w-[152px] h-0.5"
              alt=""
              src={shortLine}
            />
            <div className="absolute -top-px left-[42px] w-3.5 h-3.5 bg-gray-00 rounded-[7px] border-2 border-solid border-primary-500" />
            <div className="absolute -top-px left-[193px] w-3.5 h-3.5 bg-gray-00 rounded-[7px] border-2 border-solid border-primary-500" />
          </div>

          <div className="inline-flex items-start gap-3 relative flex-[0_0_auto]">
            <div className="relative w-[150px] h-10 bg-gray-00 rounded-[3px] border border-solid border-gray-100">
              <div className="absolute top-[calc(50.00%_-_12px)] left-3 [font-family:'Public_Sans-Regular',Helvetica] font-normal text-gray-500 text-sm tracking-[0] leading-6 whitespace-nowrap">
                Giá thấp nhất
              </div>
            </div>
            <div className="relative w-[150px] h-10 bg-gray-00 rounded-[3px] border border-solid border-gray-100">
              <div className="absolute top-[calc(50.00%_-_12px)] left-3 [font-family:'Public_Sans-Regular',Helvetica] font-normal text-gray-500 text-sm tracking-[0] leading-6 whitespace-nowrap">
                Giá cao nhất
              </div>
            </div>
          </div>

          <div className="inline-flex flex-col items-start gap-3 relative flex-[0_0_auto]">
            {priceRanges.map((range, idx) => (
              <div
                key={range.label}
                className="inline-flex items-start gap-2 relative flex-[0_0_auto]"
              >
                <div
                  className={`relative w-5 h-5 bg-gray-00 rounded-[100px] shrink-0 ${
                    range.active
                      ? "border-2 border-solid border-primary-500"
                      : "border border-solid border-gray-200"
                  }`}
                />
                <div className="relative w-[284px] mt-[-1.00px] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-700 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)]">
                  {range.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <img
          className="relative w-[312px] h-px object-cover"
          alt=""
          src={line15}
        />

        <img
          className="relative w-[312px] h-px object-cover"
          alt=""
          src={line16}
        />

        <div className="inline-flex flex-col items-start gap-[18px] relative flex-[0_0_auto]">
          <div className="relative w-[312px] mt-[-1.00px] font-label-02 font-[number:var(--label-02-font-weight)] text-gray-900 text-[length:var(--label-02-font-size)] tracking-[var(--label-02-letter-spacing)] leading-[var(--label-02-line-height)] [font-style:var(--label-02-font-style)]">
            POPULAR TAG
          </div>

          <div className="inline-flex flex-col items-start gap-2 relative flex-[0_0_auto]">
            <div className="inline-flex items-start gap-2 relative flex-[0_0_auto] flex-wrap">
              <div className="items-center justify-center gap-2.5 px-3 py-1.5 rounded-sm border border-solid border-gray-100 inline-flex relative flex-[0_0_auto]">
                <div className="relative w-fit mt-[-1.00px] font-body-small-500 font-[number:var(--body-small-500-font-weight)] text-gray-900 text-[length:var(--body-small-500-font-size)] tracking-[var(--body-small-500-letter-spacing)] leading-[var(--body-small-500-line-height)] whitespace-nowrap [font-style:var(--body-small-500-font-style)]">
                  PC Gaming
                </div>
              </div>
              <div className="items-center justify-center gap-2.5 px-3 py-1.5 rounded-sm border border-solid border-gray-100 inline-flex relative flex-[0_0_auto]">
                <div className="text-gray-900 relative w-fit mt-[-1.00px] font-body-small-500 font-[number:var(--body-small-500-font-weight)] text-[length:var(--body-small-500-font-size)] tracking-[var(--body-small-500-letter-spacing)] leading-[var(--body-small-500-line-height)] whitespace-nowrap [font-style:var(--body-small-500-font-style)]">
                  RTX
                </div>
              </div>
              <div className="items-center justify-center gap-2.5 px-3 py-1.5 rounded-sm border border-solid border-gray-100 inline-flex relative flex-[0_0_auto]">
                <div className="text-gray-900 relative w-fit mt-[-1.00px] font-body-small-500 font-[number:var(--body-small-500-font-weight)] text-[length:var(--body-small-500-font-size)] tracking-[var(--body-small-500-letter-spacing)] leading-[var(--body-small-500-line-height)] whitespace-nowrap [font-style:var(--body-small-500-font-style)]">
                  Laptop
                </div>
              </div>
            </div>

            <div className="inline-flex items-start gap-2 relative flex-[0_0_auto] flex-wrap">
              <div className="items-center justify-center gap-2.5 px-3 py-1.5 rounded-sm border border-solid border-gray-100 inline-flex relative flex-[0_0_auto]">
                <div className="text-gray-900 relative w-fit mt-[-1.00px] font-body-small-500 font-[number:var(--body-small-500-font-weight)] text-[length:var(--body-small-500-font-size)] tracking-[var(--body-small-500-letter-spacing)] leading-[var(--body-small-500-line-height)] whitespace-nowrap [font-style:var(--body-small-500-font-style)]">
                  Màn hình 144Hz
                </div>
              </div>
              <div className="items-center justify-center gap-2.5 px-3 py-1.5 bg-primary-50 rounded-sm border border-solid border-primary-500 inline-flex relative flex-[0_0_auto]">
                <div className="text-primary-500 relative w-fit mt-[-1.00px] font-body-small-500 font-[number:var(--body-small-500-font-weight)] text-[length:var(--body-small-500-font-size)] tracking-[var(--body-small-500-letter-spacing)] leading-[var(--body-small-500-line-height)] whitespace-nowrap [font-style:var(--body-small-500-font-style)]">
                  Lọc Nhanh
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="inline-flex flex-col items-center justify-center gap-6 p-8 relative flex-[0_0_auto] bg-gray-00 rounded border-4 border-solid border-primary-100">
          <img
            className="relative w-[180px] h-[180px] object-contain"
            alt=""
            src={productPh}
          />

          <div className="gap-3 inline-flex flex-col items-center justify-center relative flex-[0_0_auto]">
            <div className="gap-4 inline-flex flex-col items-center justify-center relative flex-[0_0_auto]">
              <div className="inline-flex flex-col items-center justify-center gap-2 relative flex-[0_0_auto]">
                <div className="relative w-[248px] mt-[-1.00px] font-heading-03 font-[number:var(--heading-03-font-weight)] text-gray-900 text-[length:var(--heading-03-font-size)] text-center tracking-[var(--heading-03-letter-spacing)] leading-[var(--heading-03-line-height)] [font-style:var(--heading-03-font-style)]">
                  TAI NGHE GAMING RGB
                </div>
              </div>

              <div className="inline-flex items-center justify-center gap-2 relative flex-[0_0_auto]">
                <div className="relative w-fit font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-700 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] whitespace-nowrap [font-style:var(--body-small-400-font-style)]">
                  chỉ từ:
                </div>
                <div className="inline-flex items-start gap-2.5 px-3 py-1.5 relative flex-[0_0_auto] bg-warning-300 rounded-[3px]">
                  <div className="relative w-fit mt-[-2.00px] font-body-medium-600 font-[number:var(--body-medium-600-font-weight)] text-gray-900 text-[length:var(--body-medium-600-font-size)] text-center tracking-[var(--body-medium-600-letter-spacing)] leading-[var(--body-medium-600-line-height)] whitespace-nowrap [font-style:var(--body-medium-600-font-style)]">
                    1.490.000đ
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="inline-flex flex-col items-start gap-3 relative flex-[0_0_auto] w-full">
            <div className="flex w-[248px] max-w-full items-center justify-center gap-2 px-6 py-3 relative flex-[0_0_auto] bg-primary-500 rounded-sm">
              <ShoppingCartSimple
                className="!relative !w-[20.12px] !h-5"
                color="white"
              />
              <div className="mt-[-1.00px] text-gray-00 relative w-fit font-heading-07 font-[number:var(--heading-07-font-weight)] text-[length:var(--heading-07-font-size)] tracking-[var(--heading-07-letter-spacing)] leading-[var(--heading-07-line-height)] whitespace-nowrap [font-style:var(--heading-07-font-style)]">
                MUA NGAY
              </div>
            </div>

            <div className="flex w-[248px] max-w-full items-center justify-center gap-2 px-6 py-3 relative flex-[0_0_auto] rounded-sm border-2 border-solid border-primary-500">
              <div className="mt-[-2.00px] text-primary-500 relative w-fit font-heading-07 font-[number:var(--heading-07-font-weight)] text-[length:var(--heading-07-font-size)] tracking-[var(--heading-07-letter-spacing)] leading-[var(--heading-07-line-height)] whitespace-nowrap [font-style:var(--heading-07-font-style)]">
                XEM SẢN PHẨM
              </div>
              <ArrowRight className="!relative !w-5 !h-5 text-primary-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-[993px] min-h-[2208px] shrink-0">
        <div className="inline-flex flex-wrap items-start gap-6 xl:gap-[307px] absolute top-0 left-0 w-full">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-3 relative flex-[0_0_auto] bg-gray-00 rounded-sm border border-solid border-gray-100 min-w-0">
            <p className="relative w-[364px] max-w-[min(364px,100%)] mt-[-1.00px] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-500 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)]">
              Tìm kiếm PC, linh kiện...
            </p>
            <MagnifyingGlass className="!relative !w-5 !h-5 shrink-0" />
          </div>

          <div className="inline-flex items-center gap-[22px] relative flex-[0_0_auto]">
            <div className="relative w-fit font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-900 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] whitespace-nowrap [font-style:var(--body-small-400-font-style)]">
              Sắp xếp:
            </div>
            <div className="relative w-[180px] h-11 bg-gray-00 rounded-sm overflow-hidden border border-solid border-gray-100">
              <div className="absolute top-[calc(50.00%_-_10px)] left-4 font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-700 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] whitespace-nowrap [font-style:var(--body-small-400-font-style)]">
                Phổ biến nhất
              </div>
              <IconComponentNode
                className="!absolute !top-[calc(50.00%_-_8px)] !right-0 !w-4 !h-4"
                color="#ADB7BC"
              />
            </div>
          </div>
        </div>

        <div className="flex w-[984px] max-w-full items-center justify-between px-6 py-3 absolute top-[60px] left-0 bg-gray-50 rounded">
          <div className="inline-flex items-center gap-4 relative flex-[0_0_auto] flex-wrap">
            <div className="relative w-fit mt-[-1.00px] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-600 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] whitespace-nowrap [font-style:var(--body-small-400-font-style)]">
              Bộ lọc:
            </div>
            <div className="inline-flex items-center gap-1.5 relative flex-[0_0_auto]">
              <div className="relative w-fit mt-[-1.00px] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-900 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] whitespace-nowrap [font-style:var(--body-small-400-font-style)]">
                Thiết bị PC
              </div>
              <X className="!relative !w-3 !h-3 text-gray-600" />
            </div>
            <div className="inline-flex items-center gap-1.5 relative flex-[0_0_auto]">
              <div className="relative w-fit mt-[-1.00px] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-900 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] whitespace-nowrap [font-style:var(--body-small-400-font-style)]">
                Đánh giá 5 sao
              </div>
              <X className="!relative !w-3 !h-3 text-gray-600" />
            </div>
          </div>
          <div className="relative w-fit mt-[-1.00px] font-body-small-600 font-[number:var(--body-small-600-font-weight)] text-gray-900 text-[length:var(--body-small-600-font-size)] tracking-[var(--body-small-600-letter-spacing)] leading-[var(--body-small-600-line-height)] whitespace-nowrap [font-style:var(--body-small-600-font-style)]">
            {loading ? "Đang tải..." : `${products.length} sản phẩm`}
          </div>
        </div>

        <div className="inline-flex flex-col items-start gap-4 absolute top-32 left-0 w-full">
          {loading ? (
            <div className="w-[984px] max-w-full p-6 bg-white rounded border border-solid border-gray-100">
              <div className="font-body-small-400 text-gray-600">
                Đang tải sản phẩm...
              </div>
            </div>
          ) : (
            rows.map((row, rowIdx) => (
              <div
                key={rowIdx}
                className="inline-flex items-start gap-4 relative flex-[0_0_auto] flex-wrap"
              >
                {row.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showActions={
                      product.id === hoveredProductId ||
                      product.id === selectedProductId
                    }
                    isSelected={product.id === selectedProductId}
                    onSelect={(p) => setSelectedProductId(p.id)}
                    onOpenDetail={onOpenProductDetail}
                    onAddToCart={onAddToCart}
                    onHoverStart={() => setHoveredProductId(product.id)}
                    onHoverEnd={() => setHoveredProductId(null)}
                  />
                ))}
              </div>
            ))
          )}
        </div>

        <div className="inline-flex items-center justify-center gap-5 absolute top-[2168px] left-0 right-0 mx-auto flex-wrap">
          <button
            type="button"
            onClick={() => setActivePage((prev) => Math.max(prev - 1, 0))}
            disabled={activePage === 0}
            className={`p-2 inline-flex items-start gap-2.5 relative flex-[0_0_auto] rounded-[100px] border-[1.5px] border-solid ${
              activePage === 0
                ? "border-gray-200 cursor-not-allowed opacity-50"
                : "border-primary-500 cursor-pointer"
            }`}
            aria-label="Trang trước"
          >
            <ArrowLeft className="!relative !w-6 !h-6 text-primary-500" />
          </button>

          <div className="inline-flex items-start gap-2 relative flex-[0_0_auto] flex-wrap">
            {pageNumbers.map((page, idx) => (
              <button
                type="button"
                key={page}
                onClick={() => setActivePage(idx)}
                className={`inline-flex items-start gap-2.5 px-0 py-2.5 relative flex-[0_0_auto] rounded-[100px] ${
                  activePage === idx
                    ? "bg-primary-500"
                    : "bg-gray-00 border border-solid border-gray-100"
                }`}
              >
                <div
                  className={`relative w-10 mt-[-1.00px] text-center ${
                    activePage === idx
                      ? "font-body-small-600 font-[number:var(--body-small-600-font-weight)] text-gray-00 text-[length:var(--body-small-600-font-size)] tracking-[var(--body-small-600-letter-spacing)] leading-[var(--body-small-600-line-height)] [font-style:var(--body-small-600-font-style)]"
                      : "font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-900 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)]"
                  }`}
                >
                  {page}
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              setActivePage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={activePage === totalPages - 1}
            className={`p-2 inline-flex items-start gap-2.5 relative flex-[0_0_auto] rounded-[100px] border-[1.5px] border-solid ${
              activePage === totalPages - 1
                ? "border-gray-200 cursor-not-allowed opacity-50"
                : "border-primary-500 cursor-pointer"
            }`}
            aria-label="Trang sau"
          >
            <ArrowRight1 className="!relative !w-6 !h-6" color="#FA8232" />
          </button>
        </div>
      </div>
    </div>
  );
};
