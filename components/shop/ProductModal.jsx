import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "@/utils/cartStorage";
import { ShoppingCartSimple } from "../../ShoppingCartSimple";
import { Star } from "../../Star";
import { Star1 } from "../../Star1";
import { X } from "../../X";
import {
  formatPrice,
  getProductImageUrl,
  getProductPlaceholderByCategory,
  handleProductImageError,
} from "@/utils/productUtils";

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

const renderStars = (count) =>
  Array.from({ length: 5 }, (_, i) =>
    i < count ? (
      <Star key={i} className="!relative !w-4 !h-4" />
    ) : (
      <Star1 key={i} className="!relative !w-4 !h-4" />
    ),
  );

const ProgressBar = ({ label, value, max = 350 }) => {
  const v = Number(value);
  const pct = Number.isFinite(v) ? clamp((v / max) * 100, 0, 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="w-24 text-xs text-gray-600">{label}</div>
      <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-success-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="w-14 text-xs text-gray-900 text-right">{Number.isFinite(v) ? `${v} FPS` : "—"}</div>
    </div>
  );
};

export const ProductModal = ({ isOpen, product, onClose, onAddToCart, onCartUpdated }) => {
  const navigate = useNavigate();
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const safeProduct = product ?? null;
  const hasProImage =
    safeProduct?.pro_image != null && String(safeProduct.pro_image).trim() !== "";
  const category = safeProduct?.category ?? null;
  const rawImages = Array.isArray(safeProduct?.images) ? safeProduct.images : [];
  const images =
    rawImages.length > 0
      ? rawImages
      : hasProImage
        ? [getProductImageUrl(safeProduct.pro_image, category)]
        : safeProduct?.thumbnail
          ? [safeProduct.thumbnail]
          : [getProductPlaceholderByCategory(category)];
  const activeImage =
    images.length > 0
      ? images[clamp(activeImageIdx, 0, images.length - 1)]
      : null;
  const specs = safeProduct?.specs ?? null;
  const fps = safeProduct?.fps ?? null;

  const ratingValue = Number(safeProduct?.rating);
  const rating = Number.isFinite(ratingValue) ? clamp(ratingValue, 1, 5) : null;
  const ratingStars = rating ? clamp(Math.round(rating), 1, 5) : null;

  const stock = Number.isFinite(Number(safeProduct?.stock)) ? Number(safeProduct.stock) : null;
  const discount = Number.isFinite(Number(safeProduct?.discount)) ? Number(safeProduct.discount) : 0;

  useEffect(() => {
    if (!isOpen) return;
    setActiveImageIdx(0);
    setQuantity(1);
  }, [isOpen, safeProduct?.id]);

  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document?.body?.style?.overflow;
    if (document?.body?.style) document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (document?.body?.style) document.body.style.overflow = prevOverflow ?? "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_180ms_ease-out]" />

      <div className="relative w-full max-w-5xl rounded-3xl bg-gray-00 shadow-[0_25px_80px_rgba(0,0,0,0.30)] border border-solid border-gray-100 overflow-hidden animate-[scaleIn_200ms_ease-out]">
        <button
          type="button"
          onClick={() => onClose?.()}
          className="absolute top-4 right-4 z-10 h-10 w-10 inline-flex items-center justify-center rounded-full bg-gray-00/90 border border-solid border-gray-100 hover:bg-gray-00 active:scale-95 transition"
          aria-label="Đóng"
        >
          <X className="!relative !w-4 !h-4 text-gray-700" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="p-6 bg-gray-50">
            <div className="rounded-2xl overflow-hidden border border-solid border-gray-100 bg-[#f8f9fa] aspect-square">
              <img
                src={
                  activeImage ||
                  safeProduct?.thumbnail ||
                  getProductPlaceholderByCategory(category)
                }
                alt={safeProduct?.title ?? ""}
                className="w-full h-full object-contain bg-[#f8f9fa]"
                crossOrigin="anonymous"
                onError={(e) => handleProductImageError(e, getProductPlaceholderByCategory(category))}
              />
            </div>

            {images.length > 1 && (
              <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-1">
                {images.slice(0, 10).map((src, idx) => {
                  const isActive = idx === clamp(activeImageIdx, 0, images.length - 1);
                  return (
                    <button
                      key={`${src}-${idx}`}
                      type="button"
                      onClick={() => setActiveImageIdx(idx)}
                      className={`h-16 w-16 rounded-2xl overflow-hidden border border-solid shrink-0 transition ${
                        isActive ? "border-primary-500 shadow-sm" : "border-gray-100 hover:border-primary-200"
                      }`}
                      aria-label={`Ảnh ${idx + 1}`}
                    >
                      <img
                        src={src}
                        alt=""
                        className="w-full h-full object-contain bg-[#f8f9fa]"
                        crossOrigin="anonymous"
                        onError={(e) => handleProductImageError(e, getProductPlaceholderByCategory(category))}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-6 lg:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-gray-900 font-heading-05 leading-7">
                  {safeProduct?.title ?? "Sản phẩm"}
                </div>
                <div className="mt-2 flex items-center gap-3 flex-wrap">
                  <div className="text-secondary-500 text-2xl font-body-XL-600">
                    {formatPrice(safeProduct?.price)}
                  </div>
                  {discount > 0 ? (
                    <div className="px-3 py-1 rounded-full bg-danger-500 text-gray-00 text-xs font-body-small-600">
                      {`Giảm ${discount}%`}
                    </div>
                  ) : null}
                  {safeProduct?.tag ? (
                    <div className="px-3 py-1 rounded-full bg-primary-50 border border-solid border-primary-100 text-primary-500 text-xs font-body-small-600">
                      {String(safeProduct.tag)}
                    </div>
                  ) : null}
                </div>
              </div>

              {stock !== null ? (
                <div className="px-3 py-1 rounded-full bg-success-50 border border-solid border-success-100 text-success-600 text-xs whitespace-nowrap">
                  {`Còn ${stock} sp`}
                </div>
              ) : null}
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 flex-wrap">
              {ratingStars ? (
                <div className="inline-flex items-center gap-2">
                  <div className="inline-flex items-center gap-0.5">{renderStars(ratingStars)}</div>
                  <div>{rating ? `${rating.toFixed(1)}/5` : ""}</div>
                </div>
              ) : null}
              {safeProduct?.category ? (
                <div className="px-2 py-1 rounded-full bg-gray-50 border border-solid border-gray-100 text-gray-700">
                  {String(safeProduct.category)}
                </div>
              ) : null}
              {safeProduct?.performance ? (
                <div className="px-2 py-1 rounded-full bg-gray-50 border border-solid border-gray-100 text-gray-700">
                  {`Gaming: ${safeProduct.performance}`}
                </div>
              ) : null}
            </div>

            <div className="mt-5 text-gray-700 text-sm leading-6">
              {safeProduct?.description || "Không có mô tả."}
            </div>

            <div className="mt-6 rounded-2xl border border-solid border-gray-100 bg-gray-50 p-5">
              <div className="text-gray-900 font-heading-07 mb-4">Thông số kỹ thuật</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-gray-600">CPU</span>
                  <span className="text-gray-900 text-right">{specs?.cpu ?? "—"}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-gray-600">GPU</span>
                  <span className="text-gray-900 text-right">{specs?.gpu ?? "—"}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-gray-600">RAM</span>
                  <span className="text-gray-900 text-right">{specs?.ram ?? "—"}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-gray-600">Storage</span>
                  <span className="text-gray-900 text-right">{specs?.storage ?? "—"}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-gray-600">Mainboard</span>
                  <span className="text-gray-900 text-right">{specs?.motherboard ?? "—"}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-gray-600">PSU</span>
                  <span className="text-gray-900 text-right">{specs?.psu ?? "—"}</span>
                </div>
              </div>
            </div>

            {fps ? (
              <div className="mt-4 rounded-2xl border border-solid border-gray-100 bg-gray-00 p-5">
                <div className="text-gray-900 font-heading-07 mb-4">Gaming performance (1080p)</div>
                <div className="flex flex-col gap-3">
                  <ProgressBar label="Valorant" value={fps?.valorant} />
                  <ProgressBar label="GTA V" value={fps?.gtav} max={180} />
                  <ProgressBar label="Cyberpunk" value={fps?.cyberpunk} max={120} />
                </div>
              </div>
            ) : null}

            <div className="mt-6 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Số lượng</span>
                <div className="inline-flex items-center rounded-full border border-solid border-gray-100 overflow-hidden bg-gray-00">
                  <button
                    type="button"
                    className="px-4 py-2 hover:bg-gray-50 active:scale-95 transition"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Giảm"
                  >
                    -
                  </button>
                  <div className="px-4 py-2 text-gray-900 min-w-10 text-center">{quantity}</div>
                  <button
                    type="button"
                    className="px-4 py-2 hover:bg-gray-50 active:scale-95 transition"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Tăng"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => onAddToCart?.(safeProduct, quantity)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary-500 text-gray-00 shadow-sm hover:opacity-95 active:scale-95 transition"
                  disabled={!safeProduct}
                >
                  <ShoppingCartSimple className="!relative !w-5 !h-5" color="white" />
                  <span className="font-heading-07">Thêm vào giỏ</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!safeProduct?.id) return;
                    addToCart(safeProduct.id, quantity);
                    onCartUpdated?.();
                    onClose?.();
                    if (!localStorage.getItem("access_token")) {
                      sessionStorage.setItem("pendingCheckout", "1");
                      navigate("/login");
                      return;
                    }
                    navigate("/shop", { state: { openCheckout: true } });
                  }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gray-900 text-gray-00 shadow-sm hover:opacity-95 active:scale-95 transition"
                  disabled={!safeProduct}
                >
                  <span className="font-heading-07">Mua ngay</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

