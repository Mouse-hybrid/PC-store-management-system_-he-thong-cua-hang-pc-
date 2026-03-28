import { useState } from "react";
import { ArrowRight } from "./ArrowRight";
import { Eye } from "./Eye";

export const UserResetPasswordFormSection = ({ onComplete }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete?.();
  };

  return (
    <div className="min-h-[1185px] gap-2.5 px-[748px] py-[100px] inline-flex items-start justify-center relative w-[1920px] max-w-full bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="inline-flex w-[424px] max-w-full flex-col items-stretch gap-6 p-8 bg-gray-00 rounded border border-solid border-gray-100 shadow-dropdown-shadow"
      >
        <div className="inline-flex flex-col items-start gap-3">
          <h1 className="relative w-full max-w-[360px] mx-auto mt-[-1px] font-body-XL-600 font-[number:var(--body-XL-600-font-weight)] text-gray-900 text-[length:var(--body-XL-600-font-size)] text-center tracking-[var(--body-XL-600-letter-spacing)] leading-[var(--body-XL-600-line-height)] [font-style:var(--body-XL-600-font-style)]">
            Đặt lại mật khẩu
          </h1>
          <p className="relative w-full max-w-[360px] mx-auto font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-600 text-[length:var(--body-small-400-font-size)] text-center tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)]">
            Vui lòng tạo mật khẩu mới để đăng nhập và sử dụng dịch vụ của shop
            một cách an toàn.
          </p>
        </div>

        <div className="inline-flex flex-col items-stretch gap-4 w-full">
          <div className="flex flex-col w-full max-w-[360px] mx-auto items-start gap-2">
            <label
              htmlFor="new-password"
              className="relative self-stretch mt-[-1px] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-900 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)]"
            >
              Mật khẩu mới
            </label>
            <div className="relative self-stretch w-full h-11 bg-gray-00 rounded-sm border border-solid border-gray-100 focus-within:border-primary-500">
              <input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="(Tối thiểu 8 ký tự)"
                autoComplete="new-password"
                className="absolute inset-0 w-full h-full pl-3 pr-10 bg-transparent font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-900 placeholder:text-gray-500 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)] border-0 outline-none focus:ring-0 rounded-sm"
              />
              <button
                type="button"
                aria-label={showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center justify-center bg-transparent border-0 p-0 cursor-pointer text-gray-600"
              >
                <Eye className="!w-5 !h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col w-full max-w-[360px] mx-auto items-start gap-2">
            <label
              htmlFor="confirm-password"
              className="relative self-stretch mt-[-1px] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-900 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)]"
            >
              Xác nhận mật khẩu mới
            </label>
            <div className="relative self-stretch w-full h-11 bg-gray-00 rounded-sm border border-solid border-gray-100 focus-within:border-primary-500">
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className="absolute inset-0 w-full h-full pl-3 pr-10 bg-transparent font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-900 placeholder:text-gray-500 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)] border-0 outline-none focus:ring-0 rounded-sm"
              />
              <button
                type="button"
                aria-label={
                  showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                }
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center justify-center bg-transparent border-0 p-0 cursor-pointer text-gray-600"
              >
                <Eye className="!w-5 !h-5" />
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="flex w-full max-w-[360px] mx-auto items-center justify-center gap-2 px-6 py-3 bg-primary-500 rounded-sm cursor-pointer border-0 outline-none hover:opacity-95 transition-opacity"
        >
          <span className="relative w-fit font-heading-07 font-[number:var(--heading-07-font-weight)] text-gray-00 text-[length:var(--heading-07-font-size)] tracking-[var(--heading-07-letter-spacing)] leading-[var(--heading-07-line-height)] whitespace-nowrap [font-style:var(--heading-07-font-style)]">
            ĐẶT LẠI MẬT KHẨU
          </span>
          <ArrowRight className="!relative !w-5 !h-5 text-white shrink-0" />
        </button>
      </form>
    </div>
  );
};
