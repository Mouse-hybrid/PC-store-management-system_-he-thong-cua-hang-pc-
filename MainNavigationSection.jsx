import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowsCounterClockwise } from "./ArrowsCounterClockwise";
import { CaretDown } from "./CaretDown";
import { Headphones } from "./Headphones";
import { Heart } from "./Heart";
import { IconComponentNode } from "./IconComponentNode";
import { Info } from "./Info";
import { MagnifyingGlass } from "./MagnifyingGlass";
import { MapPinLine } from "./MapPinLine";
import { PhoneCall } from "./PhoneCall";
import { User } from "./User";
import logoStoryPc from "./assets/logo-storypc.png";
import shoppingCartIcon1 from "./shopping-cart-simple.svg";
import shoppingCartIcon2 from "./shopping-cart-simple-2.svg";
import line1 from "./line-1.svg";
import socialIcon from "./social-icon.svg";

const navItems = [
  { icon: <MapPinLine className="!relative !w-6 !h-6" />, label: "Địa chỉ" },
  {
    icon: <ArrowsCounterClockwise className="!relative !w-6 !h-6" />,
    label: "So sánh sản phẩm",
  },
  {
    icon: <Headphones className="!relative !w-6 !h-6" />,
    label: "Chat Zalo / Messenger",
  },
  { icon: <Info className="!relative !w-6 !h-6" />, label: "FAQ" },
];

