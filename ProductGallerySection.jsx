import { useMemo, useState } from "react";
import { ArrowLeft } from "./ArrowLeft";
import { ArrowRight } from "./ArrowRight";
import { ArrowsCounterClockwise } from "./ArrowsCounterClockwise";
import { Heart1 } from "./Heart1";
import { IconComponentNode } from "./IconComponentNode";
import { ShoppingCartSimple } from "./ShoppingCartSimple";
import { Star } from "./Star";
import { Star1 } from "./Star1";
import shortLine from "./short-line.svg";
import { formatVND } from "@/utils/formatCurrency";
import { generatePrice } from "@/utils/generatePrice";
import {
  getProductImageUrl,
  getProductPlaceholderByCategory,
  handleProductImageError,
} from "@/utils/productUtils";
import vector2 from "./vector-2.svg";
import vector3 from "./vector-3.svg";
import vector4 from "./vector-4.svg";

const ramOptions = ["16GB", "32GB", "64GB"];
const cpuOptions = ["Ryzen 5", "Ryzen 7", "Intel i7"];
const storageOptions = ["SSD 512GB", "SSD 1TB", "SSD 2TB"];

const renderStars = (count) => {
  return Array.from({ length: 5 }, (_, i) =>
    i < count ? (
      <Star key={i} className="!relative !w-4 !h-4" />
    ) : (
      <Star1 key={i} className="!relative !w-4 !h-4" />
    ),
  );
};

