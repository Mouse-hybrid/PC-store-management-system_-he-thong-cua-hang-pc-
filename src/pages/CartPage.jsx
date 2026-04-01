import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "../../ArrowLeft";
import { ArrowRight } from "../../ArrowRight";
import { ArrowRight1 } from "../../ArrowRight1";
import { api } from "@/api/axios";
import { formatPrice, getProductImageUrl } from "@/utils/productUtils";
// 👉 ĐÃ THÊM: Import thêm updateQuantity và removeFromCart
import { readCart, updateQuantity, removeFromCart } from "@/utils/cartStorage"; 
// 👉 ĐÃ THÊM: Import icon từ lucide-react
import { Minus, Plus, Trash2 } from "lucide-react"; 

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
      setSelectedItemIds([]);
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
      
      const validIds = merged.filter((it) => !it.missing).map((it) => it.id);
      
      // Giữ nguyên các item đã chọn trước đó, loại bỏ các item không còn trong giỏ
      setSelectedItemIds(prev => {
        // if (prev.length === 0) return validIds;
        return prev.filter(id => validIds.includes(id));
      });

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

  // 👉 CÁC HÀM XỬ LÝ SỰ KIỆN MỚI
  const handleQuantityChange = (e, id, newQuantity) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài làm tick chọn dòng
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
    refreshFromStorageAndApi();
  };

  const handleRemoveItem = (e, id) => {
    e.stopPropagation(); // Ngăn click lan ra ngoài
    removeFromCart(id);
    refreshFromStorageAndApi();
  };

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
              <div className="col-span-4">SẢN PHẨM</div>
              <div className="col-span-2 text-center">GIÁ</div>
              <div className="col-span-2 text-center">SỐ LƯỢNG</div>
              <div className="col-span-2 text-center">TẠM TÍNH</div>
              <div className="col-span-2 text-right">CHỌN MUA</div>
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
                      className={`grid grid-cols-12 items-center gap-0 py-3 border-b border-solid border-gray-100 cursor-pointer transition-colors ${
                        selectedIdsSet.has(it.id) ? "bg-primary-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="col-span-4 inline-flex items-center gap-3 min-w-0 pr-2">
                        <img
                          className="w-12 h-12 object-contain bg-[#f8f9fa] rounded shrink-0"
                          alt=""
                          src={it.imageUrl}
                          crossOrigin="anonymous"
                        />
                        <span className="text-gray-900 text-sm truncate" title={it.title}>
                          {it.title}
                          {it.missing ? (
                            <span className="block text-xs text-amber-700 mt-1">Không tìm thấy trên cửa hàng</span>
                          ) : null}
                        </span>
                      </div>
                      
                      <div className="col-span-2 text-gray-700 text-sm text-center">{formatPrice(it.price)}</div>
                      
                      {/* 👉 ĐÃ SỬA: Cột Số lượng (Tích hợp Nút Tăng/Giảm) */}
                      <div className="col-span-2 flex items-center justify-center">
                        <div className="flex items-center gap-2 border border-gray-200 rounded-md bg-white">
                          <button 
                            onClick={(e) => handleQuantityChange(e, it.id, it.quantity - 1)}
                            className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors rounded-l-md"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium text-gray-800">
                            {it.quantity}
                          </span>
                          <button 
                            onClick={(e) => handleQuantityChange(e, it.id, it.quantity + 1)}
                            className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors rounded-r-md"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="col-span-2 text-gray-700 text-sm font-medium text-center text-primary-600">
                        {formatPrice(it.price * it.quantity)}
                      </div>
                      
                      {/* 👉 ĐÃ SỬA: Cột Cuối cùng (Tích hợp nút Thùng Rác) */}
                      <div className="col-span-2 flex items-center justify-end gap-3">
                        <button 
                          onClick={(e) => handleRemoveItem(e, it.id)}
                          title="Xóa sản phẩm"
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>

                        <span className={`inline-flex items-center gap-1 text-sm font-medium w-[85px] justify-end ${selectedIdsSet.has(it.id) ? 'text-primary-600' : 'text-gray-500'}`}>
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

          {/* ... (Các phần phân trang và panel bên phải giữ nguyên như cũ) ... */}
          {items.length > 0 && !loading && (
            <div className="flex items-center justify-center gap-5 mt-8 flex-wrap">
              <button
                type="button"
                onClick={() => setActivePage((p) => Math.max(0, p - 1))}
                className="p-2 border-[1.5px] border-solid border-primary-500 inline-flex items-start gap-2.5 relative flex-[0_0_auto] rounded-[100px] hover:bg-primary-50"
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
                      className={`inline-flex items-start gap-2.5 px-0 py-2.5 relative flex-[0_0_auto] rounded-[100px] transition-colors ${
                        isActive ? "bg-primary-500" : "bg-gray-00 border border-solid border-gray-100 hover:bg-gray-50"
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
                className="p-2 border-[1.5px] border-solid border-primary-500 inline-flex items-start gap-2.5 relative flex-[0_0_auto] rounded-[100px] hover:bg-primary-50"
              >
                <ArrowRight1 className="!relative !w-6 !h-6" color="#FA8232" />
              </button>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <button
              type="button"
              onClick={onGoShop}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm border-2 border-solid border-secondary-500 text-secondary-500 font-heading-07 cursor-pointer hover:bg-secondary-50 transition-colors"
            >
              <ArrowLeft className="!w-5 !h-5" />
              QUAY LẠI CỬA HÀNG
            </button>
            <button
              type="button"
              onClick={() => refreshFromStorageAndApi()}
              className="inline-flex items-center justify-center px-6 py-3 rounded-sm border-2 border-solid border-secondary-500 text-secondary-500 font-heading-07 cursor-pointer hover:bg-secondary-50 transition-colors"
            >
              CẬP NHẬT GIỎ HÀNG
            </button>
          </div>
        </div>

        <div className="w-[420px] bg-gray-00 rounded border border-solid border-gray-100 p-6 shadow-sm sticky top-6">
          <div className="font-body-large-500 text-gray-900 text-lg mb-4 uppercase">Tổng đơn hàng</div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tạm tính ({selectedIdsSet.size} sản phẩm)</span>
              <span className="text-gray-900 font-medium">{subtotalFormatted}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Phí vận chuyển</span>
              <span className="text-green-600 font-medium">{shipping}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Giảm giá</span>
              <span className="text-gray-900 font-medium">{discountFormatted}</span>
            </div>
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-solid border-gray-100">
              <span className="text-gray-900 font-body-medium-400 text-lg">Tổng thanh toán</span>
              <span className="text-primary-500 text-2xl font-bold">{totalFormatted}</span>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="button"
              disabled={subtotalValue === 0}
              onClick={() =>
                onGoCheckout?.({
                  subtotalValue,
                  totalValue: subtotalValue,
                })
              }
              className={`w-full py-4 text-gray-00 rounded-sm cursor-pointer font-heading-06 transition-all ${
                subtotalValue === 0 
                ? "bg-gray-400 opacity-70 cursor-not-allowed" 
                : "bg-primary-500 hover:bg-primary-600 hover:shadow-lg"
              }`}
            >
              {subtotalValue === 0 ? "VUI LÒNG CHỌN SẢN PHẨM" : "TIẾN HÀNH THANH TOÁN"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};