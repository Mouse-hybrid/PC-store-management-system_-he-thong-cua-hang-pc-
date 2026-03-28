import { CaretRight } from "./CaretRight";
import { House } from "./House";

export const FaqBreadcrumbNavigationSection = ({ onGoHome }) => {
  const breadcrumbs = [
    {
      label: "Home",
      icon: <House className="!relative !w-5 !h-5" />,
      active: false,
    },
    { label: "Pages", icon: null, active: false },
    { label: "FAQs", icon: null, active: true },
  ];

  return (
    <div className="relative w-[1920px] h-[72px] bg-gray-50">
      <nav
        aria-label="Breadcrumb"
        className="inline-flex items-center justify-center gap-2 relative top-[calc(50.00%_-_10px)] left-[300px]"
      >
        {breadcrumbs.map((crumb, index) => (
          <div
            key={crumb.label}
            className="inline-flex items-center gap-2"
          >
            {index > 0 && <CaretRight className="!relative !w-3 !h-3" />}
            {index === 0 ? (
              <button
                type="button"
                onClick={onGoHome}
                className="inline-flex items-center gap-2 cursor-pointer bg-transparent border-none p-0"
              >
                {crumb.icon && crumb.icon}
                <span
                  className={`relative w-fit mt-[-1.00px] text-sm tracking-[0] leading-5 whitespace-nowrap ${
                    crumb.active
                      ? "[font-family:'Public_Sans-Medium',Helvetica] font-medium text-secondary-500"
                      : "[font-family:'Public_Sans-Regular',Helvetica] font-normal text-gray-600"
                  }`}
                >
                  {crumb.label}
                </span>
              </button>
            ) : (
              <>
                {crumb.icon && crumb.icon}
                <span
                  className={`relative w-fit mt-[-1.00px] text-sm tracking-[0] leading-5 whitespace-nowrap ${
                    crumb.active
                      ? "[font-family:'Public_Sans-Medium',Helvetica] font-medium text-secondary-500"
                      : "[font-family:'Public_Sans-Regular',Helvetica] font-normal text-gray-600"
                  }`}
                >
                  {crumb.label}
                </span>
              </>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

