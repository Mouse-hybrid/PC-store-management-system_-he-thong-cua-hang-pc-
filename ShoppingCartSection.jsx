import { useMemo, useState } from "react";
import { ArrowLeft } from "./ArrowLeft";
import { ArrowRight } from "./ArrowRight";
import { ArrowRight1 } from "./ArrowRight1";
import productPh from "./shop-product-placeholder.svg";
import { formatVND } from "@/utils/formatCurrency";
import { generatePrice } from "@/utils/generatePrice";

export const ShoppingCartSection = ({ cartCount = 0, onGoShop, onGoCheckout }) => {
  const pageSize = 4;
  const [activePage, setActivePage] = useState(0);
  const [selectedItemIds, setSelectedItemIds] = useState([]);

  const items = useMemo(() => {
    if (!cartCount || cartCount <= 0) return [];

    // Demo: mỗi lần "add to cart" được tính là 1 sản phẩm trong giỏ.
    return Array.from({ length: cartCount }, (_, idx) => ({
      id: idx + 1,
      name: `Sản phẩm #${idx + 1}`,
      image: productPh,
      price: generatePrice("cart", `Sản phẩm #${idx + 1}`),
      qty: 1,
    }));
  }, [cartCount]);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safeActivePage = Math.min(activePage, totalPages - 1);
  const pagedItems = items.slice(
    safeActivePage * pageSize,
    safeActivePage * pageSize + pageSize,
  );

  const selectedIdsSet = new Set(selectedItemIds);
  const subtotalValue = items
    .filter((it) => selectedIdsSet.has(it.id))
    .reduce((sum, it) => sum + it.price * it.qty, 0);
  const subtotal = formatVND(subtotalValue);
  const shipping = "Free";
  const discount = formatVND(0);
  const total = formatVND(subtotalValue);

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
              {items.length === 0 ? (
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
                          prev.includes(it.id)
                            ? prev.filter((id) => id !== it.id)
                            : [...prev, it.id],
                        )
                      }
                      className={`grid grid-cols-12 items-center gap-0 py-3 border-b border-solid border-gray-100 cursor-pointer ${
                        selectedIdsSet.has(it.id) ? "bg-primary-50" : ""
                      }`}
                    >
                      <div className="col-span-2 inline-flex items-center gap-3">
                        <img
                          className="w-12 h-12 object-cover"
                          alt=""
                          src={it.image}
                          crossOrigin="anonymous"
                        />
                      </div>
                      <div className="col-span-2 text-gray-700 text-sm">{formatVND(it.price)}</div>
                      <div className="col-span-3 text-gray-700 text-sm">{String(it.qty).padStart(2, "0")}</div>
                      <div className="col-span-2 text-gray-700 text-sm">
                        {formatVND(it.price * it.qty)}
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

          {items.length > 0 && (
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
                        isActive
                          ? "bg-primary-500"
                          : "bg-gray-00 border border-solid border-gray-100"
                      }`}
                    >
                      <div
                        className={`relative w-10 mt-[-1.00px] text-center ${
                          isActive
                            ? "font-body-small-600 font-[number:var(--body-small-600-font-weight)] text-gray-00 text-[length:var(--body-small-600-font-size)] tracking-[var(--body-small-600-letter-spacing)] leading-[var(--body-small-600-line-height)] [font-style:var(--body-small-600-font-style)]"
                            : "font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-900 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)]"
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
                onClick={() =>
                  setActivePage((p) => Math.min(totalPages - 1, p + 1))
                }
                className="p-2 border-[1.5px] border-solid border-primary-500 inline-flex items-start gap-2.5 relative flex-[0_0_auto] rounded-[100px]"
              >
                <ArrowRight1
                  className="!relative !w-6 !h-6"
                  color="#FA8232"
                />
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
              <span className="text-gray-900">{subtotal}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Phí vận chuyển</span>
              <span className="text-gray-900">{shipping}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Giảm giá</span>
              <span className="text-gray-900">{discount}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-solid border-gray-100">
              <span className="text-gray-900 font-body-medium-400">Tổng thanh toán</span>
              <span className="text-gray-900 font-body-medium-600">{total}</span>
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

