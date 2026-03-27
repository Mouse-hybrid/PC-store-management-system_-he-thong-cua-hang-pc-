import { MainNavigationSection } from "./MainNavigationSection";
import { ArrowLeft } from "./ArrowLeft";
import { House } from "./House";
import oops404 from "./oops-404-rafiki.svg";

export const UserError404Section = ({ onGoHome, onGoBack }) => {
  return (
    <div className="flex flex-col min-h-screen w-full max-w-[1920px] mx-auto items-stretch bg-gray-00 overflow-hidden">
      <MainNavigationSection />

      <div className="flex flex-col items-center justify-center flex-1 py-16 px-4 w-full bg-gray-50">
        <div className="relative w-full max-w-[1320px] flex flex-col items-center">
          <img
            className="w-full max-w-[500px] h-auto object-contain"
            alt=""
            src={oops404}
          />

          <div className="inline-flex flex-col items-center justify-center gap-6 mt-4 max-w-full">
            <p className="relative w-full max-w-[1320px] mt-[-1px] font-display-05 font-[number:var(--display-05-font-weight)] text-gray-900 text-[length:var(--display-05-font-size)] text-center tracking-[var(--display-05-letter-spacing)] leading-[var(--display-05-line-height)] [font-style:var(--display-05-font-style)] px-2">
              404 – Trang không tồn tại
            </p>

            <p className="relative w-full max-w-[536px] font-body-medium-400 font-[number:var(--body-medium-400-font-weight)] text-gray-700 text-[length:var(--body-medium-400-font-size)] text-center tracking-[var(--body-medium-400-letter-spacing)] leading-[var(--body-medium-400-line-height)] [font-style:var(--body-medium-400-font-style)] px-2">
              Oops! Trang bạn tìm không tồn tại. <br />
              Hãy quay lại hoặc trở về trang chủ để tiếp tục mua sắm.
            </p>

            <div className="items-start gap-4 inline-flex flex-wrap justify-center relative">
              <button
                type="button"
                onClick={() => onGoBack?.()}
                className="items-center justify-center gap-2 px-6 py-3 bg-primary-500 rounded-sm inline-flex cursor-pointer border-0 text-white"
              >
                <ArrowLeft className="!relative !w-5 !h-5 text-white shrink-0" />
                <span className="font-heading-07 font-[number:var(--heading-07-font-weight)] text-gray-00 text-[length:var(--heading-07-font-size)] tracking-[var(--heading-07-letter-spacing)] leading-[var(--heading-07-line-height)] whitespace-nowrap [font-style:var(--heading-07-font-style)]">
                  QUAY LẠI
                </span>
              </button>

              <button
                type="button"
                onClick={() => onGoHome?.()}
                className="items-center justify-center gap-2 px-6 py-3 rounded-sm border-2 border-solid border-primary-500 inline-flex cursor-pointer bg-gray-00 text-primary-500"
              >
                <House className="!relative !w-5 !h-5 text-primary-500 shrink-0" />
                <span className="font-heading-07 font-[number:var(--heading-07-font-weight)] text-primary-500 text-[length:var(--heading-07-font-size)] tracking-[var(--heading-07-letter-spacing)] leading-[var(--heading-07-line-height)] whitespace-nowrap [font-style:var(--heading-07-font-style)]">
                  TRANG CHỦ
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
