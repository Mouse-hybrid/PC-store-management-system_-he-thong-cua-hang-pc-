import { useState } from "react";
import { ArrowRight } from "./ArrowRight";
import { Check } from "./Check";
import { Eye } from "./Eye";
import google from "./google.png";
import line20 from "./line-20.svg";
import vectorApple from "./vector-4.svg";
import { formatApiErrorMessage, isValidEmail, registerAccount } from "@/api/auth";

const errorBannerClass =
  "w-full p-3 bg-red-100 text-red-800 rounded-md text-sm border border-red-200 shadow-sm";
const successBannerClass =
  "w-full p-3 bg-success-50 text-success-800 rounded-md text-sm border border-success-200 shadow-sm";

export const UserRegistrationFormSection = ({ onGoToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    const username = formData.displayName.trim();
    const email = formData.email.trim();
    const { password, confirmPassword } = formData;

    if (!username) {
      setErrorMsg("Vui lòng nhập tên hiển thị.");
      return;
    }
    if (!email) {
      setErrorMsg("Vui lòng nhập email.");
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMsg("Email không đúng định dạng.");
      return;
    }
    if (!password) {
      setErrorMsg("Vui lòng nhập mật khẩu.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }
    if (!agreed) {
      setErrorMsg("Vui lòng đồng ý với điều khoản sử dụng và chính sách bảo mật.");
      return;
    }

    setSubmitting(true);
    try {
      await registerAccount({ username, email, password });
      setSuccess(true);
      setTimeout(() => {
        onGoToLogin?.();
      }, 1200);
    } catch (err) {
      setErrorMsg(formatApiErrorMessage(err, "Đăng ký thất bại. Thử lại sau."));
    } finally {
      setSubmitting(false);
    }
  };

  const showErrorBanner = Boolean(errorMsg) && !success;

  return (
    <div className="min-h-[min(100vh,1185px)] w-full flex justify-center items-start py-16 px-4 sm:px-8 lg:px-[748px] bg-gray-50">
      <div className="w-full max-w-[424px] flex flex-col rounded overflow-hidden border border-solid border-gray-100 bg-gray-00 shadow-dropdown-shadow">
        <div className="flex w-full shrink-0">
          <button
            type="button"
            onClick={() => onGoToLogin?.()}
            className="flex-1 inline-flex items-center justify-center py-4 border-none cursor-pointer bg-gray-00"
          >
            <span className="font-body-XL-600 text-gray-500 text-center px-2">Đăng nhập</span>
          </button>
          <div className="flex-1 inline-flex items-center justify-center py-4 bg-gray-00 shadow-[inset_0px_-3px_0px_#f98131,inset_0px_1px_0px_#e4e7e9,inset_-1px_0px_0px_#e4e7e9]">
            <span className="font-body-XL-600 text-gray-900 text-center px-2">Đăng ký</span>
          </div>
        </div>

        <div className="h-px w-full bg-gray-100 shrink-0" />

        <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4 px-8 pt-6 pb-4 w-full min-h-0">
          <div
            className="overflow-hidden transition-[max-height] duration-300 ease-in-out motion-reduce:transition-none"
            style={{ maxHeight: success ? 120 : 0 }}
            aria-live="polite"
          >
            {success ? (
              <div className={`${successBannerClass}`} role="status">
                Đăng ký thành công!
              </div>
            ) : null}
          </div>

          <div
            className="overflow-hidden transition-[max-height] duration-300 ease-in-out motion-reduce:transition-none"
            style={{ maxHeight: showErrorBanner ? 220 : 0 }}
            aria-live="assertive"
          >
            {showErrorBanner ? (
              <div className={errorBannerClass} role="alert">
                {errorMsg}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col w-full gap-2">
            <label htmlFor="displayName" className="font-body-small-400 text-gray-900">
              Tên hiển thị
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              value={formData.displayName}
              onChange={handleChange}
              disabled={success || submitting}
              autoComplete="username"
              className="w-full h-11 bg-gray-00 rounded-sm border border-solid border-gray-100 px-4 outline-none focus:border-primary-500 font-body-small-400 text-gray-900 disabled:opacity-60"
            />
          </div>

          <div className="flex flex-col w-full gap-2">
            <label htmlFor="reg-email" className="font-body-small-400 text-gray-900">
              Địa chỉ Email
            </label>
            <input
              id="reg-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              disabled={success || submitting}
              className="w-full h-11 bg-gray-00 rounded-sm border border-solid border-gray-100 px-4 outline-none focus:border-primary-500 font-body-small-400 text-gray-900 disabled:opacity-60"
            />
          </div>

          <div className="flex flex-col w-full gap-2">
            <label htmlFor="reg-password" className="font-body-small-400 text-gray-900">
              Mật khẩu
            </label>
            <div className="relative w-full h-11 bg-gray-00 rounded-sm border border-solid border-gray-100">
              <input
                id="reg-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                disabled={success || submitting}
                className="absolute inset-0 w-full h-full bg-transparent px-4 pr-10 outline-none focus:border-primary-500 rounded-sm font-body-small-400 text-gray-900 border-0 disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 right-3 w-5 h-5 flex items-center justify-center bg-transparent border-0 p-0 cursor-pointer"
                aria-label="Ẩn/hiện mật khẩu"
              >
                <Eye className="!w-5 !h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col w-full gap-2">
            <label htmlFor="confirmPassword" className="font-body-small-400 text-gray-900">
              Xác nhận mật khẩu
            </label>
            <div className="relative w-full h-11 bg-gray-00 rounded-sm border border-solid border-gray-100">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                disabled={success || submitting}
                className="absolute inset-0 w-full h-full bg-transparent px-4 pr-10 outline-none focus:border-primary-500 rounded-sm font-body-small-400 text-gray-900 border-0 disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 -translate-y-1/2 right-3 w-5 h-5 flex items-center justify-center bg-transparent border-0 p-0 cursor-pointer"
                aria-label="Ẩn/hiện mật khẩu xác nhận"
              >
                <Eye className="!w-5 !h-5" />
              </button>
            </div>
          </div>

          <div className="inline-flex items-start gap-2 w-full pt-1">
            <button
              type="button"
              onClick={() => setAgreed(!agreed)}
              disabled={success || submitting}
              className={`relative w-5 h-5 rounded-sm shrink-0 border-0 p-0 cursor-pointer flex items-center justify-center disabled:opacity-60 ${
                agreed ? "bg-primary-500" : "bg-gray-00 border border-solid border-gray-100"
              }`}
              aria-pressed={agreed}
              aria-label="Đồng ý điều khoản"
            >
              {agreed && <Check className="!w-3.5 !h-3.5" />}
            </button>
            <p className="flex-1 font-body-small-400 text-[#475156] leading-snug">
              Tôi đồng ý với{" "}
              <button
                type="button"
                className="font-body-small-500 text-secondary-500 p-0 border-0 bg-transparent cursor-pointer hover:underline inline"
              >
                Điều khoản sử dụng
              </button>{" "}
              và{" "}
              <button
                type="button"
                className="font-body-small-500 text-secondary-500 p-0 border-0 bg-transparent cursor-pointer hover:underline inline"
              >
                Chính sách bảo mật
              </button>{" "}
              của shop
            </p>
          </div>

          <button
            type="submit"
            disabled={success || submitting}
            className="mt-6 w-full h-11 flex items-center justify-center gap-2 px-6 bg-primary-500 rounded-sm border-0 text-white font-heading-07 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
          >
            {submitting ? "Đang xử lý…" : "ĐĂNG KÝ TÀI KHOẢN"}
            <ArrowRight className="!relative !w-5 !h-5 text-white shrink-0" />
          </button>
        </form>

        <div className="flex flex-col gap-3 px-8 pb-8 pt-2 w-full">
          <div className="relative w-full h-5 shrink-0">
            <img className="absolute top-[9px] left-0 w-full h-px object-cover" alt="" src={line20} crossOrigin="anonymous" />
            <div className="inline-flex items-center gap-2.5 px-2 py-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-00">
              <span className="font-body-small-400 text-gray-500">or</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full h-11 bg-gray-00 rounded-sm border border-solid border-gray-100 cursor-pointer flex items-center justify-center gap-2 px-4"
          >
            <img className="w-5 h-5 shrink-0" alt="" src={google} crossOrigin="anonymous" />
            <span className="font-body-small-400 text-gray-700">Đăng ký bằng Google</span>
          </button>

          <button
            type="button"
            className="w-full h-11 bg-gray-00 rounded-sm border border-solid border-gray-100 cursor-pointer flex items-center justify-center gap-2 px-4"
          >
            <img className="w-5 h-5 shrink-0" alt="" src={vectorApple} crossOrigin="anonymous" />
            <span className="font-body-small-400 text-gray-700">Đăng ký bằng Apple</span>
          </button>
        </div>
      </div>
    </div>
  );
};
