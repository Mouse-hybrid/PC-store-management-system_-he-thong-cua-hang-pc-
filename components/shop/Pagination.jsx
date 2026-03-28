import { ArrowLeft } from "../../ArrowLeft";
import { ArrowRight1 } from "../../ArrowRight1";

export const Pagination = ({ pageNumbers, activePage, setActivePage, totalPages }) => {
  if (!Array.isArray(pageNumbers) || totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 flex-wrap py-10">
      <button
        type="button"
        onClick={() => setActivePage((p) => Math.max(p - 1, 0))}
        disabled={activePage === 0}
        className={`h-11 w-11 inline-flex items-center justify-center rounded-full border border-solid transition active:scale-95 ${
          activePage === 0
            ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
            : "border-gray-100 bg-gray-00 hover:border-primary-500 hover:shadow-sm"
        }`}
        aria-label="Trang trước"
      >
        <ArrowLeft className="!relative !w-5 !h-5 text-primary-500" />
      </button>

      <div className="inline-flex items-center gap-2 flex-wrap justify-center">
        {pageNumbers.map((page, idx) => (
          <button
            type="button"
            key={page}
            onClick={() => setActivePage(idx)}
            className={`h-11 min-w-11 px-4 rounded-full border border-solid transition active:scale-95 ${
              activePage === idx
                ? "bg-primary-500 border-primary-500 text-gray-00 shadow-sm"
                : "bg-gray-00 border-gray-100 text-gray-800 hover:border-primary-500 hover:shadow-sm"
            }`}
            aria-label={`Trang ${idx + 1}`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setActivePage((p) => Math.min(p + 1, totalPages - 1))}
        disabled={activePage === totalPages - 1}
        className={`h-11 w-11 inline-flex items-center justify-center rounded-full border border-solid transition active:scale-95 ${
          activePage === totalPages - 1
            ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
            : "border-gray-100 bg-gray-00 hover:border-primary-500 hover:shadow-sm"
        }`}
        aria-label="Trang sau"
      >
        <ArrowRight1 className="!relative !w-5 !h-5" color="#ff6a00" />
      </button>

      <div className="text-sm text-gray-600">{`Trang ${activePage + 1}/${totalPages}`}</div>
    </div>
  );
};