export const MainNavigationSection = ({
  cartCount = 0,
  onFaqClick,
  onCartClick,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [headerSearch, setHeaderSearch] = useState("");

  useEffect(() => {
    if (!location.pathname.startsWith("/shop")) return;
    const q = new URLSearchParams(location.search).get("search") ?? "";
    setHeaderSearch(q);
  }, [location.pathname, location.search]);

  const handleHeaderSearchSubmit = (e) => {
    e.preventDefault();
    const q = headerSearch.trim();
    if (q) {
      navigate({ pathname: "/shop", search: `?search=${encodeURIComponent(q)}` });
    } else {
      navigate({ pathname: "/shop", search: "" });
    }
  };

  const cartIcon = cartCount >= 2 ? shoppingCartIcon2 : shoppingCartIcon1;
  return (
    <div className="inline-flex flex-col items-start relative w-full max-w-[1920px] mx-auto">
      <div className="flex w-full items-center justify-between px-[300px] py-3 bg-secondary-700 shadow-[inset_0px_-1px_0px_#ffffff29]">
        <p className="relative w-fit font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-white text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] whitespace-nowrap [font-style:var(--body-small-400-font-style)]">
          Welcome to StoryPC – PC &amp; Gaming Gear Store
        </p>

        <div className="inline-flex items-center justify-center gap-6 relative flex-[0_0_auto]">
          <div className="inline-flex items-center justify-center gap-3 relative flex-[0_0_auto]">
            <div className="relative w-fit mt-[-1.00px] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-00 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] whitespace-nowrap [font-style:var(--body-small-400-font-style)]">
              Follow us:
            </div>

            <img
              className="relative flex-[0_0_auto]"
              alt="Social icon"
              src={socialIcon}
              crossOrigin="anonymous"
            />
          </div>

          <img
            className="relative w-px h-7 object-cover"
            alt="Line"
            src={line1}
            crossOrigin="anonymous"
          />

          <div className="relative w-11 h-5">
            <div className="inline-flex items-center justify-center gap-1.5 relative w-full h-full">
              <div className="relative w-fit mt-[-1.00px] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-00 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] whitespace-nowrap [font-style:var(--body-small-400-font-style)]">
                Eng
              </div>

              <CaretDown className="!relative !w-3 !h-3" />
            </div>
          </div>

          <div className="relative w-[47px] h-5">
            <div className="inline-flex items-center justify-center gap-1.5 relative w-full h-full">
              <div className="relative w-fit mt-[-1.00px] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-white text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] whitespace-nowrap [font-style:var(--body-small-400-font-style)]">
                VND
              </div>

              <CaretDown className="!relative !w-3 !h-3" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-between gap-6 px-6 sm:px-12 lg:px-[300px] py-5 bg-secondary-700">
        <div className="inline-flex items-center justify-center relative shrink-0">
          <img
            className="relative w-[181px] h-[48px] object-contain"
            alt="StoryPC logo"
            src={logoStoryPc}
            crossOrigin="anonymous"
          />
        </div>

        <form
          role="search"
          className="flex-1 min-w-0 max-w-[min(920px,52vw)] mx-auto"
          onSubmit={handleHeaderSearchSubmit}
        >
          <div className="relative w-full group">
            <input
              id="header-shop-search"
              name="search"
              type="text"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              placeholder="Tìm kiếm laptop, PC, linh kiện..."
              autoComplete="off"
              enterKeyHint="search"
              className="w-full min-w-0 rounded-2xl border-0 bg-gray-00 py-3.5 pl-5 pr-14 text-sm text-gray-900 shadow-[0px_10px_40px_rgba(0,0,0,0.12)] outline-none ring-2 ring-white/10 transition placeholder:text-gray-400 focus:ring-primary-400/90 focus:shadow-[0px_12px_48px_rgba(250,130,50,0.18)]"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-xl text-secondary-600 transition hover:bg-primary-50 hover:text-primary-600 active:scale-95"
              aria-label="Tìm kiếm"
            >
              <MagnifyingGlass className="!relative !w-5 !h-5 shrink-0" />
            </button>
          </div>
        </form>

        <div className="inline-flex items-center gap-6 relative shrink-0">
          <button
            type="button"
            onClick={onCartClick}
            className="all-[unset] box-border relative w-8 h-8 shrink-0 cursor-pointer"
            aria-label="Giỏ hàng"
          >
            <img
              className="relative w-full h-full object-contain"
              alt="Shopping cart"
              src={cartIcon}
              crossOrigin="anonymous"
            />

            <div className="inline-flex flex-col items-start gap-2.5 px-0 py-0.5 absolute -top-1.5 -right-1.5 bg-white rounded-[100px] border-[1.5px] border-solid border-secondary-700">
              <div className="relative w-5 min-w-[1.25rem] font-body-tiny-600 font-[number:var(--body-tiny-600-font-weight)] text-secondary-700 text-[length:var(--body-tiny-600-font-size)] text-center tracking-[var(--body-tiny-600-letter-spacing)] leading-[var(--body-tiny-600-line-height)] [font-style:var(--body-tiny-600-font-style)]">
                {cartCount}
              </div>
            </div>
          </button>

          <Heart className="!relative !w-8 !h-8 shrink-0" />
          <User className="!relative !w-8 !h-8 shrink-0" />
        </div>
      </div>

      <div className="flex w-full items-center justify-between px-[300px] py-4 bg-gray-00 shadow-[inset_0px_-1px_0px_#e4e7e9]">
        <div className="inline-flex items-center justify-center gap-6 relative flex-[0_0_auto] flex-wrap">
          <div className="relative w-[154px] h-12 shrink-0">
            <div className="inline-flex items-center justify-center gap-2 px-6 py-3.5 relative bg-gray-50 rounded-sm">
              <div className="relative w-fit mt-[-1.00px] font-body-small-500 font-[number:var(--body-small-500-font-weight)] text-gray-900 text-[length:var(--body-small-500-font-size)] tracking-[var(--body-small-500-letter-spacing)] leading-[var(--body-small-500-line-height)] whitespace-nowrap [font-style:var(--body-small-500-font-style)]">
                Danh mục
              </div>

              <IconComponentNode className="!relative !w-4 !h-4 text-gray-900" />
            </div>
          </div>

          {navItems.map((item, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1.5 relative flex-[0_0_auto]"
            >
              {item.icon}
              {item.label === "FAQ" ? (
                <button
                  type="button"
                  onClick={onFaqClick}
                  className="relative w-fit font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-600 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] whitespace-nowrap [font-style:var(--body-small-400-font-style)] cursor-pointer bg-transparent border-none p-0"
                >
                  {item.label}
                </button>
              ) : (
                <div className="relative w-fit font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-600 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] whitespace-nowrap [font-style:var(--body-small-400-font-style)]">
                  {item.label}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="inline-flex items-center justify-center gap-2 relative flex-[0_0_auto] shrink-0">
          <PhoneCall className="!relative !w-7 !h-7" />
          <div className="relative w-fit font-body-large-400 font-[number:var(--body-large-400-font-weight)] text-gray-900 text-[length:var(--body-large-400-font-size)] tracking-[var(--body-large-400-letter-spacing)] leading-[var(--body-large-400-line-height)] whitespace-nowrap [font-style:var(--body-large-400-font-style)]">
            0937418564
          </div>
        </div>
      </div>
    </div>
  );
};
