import { IconComponentNode } from "../../IconComponentNode";

export const FilterBar = ({
  filterCategory,
  setFilterCategory,
  filterGpu,
  setFilterGpu,
  filterRam,
  setFilterRam,
  sortOption,
  setSortOption,
  filterOptions,
}) => {
  return (
    <div className="sticky top-0 z-[100] border-b border-solid border-gray-100 bg-gray-00/85 backdrop-blur pointer-events-auto">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-4 relative z-[100] pointer-events-auto">
        <div className="flex items-center gap-3 flex-wrap justify-start sm:justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="h-11 rounded-2xl border border-solid border-gray-100 bg-gray-00 px-4 text-sm text-gray-700 shadow-sm hover:shadow transition"
              aria-label="Lọc danh mục"
            >
              {(filterOptions?.categories ?? ["All"]).map((c) => (
                <option key={c} value={c}>
                  {c === "All" ? "Danh mục: Tất cả" : c}
                </option>
              ))}
            </select>

            <select
              value={filterGpu}
              onChange={(e) => setFilterGpu(e.target.value)}
              className="h-11 rounded-2xl border border-solid border-gray-100 bg-gray-00 px-4 text-sm text-gray-700 shadow-sm hover:shadow transition"
              aria-label="Lọc GPU"
            >
              {(filterOptions?.gpus ?? ["All"]).map((g) => (
                <option key={g} value={g}>
                  {g === "All" ? "GPU: Tất cả" : g.replace("NVIDIA GeForce ", "")}
                </option>
              ))}
            </select>

            <select
              value={filterRam}
              onChange={(e) => setFilterRam(e.target.value)}
              className="h-11 rounded-2xl border border-solid border-gray-100 bg-gray-00 px-4 text-sm text-gray-700 shadow-sm hover:shadow transition"
              aria-label="Lọc RAM"
            >
              {(filterOptions?.rams ?? ["All"]).map((r) => (
                <option key={r} value={r}>
                  {r === "All" ? "RAM: Tất cả" : r}
                </option>
              ))}
            </select>

            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="h-11 rounded-2xl border border-solid border-gray-100 bg-gray-00 pl-4 pr-10 text-sm text-gray-700 shadow-sm hover:shadow transition appearance-none min-w-[200px]"
                aria-label="Sắp xếp theo giá và tiêu chí khác"
              >
                <option value="popular">Sắp xếp: Phổ biến</option>
                <option value="priceAsc">Giá: Thấp → Cao</option>
                <option value="priceDesc">Giá: Cao → Thấp</option>
                <option value="ratingDesc">Rating: Cao → Thấp</option>
              </select>
              <IconComponentNode
                className="!absolute !top-[calc(50%_-_8px)] !right-3 !w-4 !h-4 pointer-events-none"
                color="#ADB7BC"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
