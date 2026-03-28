import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "../../ArrowLeft";
import { ArrowRight } from "../../ArrowRight";
import { ArrowRight1 } from "../../ArrowRight1";
import { api } from "@/api/axios";
import { formatPrice, getProductImageUrl } from "@/utils/productUtils";
import { readCart } from "@/utils/cartStorage";

const pageSize = 4;

/** Map một dòng API (pro_id / pro_name / pro_price / pro_image / cat_name) sang hiển thị giỏ hàng */
function mapApiRowToCartLine(p) {
  if (p?.pro_id != null) {
    const id = p.pro_id;
    const category = p.cat_name ?? "pc-components";
    const priceNum = Number(p.pro_price);
    const price = Number.isFinite(priceNum) ? priceNum : 0;
    return {
      id,
      title: p.pro_name ?? "Sản phẩm",
      price,
      imageUrl: getProductImageUrl(p?.pro_image, category),
      category,
    };
  }
  const id = p?.id ?? p?._id;
  const category = p?.category ?? "pc-components";
  const priceNum = Number(p?.pro_price ?? p?.price);
  const price = Number.isFinite(priceNum) ? priceNum : 0;
  return {
    id,
    title: p?.title ?? p?.name ?? "Sản phẩm",
    price,
    imageUrl: getProductImageUrl(p?.pro_image ?? null, category),
    category,
  };
}

