import { CaretRight } from "./CaretRight";
import { House } from "./House";

export const OrderTrackingBreadcrumbSection = ({ onGoHome, onGoTracking }) => {
  const breadcrumbs = [
    { label: "Trang chủ", isHome: true, isActive: false },
    { label: "Theo dõi đơn hàng", isHome: false, isActive: false },
    { label: "Chi tiết", isHome: false, isActive: true },
  ];

  return (
    <div className="relative w-full max-w-[1920px] mx-auto h-[72px] bg-gray-50">
      <nav
        aria-label="breadcrumb"
        className="inline-flex items-center justify-center gap-2 relative top-[calc(50.00%_-_10px)] left-[300px]"
      >
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="inline-flex items-center gap-2">
            {index > 0 && <CaretRight className="!relative !w-3 !h-3" />}

            {crumb.isHome ? (
              <button
                type="button"
                onClick={onGoHome}
                className="inline-flex items-center gap-2 cursor-pointer bg-transparent border-none p-0"
              >
                <House className="!relative !w-5 !h-5" />
                <span className="relative w-fit mt-[-1.00px] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-600 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] whitespace-nowrap [font-style:var(--body-small-400-font-style)]">
                  {crumb.label}
                </span>
              </button>
            ) : crumb.isActive ? (
              <span className="relative w-fit mt-[-1.00px] font-body-small-500 font-[number:var(--body-small-500-font-weight)] text-secondary-500 text-[length:var(--body-small-500-font-size)] tracking-[var(--body-small-500-letter-spacing)] leading-[var(--body-small-500-line-height)] whitespace-nowrap [font-style:var(--body-small-500-font-style)]">
                {crumb.label}
              </span>
            ) : (
              <button
                type="button"
                onClick={onGoTracking}
                className="relative w-fit mt-[-1.00px] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-600 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] whitespace-nowrap [font-style:var(--body-small-400-font-style)] cursor-pointer bg-transparent border-none p-0"
              >
                {crumb.label}
              </button>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

