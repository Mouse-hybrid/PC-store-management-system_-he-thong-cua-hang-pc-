import { CaretRight } from "./CaretRight";
import { House } from "./House";

export const CheckOutBreadcrumbSection = ({ onGoShop, onGoCart }) => {
  return (
    <div className="relative w-full max-w-[1920px] mx-auto h-[72px] bg-gray-50">
      <nav
        aria-label="Breadcrumb"
        className="inline-flex items-center justify-center gap-2 relative top-[calc(50.00%_-_10px)] left-[300px]"
      >
        <div className="inline-flex items-center gap-2">
          <button
            type="button"
            onClick={onGoShop}
            className="inline-flex items-center gap-2 cursor-pointer bg-transparent border-none p-0"
          >
            <House className="!relative !w-5 !h-5" />
            <span className="relative w-fit mt-[-1.00px] font-body-small-400 text-gray-600">
              Giỏ hàng
            </span>
          </button>
        </div>
        <CaretRight className="!relative !w-3 !h-3" />
        <button
          type="button"
          onClick={onGoCart}
          className="bg-transparent border-none p-0 cursor-pointer"
        >
          <span className="relative w-fit mt-[-1.00px] font-body-small-400 text-gray-600">
            Giỏ hàng
          </span>
        </button>
        <CaretRight className="!relative !w-3 !h-3" />
        <span className="relative w-fit mt-[-1.00px] font-body-small-500 text-secondary-500">
          Thanh toán
        </span>
      </nav>
    </div>
  );
};

// Breadcrumb cho trang "Payment successful"
export const CheckoutBreadcrumbSection = ({ onGoShop, onGoCart }) => {
  const breadcrumbs = [
    { label: "Trang chủ", isActive: false, isFirst: true },
    { label: "Giỏ hàng", isActive: false },
    { label: "Thanh toán", isActive: true },
  ];

  return (
    <nav
      aria-label="Breadcrumb"
      className="relative w-full max-w-[1920px] mx-auto h-[72px] bg-gray-50"
    >
      <ol className="inline-flex items-center justify-center gap-2 relative top-[calc(50.00%_-_10px)] left-[300px]">
        {breadcrumbs.map((crumb, index) => (
          <li key={index} className="inline-flex items-center gap-2">
            {index === 0 && <House className="!relative !w-5 !h-5" />}
            {index > 0 && <CaretRight className="!relative !w-3 !h-3" />}

            {crumb.isActive ? (
              <span
                className="relative w-fit mt-[-1.00px] font-body-small-500 font-[number:var(--body-small-500-font-weight)] text-secondary-500 text-[length:var(--body-small-500-font-size)] tracking-[var(--body-small-500-letter-spacing)] leading-[var(--body-small-500-line-height)] whitespace-nowrap [font-style:var(--body-small-500-font-style)]"
                aria-current="page"
              >
                {crumb.label}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (crumb.label === "Trang chủ") onGoShop?.();
                  if (crumb.label === "Giỏ hàng") onGoCart?.();
                }}
                className="relative w-fit mt-[-1.00px] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-600 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] whitespace-nowrap [font-style:var(--body-small-400-font-style)] cursor-pointer bg-transparent border-none p-0"
              >
                {crumb.label}
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

