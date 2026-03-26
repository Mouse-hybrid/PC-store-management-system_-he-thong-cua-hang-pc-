import { useState } from "react";
import { ArrowRight } from "./ArrowRight";
import { Eye } from "./Eye";
import google from "./google.png";
import line20 from "./line-20.svg";
import line29 from "./line-29.svg";
import vector4 from "./vector-4.svg";

export const UserAuthFormSection = ({
  onForgotPassword,
  onGoToRegister,
  onLoginSuccess,
  onLoginMissingEmail,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const emailTrim = email.trim();
    const passwordTrim = password.trim();
    if (passwordTrim && !emailTrim) {
      onLoginMissingEmail?.();
      return;
    }
    if (emailTrim && passwordTrim) {
      onLoginSuccess?.();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="h-[1185px] gap-2.5 px-[748px] py-[100px] inline-flex items-start relative">
      <div className="relative w-[424px] h-[504px] bg-gray-00 rounded overflow-hidden border border-solid border-gray-100 shadow-dropdown-shadow">
        <div className="absolute w-full h-full top-0 left-0 bg-gray-00 border border-solid border-gray-100 shadow-dropdown-shadow" />

        <form onSubmit={handleSubmit}>
          <div className="inline-flex flex-col items-start gap-4 absolute w-[84.91%] h-[31.75%] top-[16.67%] left-[7.55%]">
            <div className="flex flex-col w-[360px] items-start gap-2 relative flex-[0_0_auto]">
              <label
                htmlFor="email"
                className="relative self-stretch mt-[-1.00px] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-900 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)]"
              >
                Địa chỉ email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative self-stretch w-full h-11 bg-gray-00 rounded-sm border border-solid border-gray-100 px-3 outline-none focus:border-primary-500 font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-900 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)]"
              />
            </div>

            <div className="flex flex-col w-[360px] items-start gap-2 relative flex-[0_0_auto]">
              <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
                <label
                  htmlFor="password"
                  className="relative w-fit mt-[-1.00px] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-900 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] whitespace-nowrap [font-style:var(--body-small-400-font-style)]"
                >
                  Mật khẩu
                </label>

                <button
                  type="button"
                  onClick={() => onForgotPassword?.()}
                  className="relative w-fit mt-[-1.00px] font-body-small-500 font-[number:var(--body-small-500-font-weight)] text-secondary-500 text-[length:var(--body-small-500-font-size)] tracking-[var(--body-small-500-letter-spacing)] leading-[var(--body-small-500-line-height)] whitespace-nowrap [font-style:var(--body-small-500-font-style)] bg-transparent border-none cursor-pointer p-0"
                >
                  Quên mật khẩu ?
                </button>
              </div>

              <div className="relative self-stretch w-full h-11 bg-gray-00 rounded-sm border border-solid border-gray-100">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="absolute inset-0 w-full h-full bg-transparent px-3 pr-10 outline-none focus:border-primary-500 font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-900 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)] border-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-[calc(50.00%_-_10px)] right-0 bg-transparent border-none cursor-pointer p-0 flex items-center justify-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <Eye className="!w-5 !h-5" />
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="flex w-[84.91%] items-center justify-center gap-2 px-6 py-0 absolute h-[9.52%] top-[53.17%] left-[7.55%] bg-primary-500 rounded-sm border-none cursor-pointer"
          >
            <div className="relative w-fit mt-[-1.00px] font-heading-07 font-[number:var(--heading-07-font-weight)] text-gray-00 text-[length:var(--heading-07-font-size)] tracking-[var(--heading-07-letter-spacing)] leading-[var(--heading-07-line-height)] whitespace-nowrap [font-style:var(--heading-07-font-style)]">
              ĐĂNG NHẬP
            </div>

            <ArrowRight className="!relative !w-5 !h-5" />
          </button>
        </form>

        <div className="inline-flex flex-col items-start gap-3 absolute w-[84.91%] h-[26.19%] top-[67.46%] left-[7.55%]">
          <div className="relative w-[360px] h-5">
            <img
              className="absolute top-[9px] left-0 w-[360px] h-px object-cover"
              alt="Line"
              src={line20}
            />

            <div className="inline-flex items-start gap-2.5 px-2 py-0 absolute top-[calc(50.00%_-_10px)] left-[calc(50.00%_-_15px)] bg-gray-00">
              <div className="relative w-fit mt-[-1.00px] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-500 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] whitespace-nowrap [font-style:var(--body-small-400-font-style)]">
                or
              </div>
            </div>
          </div>

          <button
            type="button"
            className="relative w-[360px] h-11 bg-gray-00 rounded-sm border border-solid border-gray-100 cursor-pointer"
          >
            <p className="left-[calc(50.00%_-_80px)] absolute top-[calc(50.00%_-_10px)] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-700 text-[length:var(--body-small-400-font-size)] text-center tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] whitespace-nowrap [font-style:var(--body-small-400-font-style)]">
              {" "}
              Đăng nhập bằng Google
            </p>

            <img
              className="absolute top-[calc(50.00%_-_10px)] left-4 w-5 h-5"
              alt="Google"
              src={google}
            />
          </button>

          <button
            type="button"
            className="relative w-[360px] h-11 bg-gray-00 rounded-sm border border-solid border-gray-100 cursor-pointer"
          >
            <p className="left-[calc(50.00%_-_76px)] absolute top-[calc(50.00%_-_10px)] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-700 text-[length:var(--body-small-400-font-size)] text-center tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] whitespace-nowrap [font-style:var(--body-small-400-font-style)]">
              {" "}
              Đăng nhập bằng Apple
            </p>

            <div className="absolute top-[calc(50.00%_-_10px)] left-4 w-5 h-5 flex">
              <img className="flex-1 w-[16.76px]" alt="Vector" src={vector4} />
            </div>
          </button>
        </div>

        <img
          className="absolute top-[59px] left-0 w-[424px] h-px object-cover"
          alt="Line"
          src={line29}
        />

        <div className="inline-flex items-start absolute top-0 left-0">
          <button
            type="button"
            className="inline-flex items-start gap-2.5 px-0 py-4 relative flex-[0_0_auto] border-none cursor-pointer bg-gray-00 shadow-[inset_0px_-3px_0px_#f98131,inset_0px_1px_0px_#e4e7e9,inset_1px_0px_0px_#e4e7e9]"
          >
            <div className="relative w-[212px] mt-[-1.00px] font-body-XL-600 font-[number:var(--body-XL-600-font-weight)] text-gray-900 text-[length:var(--body-XL-600-font-size)] text-center tracking-[var(--body-XL-600-letter-spacing)] leading-[var(--body-XL-600-line-height)] [font-style:var(--body-XL-600-font-style)]">
              Đăng nhập
            </div>
          </button>

          <button
            type="button"
            onClick={() => onGoToRegister?.()}
            className="inline-flex items-start gap-2.5 px-0 py-4 relative flex-[0_0_auto] border-none cursor-pointer bg-gray-00"
          >
            <div className="relative w-[212px] mt-[-1.00px] font-body-XL-600 font-[number:var(--body-XL-600-font-weight)] text-gray-500 text-[length:var(--body-XL-600-font-size)] text-center tracking-[var(--body-XL-600-letter-spacing)] leading-[var(--body-XL-600-line-height)] [font-style:var(--body-XL-600-font-style)]">
              Đăng ký
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
