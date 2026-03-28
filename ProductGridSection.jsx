import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "@/api/axios";
import { FilterBar } from "./components/shop/FilterBar";
import { Pagination } from "./components/shop/Pagination";
import { ProductModal } from "./components/shop/ProductModal";
import { ProductCard } from "./components/shop/ProductCard";
import { ProductSkeleton } from "./components/ProductSkeleton";
import { formatVND } from "@/utils/formatCurrency";
import { generatePrice } from "@/utils/generatePrice";
import { getProductImageUrl } from "@/utils/productUtils";

const PRODUCTS_PER_PAGE = 12;

const mapApiProductToCard = (p, idx) => {
  if (p?.pro_id != null) {
    const id = p.pro_id;
    const title = p.pro_name ?? "Sản phẩm";
    const priceNum = Number(p.pro_price);
    const priceVnd = Number.isFinite(priceNum) ? priceNum : 0;
    const category = p.cat_name ?? "pc-components";
    const stockRaw = p.real_stock ?? p.pro_quantity;
    const stock = Number.isFinite(Number(stockRaw)) ? Number(stockRaw) : null;
    const seed = (Number(id) || 1) * 7919;
    const rating = 3.5 + ((seed % 16) / 10);
    const stars = clamp(Math.round(rating), 1, 5);
    const specs = {
      cpu: "—",
      gpu: "—",
      ram: "—",
      storage: "—",
      motherboard: "—",
      psu: "—",
    };
    const mainImage = getProductImageUrl(p?.pro_image, category);
    return {
      id,
      title,
      price: priceVnd,
      priceFormatted: formatVND(priceVnd),
      pro_image: p.pro_image ?? null,
      thumbnail: mainImage,
      images: [mainImage],
      rating,
      stars,
      reviews: "(0)",
      description: p.description ?? "",
      category,
      specs,
      performance: null,
      stock,
      discount: 0,
      tag: null,
      fps: null,
      originalPrice: null,
      badge: null,
      hovered: false,
    };
  }

  const id = p?.id ?? p?._id ?? idx + 1;
  const title = p?.title ?? p?.name ?? "Sản phẩm";
  const category = p?.category ?? "pc-components";
  const priceVnd = generatePrice(category, title);
  const thumbnail =
    p?.pro_image != null && String(p.pro_image).trim() !== ""
      ? getProductImageUrl(p?.pro_image, category)
      : p?.thumbnail ??
        p?.thumbnailUrl ??
        p?.image ??
        p?.imageUrl ??
        p?.images?.[0] ??
        getProductImageUrl(null, category);

  const ratingValue = Number(p?.rating);
  const rating = Number.isFinite(ratingValue) ? ratingValue : 4.5;
  const stars = clamp(Math.round(rating), 1, 5);

  const resolvedThumb = thumbnail || getProductImageUrl(null, category);
  return {
    id,
    title,
    price: priceVnd,
    priceFormatted: formatVND(priceVnd),
    pro_image: p?.pro_image ?? null,
    thumbnail: resolvedThumb,
    images:
      Array.isArray(p?.images) && p.images.length
        ? p.images
        : [resolvedThumb],
    rating,
    stars,
    reviews: "(0)",
    description: p?.description ?? "",
    category: category ?? null,
    specs: p?.specs ?? null,
    performance: p?.performance ?? null,
    stock: Number.isFinite(Number(p?.stock)) ? Number(p.stock) : null,
    discount: Number.isFinite(Number(p?.discount)) ? Number(p.discount) : 0,
    tag: p?.tag ?? null,
    fps: p?.fps ?? null,
    originalPrice: null,
    badge:
      Number(p?.discount) > 0
        ? {
            bg: "bg-warning-300",
            textColor: "text-gray-900",
            label: `-${Number(p.discount)}%`,
          }
        : null,
    hovered: false,
  };
};

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export const ProductGridSection = ({ onOpenProductDetail, onAddToCart, onCartUpdated }) => {
  const [searchParams] = useSearchParams();
  const appliedSearch = (searchParams.get("search") ?? "").trim();

  const [activePage, setActivePage] = useState(0);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterGpu, setFilterGpu] = useState("All");
  const [filterRam, setFilterRam] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortOption, setSortOption] = useState("popular");
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const loadProducts = useCallback(async (searchTerm) => {
    setLoading(true);
    setLoadError(null);
    try {
      const params = { page: 1, limit: 200 };
      const term = String(searchTerm ?? "").trim();
      if (term) params.search = term;
      const envelope = await api.get("/products", { params });
      const list = Array.isArray(envelope?.data) ? envelope.data : [];
      const cards = list.map(mapApiProductToCard);
      setProducts(cards);
      setLoadError(null);
    } catch (err) {
      setProducts([]);
      setLoadError(
        err?.userMessage ||
          err?.response?.data?.message ||
          err?.message ||
          "Không tải được danh sách sản phẩm.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts(appliedSearch);
  }, [appliedSearch, loadProducts]);

  useEffect(() => {
    if (!Array.isArray(products)) return;
    setActivePage(0);
  }, [products]);

  const hasProductsLoaded = Array.isArray(products);
  const safeProducts = hasProductsLoaded ? products : [];

  const filterOptions = useMemo(() => {
    const gpus = new Set();
    const rams = new Set();
    const categoriesSet = new Set();
    for (const p of safeProducts) {
      const gpuText = String(p?.specs?.gpu ?? "").trim();
      const ramText = String(p?.specs?.ram ?? "").trim();
      const catText = String(p?.category ?? "").trim();
      if (gpuText) gpus.add(gpuText);
      if (ramText) rams.add(ramText);
      if (catText) categoriesSet.add(catText);
    }
    return {
      gpus: ["All", ...Array.from(gpus).sort((a, b) => a.localeCompare(b))],
      rams: ["All", ...Array.from(rams).sort((a, b) => a.localeCompare(b))],
      categories: ["All", ...Array.from(categoriesSet).sort((a, b) => a.localeCompare(b))],
    };
  }, [safeProducts]);

  const filteredSortedProducts = useMemo(() => {
    const base = safeProducts.filter((p) => {
      const matchesGpu =
        filterGpu === "All" || String(p?.specs?.gpu ?? "").trim() === filterGpu;
      const matchesRam =
        filterRam === "All" || String(p?.specs?.ram ?? "").trim() === filterRam;
      const matchesCategory =
        filterCategory === "All" || String(p?.category ?? "").trim() === filterCategory;

      return matchesGpu && matchesRam && matchesCategory;
    });

    const sorted = [...base];
    if (sortOption === "priceAsc") {
      sorted.sort((a, b) => (Number(a?.price) || 0) - (Number(b?.price) || 0));
    } else if (sortOption === "priceDesc") {
      sorted.sort((a, b) => (Number(b?.price) || 0) - (Number(a?.price) || 0));
    } else if (sortOption === "ratingDesc") {
      sorted.sort((a, b) => (Number(b?.rating) || 0) - (Number(a?.rating) || 0));
    }
    return sorted;
  }, [safeProducts, filterGpu, filterRam, filterCategory, sortOption]);

  useEffect(() => {
    setActivePage(0);
  }, [appliedSearch, filterGpu, filterRam, filterCategory, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filteredSortedProducts.length / PRODUCTS_PER_PAGE));
  const safeActivePage = clamp(activePage, 0, totalPages - 1);
  const startIndex = safeActivePage * PRODUCTS_PER_PAGE;
  const currentPageProducts = useMemo(
    () => filteredSortedProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE),
    [filteredSortedProducts, startIndex],
  );
  const pageNumbers = Array.from({ length: totalPages }, (_, idx) =>
    String(idx + 1).padStart(2, "0"),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { opacity: 0; transform: translateY(6px) scale(.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>

      <ProductModal
        isOpen={isModalOpen}
        product={selectedProduct}
        onAddToCart={onAddToCart}
        onCartUpdated={onCartUpdated}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
      />

      <FilterBar
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterGpu={filterGpu}
        setFilterGpu={setFilterGpu}
        filterRam={filterRam}
        setFilterRam={setFilterRam}
        sortOption={sortOption}
        setSortOption={setSortOption}
        filterOptions={filterOptions}
      />

      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="text-gray-900 font-heading-03">PC Store</div>
            <div className="text-gray-600 text-sm mt-1">
              Sản phẩm chính hãng • Giao nhanh • Trả góp 0%
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {loading || !hasProductsLoaded
              ? "Đang tải..."
              : loadError
                ? "Lỗi tải dữ liệu"
                : `${filteredSortedProducts.length} sản phẩm`}
          </div>
        </div>

        {loadError && !loading ? (
          <div
            className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
            role="alert"
          >
            {loadError}
          </div>
        ) : null}

        <div className="mt-6">
          {loading || !hasProductsLoaded ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : loadError ? (
            <div className="rounded-3xl border border-solid border-gray-100 bg-gray-00 p-8 text-gray-700 shadow-sm">
              Không có dữ liệu sản phẩm. Hãy bật Backend (Docker) hoặc kiểm tra{" "}
              <code className="text-xs bg-gray-100 px-1 rounded">VITE_API_URL</code> / chứng chỉ HTTPS.
            </div>
          ) : filteredSortedProducts.length === 0 ? (
            <div className="rounded-3xl border border-solid border-gray-100 bg-gray-00 p-8 text-gray-700 shadow-sm">
              {appliedSearch.trim() && safeProducts.length === 0 ? (
                <p>
                  Rất tiếc, không tìm thấy linh kiện nào phù hợp với:{" "}
                  <span className="font-body-medium-600 text-gray-900">{appliedSearch.trim()}</span>
                </p>
              ) : appliedSearch.trim() && safeProducts.length > 0 ? (
                <p>Không có sản phẩm nào khớp bộ lọc hiện tại. Hãy thử đổi GPU / RAM / danh mục.</p>
              ) : (
                <p>Không tìm thấy sản phẩm phù hợp. Hãy thử đổi từ khoá / bộ lọc.</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {currentPageProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showActions={
                    product.id === hoveredProductId || product.id === selectedProductId
                  }
                  isSelected={product.id === selectedProductId}
                  onSelect={(p) => setSelectedProductId(p.id)}
                  onOpenDetail={(p) => {
                    setSelectedProduct(p ?? null);
                    setIsModalOpen(true);
                  }}
                  onAddToCart={onAddToCart}
                  onHoverStart={() => setHoveredProductId(product.id)}
                  onHoverEnd={() => setHoveredProductId(null)}
                />
              ))}
            </div>
          )}
        </div>

        <Pagination
          pageNumbers={pageNumbers}
          activePage={safeActivePage}
          setActivePage={setActivePage}
          totalPages={totalPages}
        />
      </main>
    </div>
  );
};
