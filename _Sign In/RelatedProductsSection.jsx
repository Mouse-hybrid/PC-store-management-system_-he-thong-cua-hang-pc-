import { useMemo } from "react";
import placeholder from "./shop-product-placeholder.svg";

const relatedProductsData = [
  {
    title: "SẢN PHẨM LIÊN QUAN",
    products: [
      { image: placeholder, name: "Name xxx", price: "$1,500" },
      { image: placeholder, name: "Name xxx", price: "$1,500" },
      { image: placeholder, name: "Name xxx", price: "$1,500" },
    ],
  },
  {
    title: "SẢN PHẨM NỔI BẬT",
    products: [
      { image: placeholder, name: "Name xxx", price: "$1,500" },
      { image: placeholder, name: "Name xxx", price: "$1,500" },
      { image: placeholder, name: "Name xxx", price: "$1,500" },
    ],
  },
  {
    title: "SẢN PHẨM ĐỀ XUẤT",
    products: [
      { image: placeholder, name: "Name xxx", price: "$1,500" },
      { image: placeholder, name: "Name xxx", price: "$1,500" },
      { image: placeholder, name: "Name xxx", price: "$1,500" },
    ],
  },
  {
    title: "PC CAO CẤP",
    products: [
      { image: placeholder, name: "Name xxx", price: "$1,500" },
      { image: placeholder, name: "Name xxx", price: "$1,500" },
      { image: placeholder, name: "Name xxx", price: "$1,500" },
    ],
  },
];

export const RelatedProductsSection = () => {
  const data = useMemo(() => relatedProductsData, []);

  return (
    <div className="inline-flex items-center justify-center gap-6 px-[300px] py-[72px] relative flex-[0_0_auto] w-full">
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
                className="relative w-20 h-20 object-cover"
                alt={product.name}
                src={product.image}
              />

              <div className="flex-col gap-2 inline-flex items-start relative flex-[0_0_auto]">
                <div className="relative w-[196px] font-body-small-400 text-gray-900">
                  {product.name}
                </div>
                <div className="inline-flex items-start gap-1 relative flex-[0_0_auto]">
                  <div className="relative w-fit font-body-small-600 text-secondary-500">
                    {product.price}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