export const ProductGallerySection = ({ product, fallbackImage }) => {
  const productName =
    product?.title ?? product?.name ?? "PC Gaming RTX 4060 – RAM 16GB, SSD 1TB";
  const productPriceValue = Number.isFinite(Number(product?.price))
    ? Number(product.price)
    : generatePrice(product?.category, productName);
  const productPrice = product?.priceFormatted ?? formatVND(productPriceValue);

  const thumbnails = useMemo(() => {
    const cat = product?.category ?? null;
    const resolveOne = (u) => {
      const s = String(u ?? "");
      if (!s.trim()) return null;
      if (/^https?:\/\//i.test(s) || s.startsWith("data:")) return s;
      return getProductImageUrl(s, cat);
    };

    let main;
    if (product?.pro_image != null && String(product.pro_image).trim() !== "") {
      main = getProductImageUrl(product.pro_image, cat);
    } else if (Array.isArray(product?.images) && product.images.length > 0) {
      main = resolveOne(product.images[0]) ?? getProductPlaceholderByCategory(cat);
    } else if (product?.thumbnail) {
      main = resolveOne(product.thumbnail) ?? getProductPlaceholderByCategory(cat);
    } else {
      main = fallbackImage || getProductPlaceholderByCategory(cat);
    }

    return Array.from({ length: 6 }, () => main);
  }, [product, fallbackImage]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedRam, setSelectedRam] = useState("32GB");
  const [selectedCpu, setSelectedCpu] = useState("Ryzen 7");
  const [selectedStorage, setSelectedStorage] = useState("SSD 2TB");

  const handlePrev = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? thumbnails.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev === thumbnails.length - 1 ? 0 : prev + 1,
    );
  };

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  return (
    <div className="items-start gap-14 pt-8 pb-[72px] px-[300px] inline-flex relative flex-col w-full">
      <div className="flex items-start gap-14 w-full justify-center">
        {/* Gallery */}
        <div className="flex flex-col items-start gap-6">
          <img
            className="relative w-[616px] h-[464px] bg-[#f8f9fa] object-contain rounded"
            alt="Main image"
            src={thumbnails[currentImageIndex]}
            crossOrigin="anonymous"
            onError={(e) =>
              handleProductImageError(e, getProductPlaceholderByCategory(product?.category))
            }
          />

          <div className="relative w-[616px] h-24">
            <div className="inline-flex items-start gap-2 absolute top-0 left-0">
              {thumbnails.map((thumb, index) => (
                <img
                  key={index}
                  className={`relative w-24 h-24 cursor-pointer rounded object-contain bg-[#f8f9fa] ${
                    currentImageIndex === index
                      ? "ring-2 ring-primary-500"
                      : "ring-0"
                  }`}
                  alt={`Thumbnail ${index + 1}`}
                  src={thumb}
                  crossOrigin="anonymous"
                  onClick={() => setCurrentImageIndex(index)}
                  onError={(e) =>
                    handleProductImageError(e, getProductPlaceholderByCategory(product?.category))
                  }
                />
              ))}
            </div>

            <div className="inline-flex items-start gap-[568px] absolute top-6 -left-6">
              <button
                onClick={handlePrev}
                className="inline-flex items-start gap-2.5 p-3 relative flex-[0_0_auto] bg-primary-500 rounded-[100px] border-2 border-solid border-gray-00 cursor-pointer"
              >
                <ArrowLeft className="!relative !w-6 !h-6" />
              </button>

              <button
                onClick={handleNext}
                className="inline-flex items-start gap-2.5 p-3 relative flex-[0_0_auto] bg-primary-500 rounded-[100px] border-2 border-solid border-gray-00 cursor-pointer"
              >
                <ArrowRight className="!relative !w-6 !h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Info panel */}
        <div className="inline-flex flex-col items-start gap-6">
          <div className="flex-col items-start gap-2 inline-flex">
            <div className="inline-flex items-start gap-4 relative flex-[0_0_auto]">
              <div className="inline-flex items-start gap-1.5 relative flex-[0_0_auto]">
                {renderStars(5)}
              </div>

              <div className="inline-flex flex-col">
                <div className="relative w-fit font-body-small-600 text-gray-900">
                  4.9 Đánh giá
                </div>
                <div className="relative w-fit font-body-small-400 text-gray-600">
                  (426) lượt mua
                </div>
              </div>
            </div>

            <div className="font-body-XL-400 text-gray-900">{productName}</div>
          </div>

          <div className="inline-flex items-center justify-center gap-3 relative">
            <div className="inline-flex items-center gap-1 relative">
              <div className="font-heading-03 text-secondary-500">{productPrice}</div>
              <div className="font-normal text-gray-500 text-lg line-through">{formatVND(productPriceValue + 200000)}</div>
            </div>
            <div className="inline-flex items-start gap-2.5 px-2.5 py-[5px] bg-warning-400 rounded-sm">
              <div className="font-body-small-600 text-gray-900">100% OFF</div>
            </div>
          </div>

          <img
            className="relative w-[648px] h-px object-cover"
            alt="Divider"
            src={shortLine}
            crossOrigin="anonymous"
          />

          <div className="inline-flex flex-col items-start gap-4">
            <div className="inline-flex items-start gap-6">
              <div className="inline-flex flex-col items-start gap-2">
                <div className="font-body-small-400 text-gray-900">RAM</div>
                <div className="relative self-stretch w-full h-11 bg-gray-00 rounded-sm overflow-hidden border border-solid border-gray-100">
                  <select
                    value={selectedRam}
                    onChange={(e) => setSelectedRam(e.target.value)}
                    className="absolute inset-0 w-full h-full pl-4 pr-8 bg-transparent appearance-none font-body-small-400 text-gray-700 cursor-pointer outline-none"
                  >
                    {ramOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <IconComponentNode
                    className="!absolute !top-[calc(50.00%_-_8px)] !right-0 !w-4 !h-4 pointer-events-none"
                    color="#ADB7BC"
                  />
                </div>
              </div>

              <div className="inline-flex flex-col items-start gap-2">
                <div className="font-body-small-400 text-gray-900">CPU</div>
                <div className="relative self-stretch w-full h-11 bg-gray-00 rounded-sm overflow-hidden border border-solid border-gray-100">
                  <select
                    value={selectedCpu}
                    onChange={(e) => setSelectedCpu(e.target.value)}
                    className="absolute inset-0 w-full h-full pl-4 pr-8 bg-transparent appearance-none font-body-small-400 text-gray-700 cursor-pointer outline-none"
                  >
                    {cpuOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <IconComponentNode
                    className="!absolute !top-[calc(50.00%_-_8px)] !right-0 !w-4 !h-4 pointer-events-none"
                    color="#ADB7BC"
                  />
                </div>
              </div>

              <div className="inline-flex flex-col items-start gap-2">
                <div className="font-body-small-400 text-gray-900">Ổ cứng</div>
                <div className="relative self-stretch w-full h-11 bg-gray-00 rounded-sm overflow-hidden border border-solid border-gray-100">
                  <select
                    value={selectedStorage}
                    onChange={(e) => setSelectedStorage(e.target.value)}
                    className="absolute inset-0 w-full h-full pl-4 pr-8 bg-transparent appearance-none font-body-small-400 text-gray-700 cursor-pointer outline-none"
                  >
                    {storageOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <IconComponentNode
                    className="!absolute !top-[calc(50.00%_-_8px)] !right-0 !w-4 !h-4 pointer-events-none"
                    color="#ADB7BC"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="inline-flex items-start gap-4 pt-3">
            <div className="flex w-[164px] items-center justify-between px-5 py-4 relative bg-gray-00 rounded-[3px] border-2 border-solid border-gray-100">
              <button
                onClick={handleDecrement}
                className="all-[unset] box-border cursor-pointer"
                type="button"
              >
                <span className="text-gray-700 text-2xl leading-none">-</span>
              </button>
              <div className="relative w-fit font-body-small-400 text-gray-700">
                {quantity}
              </div>
              <button
                onClick={handleIncrement}
                className="all-[unset] box-border cursor-pointer"
                type="button"
              >
                <span className="text-gray-700 text-2xl leading-none">+</span>
              </button>
            </div>

            <button className="all-[unset] box-border flex w-[310px] items-center justify-center gap-3 px-8 py-0 relative bg-primary-500 rounded-[3px] cursor-pointer">
              <div className="text-gray-00 font-heading-06">THÊM VÀO GIỎ</div>
              <ShoppingCartSimple className="!relative !w-6 !h-6" />
            </button>

            <button className="all-[unset] box-border flex w-[310px] items-center justify-center gap-3 px-8 py-0 relative rounded-[3px] border-2 border-solid border-primary-500 cursor-pointer">
              <div className="text-primary-500 font-heading-06">MUA NGAY</div>
            </button>
          </div>

          <div className="inline-flex items-center justify-between pt-0 pb-2 w-full">
            <div className="inline-flex items-start gap-6">
              <button className="all-[unset] box-border inline-flex items-center justify-center gap-1.5 cursor-pointer">
                <Heart1 className="!relative !w-6 !h-6" />
                <div className="font-body-small-400 text-gray-700 whitespace-nowrap">
                  Thêm vào yêu thích
                </div>
              </button>

              <button className="all-[unset] box-border inline-flex items-center justify-center gap-1.5 cursor-pointer">
                <ArrowsCounterClockwise className="!relative !w-6 !h-6" />
                <div className="font-body-small-400 text-gray-700 whitespace-nowrap">
                  So sánh sản phẩm
                </div>
              </button>
            </div>

            <div className="inline-flex items-center justify-center gap-3">
              <div className="font-body-small-400 text-gray-700 whitespace-nowrap">
                Chia sẻ sản phẩm
              </div>
              <div className="inline-flex items-center gap-3">
                <button className="all-[unset] box-border cursor-pointer relative w-4 h-4 bg-[url(/image.svg)] bg-[100%_100%]">
                  <span className="sr-only">share</span>
                </button>
                <button className="all-[unset] box-border cursor-pointer relative w-4 h-4">
                  <img
                    className="w-full h-full absolute top-0 left-0"
                    alt=""
                    src={vector2}
                    crossOrigin="anonymous"
                  />
                </button>
                <button className="all-[unset] box-border cursor-pointer relative w-4 h-4">
                  <img
                    className="w-full h-full absolute top-0 left-0"
                    alt=""
                    src={vector3}
                    crossOrigin="anonymous"
                  />
                </button>
                <button className="all-[unset] box-border cursor-pointer relative w-4 h-4">
                  <img
                    className="w-full h-full absolute top-0 left-0"
                    alt=""
                    src={vector4}
                    crossOrigin="anonymous"
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="inline-flex flex-col items-start gap-3 p-5 relative bg-gray-00 rounded-[3px] border border-solid border-gray-100">
            <p className="font-body-small-400 text-gray-900 whitespace-nowrap w-[608px]">
              Hỗ trợ thanh toán: Visa, Momo, Chuyển khoản, ATM
            </p>
            <div className="w-[312px] h-[18px] bg-gray-100 rounded" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
};

