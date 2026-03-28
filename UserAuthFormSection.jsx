import { useState } from "react";
import { ArrowRight } from "./ArrowRight";
import { Eye } from "./Eye";
import google from "./google.png";
import line20 from "./line-20.svg";
import vector4 from "./vector-4.svg";
import { formatApiErrorMessage, isValidEmail, loginAccount, pickAuthToken } from "@/api/auth";

const errorBannerClass =
  "w-full p-3 bg-red-100 text-red-800 rounded-md text-sm border border-red-200 shadow-sm";

export const UserAuthFormSection = ({ onForgotPassword, onGoToRegister, onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setErrorMsg(null);
    const emailTrim = email.trim();
    const passwordTrim = password;

    if (!emailTrim) {
      setErrorMsg("Vui lòng nhập địa chỉ email.");
      return;
    }
    if (!isValidEmail(emailTrim)) {
      setErrorMsg("Email không đúng định dạng.");
      return;
    }
    if (!passwordTrim) {
      setErrorMsg("Vui lòng nhập mật khẩu.");
      return;
    }

    setLoading(true);
    try {
      const data = await loginAccount({ email: emailTrim, password: passwordTrim });
      const token = pickAuthToken(data);
      if (token) {
        localStorage.setItem("access_token", token);
      }
      onLoginSuccess?.();
    } catch (err) {
      setErrorMsg(formatApiErrorMessage(err, "Đăng nhập thất bại. Kiểm tra email và mật khẩu."));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="min-h-[min(100vh,1185px)] w-full flex justify-center items-start py-16 px-4 sm:px-8 lg:px-[748px]">
      <div className="w-full max-w-[424px] flex flex-col rounded overflow-hidden border border-solid border-gray-100 bg-gray-00 shadow-dropdown-shadow">
        <div className="flex w-full shrink-0">
          <button
            type="button"
            className="flex-1 inline-flex items-center justify-center py-4 border-none cursor-pointer bg-gray-00 shadow-[inset_0px_-3px_0px_#f98131,inset_0px_1px_0px_#e4e7e9,inset_1px_0px_0px_#e4e7e9]"
          >
            <span className="font-body-XL-600 text-gray-900 text-center px-2">Đăng nhập</span>
          </button>
          <button
            type="button"
            onClick={() => onGoToRegister?.()}
            className="flex-1 inline-flex items-center justify-center py-4 border-none cursor-pointer bg-gray-00"
          >
            <span className="font-body-XL-600 text-gray-500 text-center px-2">Đăng ký</span>
          </button>
        </div>

        <div className="h-px w-full bg-gray-100 shrink-0" />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-8 pt-6 pb-4 w-full min-h-0">
          <div
            className="overflow-hidden transition-[max-height] duration-300 ease-in-out motion-reduce:transition-none"
            style={{ maxHeight: errorMsg ? 220 : 0 }}
            aria-live="polite"
          >
            {errorMsg ? (
              <div className={`${errorBannerClass} mb-0`} role="alert">
                {errorMsg}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col w-full gap-2">
            <label htmlFor="email" className="font-body-small-400 text-gray-900">
              Địa chỉ email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 bg-gray-00 rounded-sm border border-solid border-gray-100 px-3 outline-none focus:border-primary-500 font-body-small-400 text-gray-900"
            />
          </div>

          <div className="flex flex-col w-full gap-2">
            <div className="flex items-center justify-between gap-2 w-full">
              <label htmlFor="password" className="font-body-small-400 text-gray-900 shrink-0">
                Mật khẩu
              </label>
              <button
                type="button"
                onClick={() => onForgotPassword?.()}
                className="font-body-small-500 text-secondary-500 bg-transparent border-none cursor-pointer p-0 shrink-0"
              >
                Quên mật khẩu ?
              </button>
            </div>
            <div className="relative w-full h-11 bg-gray-00 rounded-sm border border-solid border-gray-100">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="absolute inset-0 w-full h-full bg-transparent px-3 pr-10 outline-none focus:border-primary-500 font-body-small-400 text-gray-900 border-none rounded-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 right-2 bg-transparent border-none cursor-pointer p-0 flex items-center justify-center"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                <Eye className="!w-5 !h-5" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full h-11 flex items-center justify-center gap-2 px-6 bg-primary-500 rounded-sm border-none cursor-pointer text-gray-00 font-heading-07 disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
          >
            {loading ? "Đang xử lý…" : "ĐĂNG NHẬP"}
            <ArrowRight className="!relative !w-5 !h-5 shrink-0" />
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
            className="relative w-full h-11 bg-gray-00 rounded-sm border border-solid border-gray-100 cursor-pointer flex items-center justify-center gap-2 pl-4 pr-4"
          >
            <img className="w-5 h-5 shrink-0" alt="" src={google} crossOrigin="anonymous" />
            <span className="font-body-small-400 text-gray-700">Đăng nhập bằng Google</span>
          </button>

          <button
            type="button"
            className="relative w-full h-11 bg-gray-00 rounded-sm border border-solid border-gray-100 cursor-pointer flex items-center justify-center gap-2 pl-4 pr-4"
          >
            <img className="w-5 h-5 shrink-0" alt="" src={vector4} crossOrigin="anonymous" />
            <span className="font-body-small-400 text-gray-700">Đăng nhập bằng Apple</span>
          </button>
        </div>
      </div>
    </div>
  );
};
