import { ArrowRight } from "./ArrowRight";
import { CheckCircle } from "./CheckCircle";
import { Stack } from "./Stack";

export const OrderSuccessMessageSection = ({
  onGoManagement,
  onGoOrderDetail,
}) => {
  return (
    <div className="inline-flex flex-col items-center justify-center gap-8 px-0 py-[124px] relative w-full flex-[0_0_auto]">
      <div className="inline-flex flex-col items-center justify-center gap-6 relative flex-[0_0_auto]">
        <CheckCircle className="!relative !w-[88px] !h-[88px]" />
        <div className="flex-col items-center justify-center gap-3 inline-flex relative flex-[0_0_auto]">
          <div className="relative w-[1320px] mt-[-1.00px] font-heading-03 font-[number:var(--heading-03-font-weight)] text-gray-900 text-[length:var(--heading-03-font-size)] text-center tracking-[var(--heading-03-letter-spacing)] leading-[var(--heading-03-line-height)] [font-style:var(--heading-03-font-style)]">
            Đặt hàng thành công!
          </div>

          <p className="relative w-[424px] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-[#5f6c72] text-[length:var(--body-small-400-font-size)] text-center tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)]">
            Vui lòng kiểm tra Email hoặc liên hệ Zalo để nhận thông tin tài
            khoản.
          </p>
        </div>
      </div>

      <div className="items-start gap-3 flex-[0_0_auto] inline-flex relative">
        <button
          type="button"
          onClick={onGoManagement}
          className="items-center justify-center gap-2 px-6 py-0 h-[44px] flex-[0_0_auto] rounded-sm border-2 border-solid border-primary-100 inline-flex relative bg-transparent cursor-pointer"
        >
          <Stack className="!relative !w-5 !h-5 text-primary-500" />
          <span className="mt-[-2.00px] font-heading-07 font-[number:var(--heading-07-font-weight)] text-primary-500 tracking-[var(--heading-07-letter-spacing)] leading-[var(--heading-07-line-height)] relative w-fit text-[length:var(--heading-07-font-size)] whitespace-nowrap [font-style:var(--heading-07-font-style)]">
            VỀ TRANG QUẢN LÝ
          </span>
        </button>

        <button
          type="button"
          onClick={onGoOrderDetail}
          className="items-center justify-center gap-2 px-6 py-0 h-[44px] flex-[0_0_auto] bg-primary-500 rounded-sm inline-flex relative cursor-pointer border-0"
        >
          <span className="mt-[-1.00px] font-heading-07 font-[number:var(--heading-07-font-weight)] text-gray-00 tracking-[var(--heading-07-letter-spacing)] leading-[var(--heading-07-line-height)] relative w-fit text-[length:var(--heading-07-font-size)] whitespace-nowrap [font-style:var(--heading-07-font-style)]">
            CHI TIẾT ĐƠN HÀNG
          </span>

          <ArrowRight className="!relative !w-5 !h-5 text-gray-00" />
        </button>
      </div>
    </div>
  );
};

