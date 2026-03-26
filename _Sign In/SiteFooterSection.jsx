import { ArrowRight1 } from "./ArrowRight1";
import logoStoryPc from "./logo-storypc.svg";
import vector4 from "./vector-4.svg";
import vector5 from "./vector-5.svg";

const productCategories = [
  { label: "PC Gaming", color: "text-gray-400" },
  { label: "PC Văn Phòng", color: "text-gray-400" },
  { label: "Laptop", color: "text-gray-400" },
  { label: "Linh kiện PC", color: "text-gray-00" },
  { label: "Màn hình", color: "text-gray-400" },
  { label: "Tai nghe Sale", color: "text-gray-400" },
];

const utilities = [
  "Trang chủ",
  "Mua tài khoản",
  "Nạp tiền",
  "Lịch sử mua",
  "Kiểm tra bảo hành",
  "Hỗ trợ / CSKH",
];

const popularTags = [
  ["PC Gaming", "RTX"],
  ["Laptop", "Màn hình"],
];

export const SiteFooterSection = () => {
  return (
    <div className="relative w-full max-w-[1920px] mx-auto min-h-[472px]">
      <div className="inline-flex flex-wrap items-start gap-x-12 gap-y-10 px-[300px] py-[72px] w-full bg-gray-900 justify-between">
        <div className="inline-flex flex-col items-start gap-6 relative flex-[0_0_auto] min-w-[200px]">
          <div className="inline-flex items-center justify-center gap-2 relative flex-[0_0_auto]">
            <img
              className="relative w-[181px] h-[48px] object-contain"
              alt="StoryPC logo"
              src={logoStoryPc}
            />
          </div>

          <div className="inline-flex flex-col items-start gap-3 relative flex-[0_0_auto]">
            <div className="inline-flex flex-col items-start gap-1 relative flex-[0_0_auto]">
              <div className="relative w-[312px] max-w-full mt-[-1.00px] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-500 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)]">
                Hỗ trợ
              </div>
              <div className="relative w-[312px] max-w-full font-body-large-500 font-[number:var(--body-large-500-font-weight)] text-gray-00 text-[length:var(--body-large-500-font-size)] tracking-[var(--body-large-500-letter-spacing)] leading-[var(--body-large-500-line-height)] [font-style:var(--body-large-500-font-style)]">
                0937418564
              </div>
            </div>

            <p className="relative w-[248px] max-w-full font-body-medium-400 font-[number:var(--body-medium-400-font-weight)] text-gray-300 text-[length:var(--body-medium-400-font-size)] tracking-[var(--body-medium-400-letter-spacing)] leading-[var(--body-medium-400-line-height)] [font-style:var(--body-medium-400-font-style)]">
              Đường Nguyễn Văn Tiết, phường Lái Thiêu, Thành phố Thuận An, tỉnh
              Bình Dương, Việt Nam
            </p>

            <div className="relative w-[312px] max-w-full font-body-medium-500 font-[number:var(--body-medium-500-font-weight)] text-gray-00 text-[length:var(--body-medium-500-font-size)] tracking-[var(--body-medium-500-letter-spacing)] leading-[var(--body-medium-500-line-height)] [font-style:var(--body-medium-500-font-style)]">
              support@storypc.com
            </div>
          </div>
        </div>

        <div className="inline-flex flex-col items-start gap-3 relative flex-[0_0_auto] min-w-[180px]">
          <div className="relative w-[200px] mt-[-1.00px] font-label-02 font-[number:var(--label-02-font-weight)] text-gray-00 text-[length:var(--label-02-font-size)] tracking-[var(--label-02-letter-spacing)] leading-[var(--label-02-line-height)] [font-style:var(--label-02-font-style)]">
            DANH MỤC SẢN PHẨM
          </div>

          <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
            {productCategories.map((item) => (
              <div
                key={item.label}
                className="inline-flex items-center gap-2 px-0 py-1.5 relative flex-[0_0_auto]"
              >
                <div
                  className={`relative w-fit mt-[-1.00px] font-body-small-500 font-[number:var(--body-small-500-font-weight)] ${item.color} text-[length:var(--body-small-500-font-size)] tracking-[var(--body-small-500-letter-spacing)] leading-[var(--body-small-500-line-height)] whitespace-nowrap [font-style:var(--body-small-500-font-style)]`}
                >
                  {item.label}
                </div>
              </div>
            ))}

            <div className="inline-flex items-center gap-2 px-0 py-1.5 relative flex-[0_0_auto] bg-gray-900">
              <p className="relative w-fit mt-[-1.00px] font-body-small-500 font-[number:var(--body-small-500-font-weight)] text-warning-500 text-[length:var(--body-small-500-font-size)] tracking-[var(--body-small-500-letter-spacing)] leading-[var(--body-small-500-line-height)] whitespace-nowrap [font-style:var(--body-small-500-font-style)]">
                Xem toàn bộ sản phẩm
              </p>
              <ArrowRight1 className="!relative !w-5 !h-5" color="#EBC80C" />
            </div>
          </div>
        </div>

        <div className="inline-flex flex-col items-start gap-3 relative flex-[0_0_auto] min-w-[160px]">
          <div className="relative w-[200px] mt-[-1.00px] font-label-02 font-[number:var(--label-02-font-weight)] text-gray-00 text-[length:var(--label-02-font-size)] tracking-[var(--label-02-letter-spacing)] leading-[var(--label-02-line-height)] [font-style:var(--label-02-font-style)]">
            TIỆN ÍCH
          </div>

          <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
            {utilities.map((item) => (
              <div
                key={item}
                className="inline-flex items-center gap-2 px-0 py-1.5 relative flex-[0_0_auto]"
              >
                <div className="relative w-fit mt-[-1.00px] font-body-small-500 font-[number:var(--body-small-500-font-weight)] text-gray-400 text-[length:var(--body-small-500-font-size)] tracking-[var(--body-small-500-letter-spacing)] leading-[var(--body-small-500-line-height)] whitespace-nowrap [font-style:var(--body-small-500-font-style)]">
                  {item}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="inline-flex flex-col items-start gap-[18px] relative flex-[0_0_auto] min-w-[200px]">
          <div className="relative w-[200px] mt-[-1.00px] font-label-02 font-[number:var(--label-02-font-weight)] text-gray-00 text-[length:var(--label-02-font-size)] tracking-[var(--label-02-letter-spacing)] leading-[var(--label-02-line-height)] [font-style:var(--label-02-font-style)]">
            DOWNLOAD APP
          </div>

          <div className="inline-flex flex-col items-start gap-3 relative flex-[0_0_auto]">
            <div className="inline-flex items-center justify-center gap-4 px-5 py-4 relative flex-[0_0_auto] bg-gray-800 rounded-[3px]">
              <div className="relative w-8 h-8 overflow-hidden shrink-0">
                <img className="w-7 h-7 object-contain" alt="" src={vector4} />
              </div>
              <div className="inline-flex flex-col items-start gap-1 relative flex-[0_0_auto]">
                <div className="relative w-[88px] mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-white text-[11px] tracking-[0] leading-[13px]">
                  Get it now
                </div>
                <div className="relative w-[88px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-white text-sm tracking-[0] leading-5">
                  Google Play
                </div>
              </div>
            </div>

            <div className="inline-flex items-center justify-center gap-4 px-5 py-4 relative flex-[0_0_auto] bg-gray-800 rounded-[3px]">
              <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
                <img src={vector5} alt="" className="w-7 h-7 object-contain" />
              </div>
              <div className="inline-flex flex-col items-start gap-1 relative flex-[0_0_auto]">
                <div className="relative w-[88px] mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-white text-[11px] tracking-[0] leading-[13px]">
                  Get it now
                </div>
                <div className="relative w-[88px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-white text-sm tracking-[0] leading-5">
                  App Store
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="inline-flex flex-col items-start gap-[18px] relative flex-[0_0_auto] min-w-[200px]">
          <div className="relative w-[312px] max-w-full mt-[-1.00px] font-label-02 font-[number:var(--label-02-font-weight)] text-gray-00 text-[length:var(--label-02-font-size)] tracking-[var(--label-02-letter-spacing)] leading-[var(--label-02-line-height)] [font-style:var(--label-02-font-style)]">
            POPULAR TAG
          </div>

          <div className="flex-col items-start gap-2 inline-flex relative flex-[0_0_auto]">
            {popularTags.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="inline-flex items-start gap-2 relative flex-[0_0_auto] flex-wrap"
              >
                {row.map((tag) => (
                  <div
                    key={tag}
                    className="items-center justify-center gap-2.5 px-3 py-1.5 rounded-sm border border-solid border-gray-800 inline-flex relative flex-[0_0_auto]"
                  >
                    <div className="text-gray-00 relative w-fit mt-[-1.00px] font-body-small-500 font-[number:var(--body-small-500-font-weight)] text-[length:var(--body-small-500-font-size)] tracking-[var(--body-small-500-letter-spacing)] leading-[var(--body-small-500-line-height)] whitespace-nowrap [font-style:var(--body-small-500-font-style)]">
                      {tag}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="inline-flex items-center justify-center gap-2.5 px-[300px] py-6 w-full bg-gray-900 shadow-[inset_0px_1px_0px_#303639] border-t border-gray-800">
        <img
          className="relative w-[181px] h-[48px] object-contain"
          alt="StoryPC logo"
          src={logoStoryPc}
        />
      </div>
    </div>
  );
};
