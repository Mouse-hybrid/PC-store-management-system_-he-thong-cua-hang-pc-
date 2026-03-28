import { useEffect, useMemo, useState } from "react";
import { formatVND } from "@/utils/formatCurrency";
import { api } from "@/api/axios";
import {
  getProductImageUrl,
  getProductPlaceholderByCategory,
  handleProductImageError,
  PRODUCT_IMAGE_FALLBACK,
} from "@/utils/productUtils";

const SECTION_TITLES = [
  "SẢN PHẨM LIÊN QUAN",
  "SẢN PHẨM NỔI BẬT",
  "SẢN PHẨM ĐỀ XUẤT",
  "PC CAO CẤP",
];

function mapToRelatedItem(p) {
  const priceNum = Number(p?.pro_price);
  const price = Number.isFinite(priceNum) ? priceNum : 0;
  const category = p?.cat_name ?? null;
  return {
    image: getProductImageUrl(p?.pro_image ?? null, category),
    name: p?.pro_name ?? "Sản phẩm",
    price,
    category,
  };
}

export const RelatedProductsSection = () => {
  const [sections, setSections] = useState(() =>
    SECTION_TITLES.map((title) => ({ title, products: [] })),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const envelope = await api.get("/products", { params: { page: 1, limit: 12 } });
        const list = Array.isArray(envelope?.data) ? envelope.data : [];
        const items = list.map(mapToRelatedItem);
        const perSection = 3;
        const next = SECTION_TITLES.map((title, sIdx) => ({
          title,
          products: items.slice(sIdx * perSection, sIdx * perSection + perSection),
        }));
        if (!cancelled) {
          setSections(next);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.userMessage ||
              err?.response?.data?.message ||
              err?.message ||
              "Không tải được gợi ý.",
          );
          setSections(
            SECTION_TITLES.map((title) => ({
              title,
              products: [
                { image: PRODUCT_IMAGE_FALLBACK, name: "—", price: 0 },
                { image: PRODUCT_IMAGE_FALLBACK, name: "—", price: 0 },
                { image: PRODUCT_IMAGE_FALLBACK, name: "—", price: 0 },
              ],
            })),
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const data = useMemo(() => sections, [sections]);

  return (
    <div className="flex flex-col items-stretch px-[300px] py-[72px] w-full max-w-[1920px] mx-auto">
      {loading ? (
        <div className="text-sm text-gray-600 w-full text-center py-8">Đang tải sản phẩm gợi ý...</div>
      ) : (
        <>
          {error ? (
            <div
              className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mb-6 w-full max-w-2xl"
              role="alert"
            >
              {error}
            </div>
          ) : null}
          <div className="inline-flex items-start justify-center gap-6 flex-wrap w-full">
            {data.map((section) => (
              <div
                key={section.title}
                className="inline-flex flex-col items-start gap-4 relative flex-[0_0_auto]"
              >
                <div className="relative w-[312px] font-body-medium-600 text-gray-900">
                  {section.title}
                </div>

                {section.products.map((product, idx) => (
                  <div
                    key={`${section.title}-${idx}`}
                    className="inline-flex items-center justify-center gap-3 p-3 relative flex-[0_0_auto] bg-gray-00 rounded-[3px] border border-solid border-gray-100"
                  >
                    <img
                      className="relative w-20 h-20 object-contain bg-[#f8f9fa]"
                      alt={product.name}
                      src={product.image}
                      crossOrigin="anonymous"
                      onError={(e) =>
                        handleProductImageError(e, getProductPlaceholderByCategory(product.category))
                      }
                    />

                    <div className="flex-col gap-2 inline-flex items-start relative flex-[0_0_auto]">
                      <div className="relative w-[196px] font-body-small-400 text-gray-900">
                        {product.name}
                      </div>
                      <div className="inline-flex items-start gap-1 relative flex-[0_0_auto]">
                        <div className="relative w-fit font-body-small-600 text-secondary-500">
                          {formatVND(product.price)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
