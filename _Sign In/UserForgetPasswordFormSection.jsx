import { useState } from "react";
import { ArrowRight } from "./ArrowRight";

/** Mã demo: chỉ khi nhập đúng mới vào bước đặt lại mật khẩu */
const RECOVERY_CODE = "12345";

export const UserForgetPasswordFormSection = ({
  onBackToSignIn,
  onSentCode,
  onWrongCode,
  onGoToSignUp,
}) => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const handleSubmit = () => {
    if (code.trim() === RECOVERY_CODE) {
      onSentCode?.();
    } else {
      onWrongCode?.();
    }
  };

  return (
    <div className="min-h-[1185px] gap-2.5 px-[748px] py-[100px] inline-flex items-start justify-center relative w-[1920px] max-w-full bg-gray-50">
      <div className="inline-flex flex-col items-stretch gap-6 p-8 w-[424px] max-w-full bg-gray-00 rounded border border-solid border-gray-100 shadow-dropdown-shadow">
        <div className="inline-flex flex-col items-start gap-3">
          <h1 className="relative w-full mt-[-1px] font-body-XL-600 font-[number:var(--body-XL-600-font-weight)] text-gray-900 text-[length:var(--body-XL-600-font-size)] text-center tracking-[var(--body-XL-600-letter-spacing)] leading-[var(--body-XL-600-line-height)] [font-style:var(--body-XL-600-font-style)]">
            Quên mật khẩu
          </h1>
          <p className="relative w-full font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-600 text-[length:var(--body-small-400-font-size)] text-center tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)]">
            Nhập email bạn đã dùng để đăng ký tài khoản tại shop để nhận mã khôi
            phục mật khẩu.
          </p>
        </div>

        <div className="flex flex-col w-full items-start gap-2">
          <label
            htmlFor="forgot-email"
            className="relative self-stretch mt-[-1px] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-900 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)]"
          >
            Địa chỉ email
          </label>
          <input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="relative self-stretch w-full h-11 bg-gray-00 rounded-sm border border-solid border-gray-100 px-3 outline-none focus:border-primary-500 font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-900 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)]"
          />
        </div>

        <div className="flex flex-col w-full items-start gap-2">
          <label
            htmlFor="forgot-code"
            className="relative self-stretch mt-[-1px] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-900 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)]"
          >
            Mã xác nhận
          </label>
          <input
            id="forgot-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Nhập mã (demo: 12345)"
            className="relative self-stretch w-full h-11 bg-gray-00 rounded-sm border border-solid border-gray-100 px-3 outline-none focus:border-primary-500 font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-900 placeholder:text-gray-500 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)]"
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="flex w-full items-center justify-center gap-2 px-6 py-3 bg-primary-500 rounded-sm border-none cursor-pointer hover:opacity-95 transition-opacity"
        >
          <span className="relative w-fit font-heading-07 font-[number:var(--heading-07-font-weight)] text-gray-00 text-[length:var(--heading-07-font-size)] tracking-[var(--heading-07-letter-spacing)] leading-[var(--heading-07-line-height)] whitespace-nowrap [font-style:var(--heading-07-font-style)]">
            GỬI MÃ XÁC NHẬN
          </span>
          <ArrowRight className="!relative !w-5 !h-5 text-white shrink-0" />
        </button>

        <div className="inline-flex flex-col items-start gap-2">
          <div className="inline-flex items-start gap-1.5 flex-wrap">
            <span className="font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-600 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)]">
              Đã có tài khoản?
            </span>
            <button
              type="button"
              onClick={onBackToSignIn}
              className="font-body-small-500 font-[number:var(--body-small-500-font-weight)] text-secondary-500 text-[length:var(--body-small-500-font-size)] tracking-[var(--body-small-500-letter-spacing)] leading-[var(--body-small-500-line-height)] [font-style:var(--body-small-500-font-style)] bg-transparent border-none p-0 cursor-pointer hover:underline"
            >
              Đăng nhập
            </button>
          </div>
          <div className="inline-flex items-start gap-1.5 flex-wrap">
            <span className="font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-600 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)]">
              Chưa có tài khoản?
            </span>
            <button
              type="button"
              onClick={() => onGoToSignUp?.()}
              className="font-body-small-500 font-[number:var(--body-small-500-font-weight)] text-secondary-500 text-[length:var(--body-small-500-font-size)] tracking-[var(--body-small-500-letter-spacing)] leading-[var(--body-small-500-line-height)] [font-style:var(--body-small-500-font-style)] bg-transparent border-none p-0 cursor-pointer hover:underline"
            >
              Đăng ký
            </button>
          </div>
        </div>

        <div className="w-full h-px bg-gray-100" />

        <p className="relative w-full font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)] text-[#475156]">
          Nếu gặp sự cố, vui lòng liên hệ{" "}
          <span className="text-primary-500 cursor-pointer hover:underline">
            CSKH
          </span>{" "}
          để được hỗ trợ khôi phục tài khoản.
        </p>
      </div>
    </div>
  );
};
