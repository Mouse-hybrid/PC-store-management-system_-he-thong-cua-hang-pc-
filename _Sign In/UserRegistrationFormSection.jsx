import { useState } from "react";
import { ArrowRight } from "./ArrowRight";
import { Check } from "./Check";
import { Eye } from "./Eye";
import google from "./google.png";
import line20 from "./line-20.svg";
import line29 from "./line-29.svg";
import vectorApple from "./vector-4.svg";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[1185px] gap-2.5 px-[748px] py-[100px] inline-flex items-start justify-center relative w-[1920px] max-w-full bg-gray-50">
      <div className="relative w-[424px] min-h-[744px] bg-gray-00 rounded overflow-hidden border border-solid border-gray-100 shadow-dropdown-shadow">
        <div className="inline-flex flex-col items-start gap-4 absolute top-[84px] left-8 right-8">
          <div className="flex flex-col w-full max-w-[360px] items-start gap-2">
            <label
              htmlFor="displayName"
              className="relative self-stretch mt-[-1px] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-900 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)]"
            >
              Tên hiển thị
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              value={formData.displayName}
              onChange={handleChange}
              className="relative self-stretch w-full h-11 bg-gray-00 rounded-sm border border-solid border-gray-100 px-4 outline-none focus:border-primary-500 font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-900 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)]"
            />
          </div>

          <div className="flex flex-col w-full max-w-[360px] items-start gap-2">
            <label
              htmlFor="reg-email"
              className="relative self-stretch mt-[-1px] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-900 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)]"
            >
              Địa chỉ Email
            </label>
            <input
              id="reg-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              className="relative self-stretch w-full h-11 bg-gray-00 rounded-sm border border-solid border-gray-100 px-4 outline-none focus:border-primary-500 font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-900 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)]"
            />
          </div>

          <div className="flex flex-col w-full max-w-[360px] items-start gap-2">
            <label
              htmlFor="reg-password"
              className="relative self-stretch mt-[-1px] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-900 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)]"
            >
              Mật khẩu
            </label>
            <div className="relative self-stretch w-full h-11 bg-gray-00 rounded-sm border border-solid border-gray-100">
              <input
                id="reg-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                className="absolute inset-0 w-full h-full bg-transparent px-4 pr-10 outline-none focus:border-primary-500 rounded-sm font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-900 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)] border-0"
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

          <div className="flex flex-col w-full max-w-[360px] items-start gap-2">
            <label
              htmlFor="confirmPassword"
              className="relative self-stretch mt-[-1px] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-900 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)]"
            >
              Xác nhận mật khẩu
            </label>
            <div className="relative self-stretch w-full h-11 bg-gray-00 rounded-sm border border-solid border-gray-100">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                className="absolute inset-0 w-full h-full bg-transparent px-4 pr-10 outline-none focus:border-primary-500 rounded-sm font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-900 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)] border-0"
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

          <div className="inline-flex items-start gap-2 max-w-[360px]">
            <button
              type="button"
              onClick={() => setAgreed(!agreed)}
              className={`relative w-5 h-5 rounded-sm shrink-0 border-0 p-0 cursor-pointer flex items-center justify-center ${
                agreed
                  ? "bg-primary-500"
                  : "bg-gray-00 border border-solid border-gray-100"
              }`}
              aria-pressed={agreed}
              aria-label="Đồng ý điều khoản"
            >
              {agreed && (
                <Check className="!w-3.5 !h-3.5" />
              )}
            </button>

            <p className="relative flex-1 mt-[-1px] font-body-small-400 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)] text-[#475156]">
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
        </div>

        <button
          type="submit"
          className="flex w-[360px] max-w-[calc(100%-4rem)] items-center justify-center gap-2 px-6 py-3 absolute top-[508px] left-8 bg-primary-500 rounded-sm h-11 cursor-pointer border-0 text-white"
        >
          <span className="relative w-fit font-heading-07 font-[number:var(--heading-07-font-weight)] text-gray-00 text-[length:var(--heading-07-font-size)] tracking-[var(--heading-07-letter-spacing)] leading-[var(--heading-07-line-height)] whitespace-nowrap [font-style:var(--heading-07-font-style)]">
            ĐĂNG KÝ TÀI KHOẢN
          </span>
          <ArrowRight className="!relative !w-5 !h-5 text-white shrink-0" />
        </button>

        <div className="inline-flex flex-col items-start gap-3 absolute top-[580px] left-8 w-[360px] max-w-[calc(100%-4rem)] pb-8">
          <div className="relative w-full h-5">
            <img
              className="absolute top-[9px] left-0 w-full h-px object-cover max-w-[360px]"
              alt=""
              src={line20}
            />
            <div className="inline-flex items-start gap-2.5 px-2 py-0 absolute top-[calc(50%_-_10px)] left-1/2 -translate-x-1/2 bg-gray-00">
              <span className="relative font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-500 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] whitespace-nowrap [font-style:var(--body-small-400-font-style)]">
                or
              </span>
            </div>
          </div>

          <button
            type="button"
            className="relative w-full h-11 bg-gray-00 rounded-sm border border-solid border-gray-100 cursor-pointer"
          >
            <span className="left-[calc(50%_-_70px)] absolute top-[calc(50%_-_10px)] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-700 text-[length:var(--body-small-400-font-size)] text-center tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] whitespace-nowrap [font-style:var(--body-small-400-font-style)]">
              Đăng ký bằng Google
            </span>
            <img
              className="absolute top-[calc(50%_-_10px)] left-4 w-5 h-5"
              alt=""
              src={google}
            />
          </button>

          <button
            type="button"
            className="relative w-full h-11 bg-gray-00 rounded-sm border border-solid border-gray-100 cursor-pointer"
          >
            <span className="left-[calc(50%_-_67px)] absolute top-[calc(50%_-_10px)] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-700 text-[length:var(--body-small-400-font-size)] text-center tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] whitespace-nowrap [font-style:var(--body-small-400-font-style)]">
              Đăng ký bằng Apple
            </span>
            <div className="absolute top-[calc(50%_-_10px)] left-4 w-5 h-5 flex">
              <img
                className="flex-1 w-[16.76px]"
                alt=""
                src={vectorApple}
              />
            </div>
          </button>
        </div>

        <img
          className="absolute top-[59px] left-0 w-full max-w-[424px] h-px object-cover"
          alt=""
          src={line29}
        />

        <div className="inline-flex items-stretch absolute top-0 left-0 w-full">
          <button
            type="button"
            onClick={() => onGoToLogin?.()}
            className="inline-flex flex-1 items-start justify-center gap-2.5 px-0 py-4 bg-gray-00 border-0 cursor-pointer"
          >
            <span className="relative font-body-XL-600 font-[number:var(--body-XL-600-font-weight)] text-gray-500 text-[length:var(--body-XL-600-font-size)] text-center tracking-[var(--body-XL-600-letter-spacing)] leading-[var(--body-XL-600-line-height)] [font-style:var(--body-XL-600-font-style)]">
              Đăng nhập
            </span>
          </button>

          <div className="flex-1 bg-gray-00 shadow-[inset_0px_-3px_0px_#f98131,inset_0px_1px_0px_#e4e7e9,inset_-1px_0px_0px_#e4e7e9] inline-flex items-start justify-center gap-2.5 px-0 py-4">
            <span className="relative font-body-XL-600 font-[number:var(--body-XL-600-font-weight)] text-gray-900 text-[length:var(--body-XL-600-font-size)] text-center tracking-[var(--body-XL-600-letter-spacing)] leading-[var(--body-XL-600-line-height)] [font-style:var(--body-XL-600-font-style)]">
              Đăng ký
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