export const CartPage = ({ onGoShop, onGoCheckout, onCartChange }) => {
  const [activePage, setActivePage] = useState(0);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [items, setItems] = useState([]);

  const refreshFromStorageAndApi = useCallback(async () => {
    const entries = readCart();
    if (entries.length === 0) {
      setItems([]);
      setLoading(false);
      setLoadError(null);
      onCartChange?.();
      return;
    }

    setLoading(true);
    setLoadError(null);
    try {
      const envelope = await api.get("/products", {
        params: { page: 1, limit: 500 },
      });
      const list = Array.isArray(envelope?.data) ? envelope.data : [];
      const byId = new Map();
      for (const row of list) {
        const pid = row?.pro_id ?? row?.id;
        if (pid != null) byId.set(Number(pid), row);
      }

      const merged = entries.map(({ id, quantity }) => {
        const row = byId.get(Number(id));
        if (!row) {
          return {
            id,
            quantity,
            missing: true,
            title: `Sản phẩm #${id}`,
            price: 0,
            imageUrl: getProductImageUrl(null, null),
          };
        }
        const m = mapApiRowToCartLine(row);
        return { ...m, quantity, missing: false };
      });
      setItems(merged);
    } catch (err) {
      setLoadError(
        err?.userMessage ||
          err?.response?.data?.message ||
          err?.message ||
          "Không tải được sản phẩm.",
      );
      setItems([]);
    } finally {
      setLoading(false);
      onCartChange?.();
    }
  }, [onCartChange]);

  useEffect(() => {
    refreshFromStorageAndApi();
  }, [refreshFromStorageAndApi]);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safeActivePage = Math.min(activePage, totalPages - 1);
  const pagedItems = items.slice(
    safeActivePage * pageSize,
    safeActivePage * pageSize + pageSize,
  );

  const selectedIdsSet = new Set(selectedItemIds);
  const subtotalValue = items
    .filter((it) => selectedIdsSet.has(it.id) && !it.missing)
    .reduce((sum, it) => sum + it.price * it.quantity, 0);

  const subtotalFormatted = formatPrice(subtotalValue);
  const discountFormatted = formatPrice(0);
  const totalFormatted = formatPrice(subtotalValue);
  const shipping = "Free";

  return (
    <div className="relative w-full px-[300px] box-border py-10">
      <div className="flex items-start justify-between gap-10">
        <div className="flex-1 min-w-[700px]">
          <div className="w-full bg-gray-00 rounded border border-solid border-gray-100">
            <div className="grid grid-cols-12 gap-0 px-6 py-4 bg-gray-50 border-b border-solid border-gray-100 text-gray-700 text-sm font-body-small-400">
              <div className="col-span-2">SẢN PHẨM</div>
              <div className="col-span-2">GIÁ</div>
              <div className="col-span-3">SỐ LƯỢNG</div>
              <div className="col-span-2">TẠM TÍNH</div>
              <div className="col-span-3" />
            </div>

            <div className="px-6 py-4">
              {loading ? (
                <div className="text-gray-600 py-10 text-center">Đang tải giỏ hàng…</div>
              ) : loadError ? (
                <div className="text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm" role="alert">
                  {loadError}
                </div>
              ) : items.length === 0 ? (
                <div className="text-gray-600 py-10 text-center">
                  Giỏ hàng trống. Hãy quay lại mua sắm.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {pagedItems.map((it) => (
                    <div
                      key={it.id}
                      onClick={() =>
                        setSelectedItemIds((prev) =>
                          prev.includes(it.id) ? prev.filter((id) => id !== it.id) : [...prev, it.id],
                        )
                      }
                      className={`grid grid-cols-12 items-center gap-0 py-3 border-b border-solid border-gray-100 cursor-pointer ${
                        selectedIdsSet.has(it.id) ? "bg-primary-50" : ""
                      }`}
                    >
                      <div className="col-span-2 inline-flex items-center gap-3 min-w-0">
                        <img
                          className="w-12 h-12 object-contain bg-[#f8f9fa] rounded shrink-0"
                          alt=""
                          src={it.imageUrl}
                          crossOrigin="anonymous"
                        />
                        <span className="text-gray-900 text-sm truncate" title={it.title}>
                          {it.title}
                          {it.missing ? (
                            <span className="block text-xs text-amber-700">Không tìm thấy trên cửa hàng</span>
                          ) : null}
                        </span>
                      </div>
                      <div className="col-span-2 text-gray-700 text-sm">{formatPrice(it.price)}</div>
                      <div className="col-span-3 text-gray-700 text-sm">
                        {String(it.quantity).padStart(2, "0")}
                      </div>
                      <div className="col-span-2 text-gray-700 text-sm">
                        {formatPrice(it.price * it.quantity)}
                      </div>
                      <div className="col-span-3 flex items-center justify-end">
                        <span className="inline-flex items-center gap-2 text-gray-600 text-sm">
                          {selectedIdsSet.has(it.id) ? "Đã chọn" : "Chọn"}
                          <ArrowRight className="!w-4 !h-4" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {items.length > 0 && !loading && (
            <div className="flex items-center justify-center gap-5 mt-8 flex-wrap">
              <button
                type="button"
                onClick={() => setActivePage((p) => Math.max(0, p - 1))}
                className="p-2 border-[1.5px] border-solid border-primary-500 inline-flex items-start gap-2.5 relative flex-[0_0_auto] rounded-[100px]"
              >
                <ArrowLeft className="!relative !w-6 !h-6 text-primary-500" />
              </button>

              <div className="inline-flex items-start gap-2 relative flex-[0_0_auto] flex-wrap">
                {Array.from({ length: totalPages }, (_, idx) => idx).map((pageIdx) => {
                  const isActive = safeActivePage === pageIdx;
                  return (
                    <button
                      key={pageIdx}
                      type="button"
                      onClick={() => setActivePage(pageIdx)}
                      className={`inline-flex items-start gap-2.5 px-0 py-2.5 relative flex-[0_0_auto] rounded-[100px] ${
                        isActive ? "bg-primary-500" : "bg-gray-00 border border-solid border-gray-100"
                      }`}
                    >
                      <div
                        className={`relative w-10 mt-[-1.00px] text-center ${
                          isActive
                            ? "font-body-small-600 text-gray-00"
                            : "font-body-small-400 text-gray-900"
                        }`}
                      >
                        {String(pageIdx + 1).padStart(2, "0")}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setActivePage((p) => Math.min(totalPages - 1, p + 1))}
                className="p-2 border-[1.5px] border-solid border-primary-500 inline-flex items-start gap-2.5 relative flex-[0_0_auto] rounded-[100px]"
              >
                <ArrowRight1 className="!relative !w-6 !h-6" color="#FA8232" />
              </button>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <button
              type="button"
              onClick={onGoShop}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm border-2 border-solid border-secondary-500 text-secondary-500 font-heading-07 cursor-pointer"
            >
              <ArrowLeft className="!w-5 !h-5" />
              QUAY LẠI CỬA HÀNG
            </button>
            <button
              type="button"
              onClick={() => refreshFromStorageAndApi()}
              className="inline-flex items-center justify-center px-6 py-3 rounded-sm border-2 border-solid border-secondary-500 text-secondary-500 font-heading-07 cursor-pointer"
            >
              CẬP NHẬT GIỎ HÀNG
            </button>
          </div>
        </div>

        <div className="w-[420px] bg-gray-00 rounded border border-solid border-gray-100 p-6">
          <div className="font-body-large-500 text-gray-900 text-lg mb-4">Tổng đơn hàng</div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tạm tính</span>
              <span className="text-gray-900">{subtotalFormatted}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Phí vận chuyển</span>
              <span className="text-gray-900">{shipping}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Giảm giá</span>
              <span className="text-gray-900">{discountFormatted}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-solid border-gray-100">
              <span className="text-gray-900 font-body-medium-400">Tổng thanh toán</span>
              <span className="text-gray-900 font-body-medium-600">{totalFormatted}</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() =>
                onGoCheckout?.({
                  subtotalValue,
                  totalValue: subtotalValue,
                })
              }
              className="w-full py-3 bg-primary-500 text-gray-00 rounded-sm cursor-pointer font-heading-06"
            >
              TIẾN HÀNH THANH TOÁN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
