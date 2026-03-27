import { CaretRight } from "./CaretRight";
import { House } from "./House";

const signInCrumbs = [
  { label: "Home", isActive: false, icon: true },
  { label: "User Account", isActive: false },
  { label: "Sign In", isActive: true },
];

const signUpCrumbs = [
  { label: "Home", isActive: false, icon: true },
  { label: "User Account", isActive: false },
  { label: "Sign Up", isActive: true },
];

const forgotPasswordCrumbs = [
  { label: "Home", isActive: false, icon: true },
  { label: "User Account", isActive: false },
  { label: "Sign In", isActive: false },
  { label: "Forget Password", isActive: true },
];

const resetPasswordCrumbs = [
  { label: "Home", isActive: false, icon: true },
  { label: "User Account", isActive: false },
  { label: "Sign In", isActive: false },
  { label: "Forget Password", isActive: false },
  { label: "Reset Password", isActive: true },
];

export const UserBreadcrumbSection = ({ view = "sign-in" }) => {
  const breadcrumbs =
    view === "reset-password"
      ? resetPasswordCrumbs
      : view === "forgot-password"
        ? forgotPasswordCrumbs
        : view === "sign-up"
          ? signUpCrumbs
          : signInCrumbs;

  return (
    <nav
      aria-label="breadcrumb"
      className="relative w-[1920px] h-[72px] bg-gray-50"
    >
      <ol className="inline-flex items-center justify-center gap-2 relative top-[calc(50.00%_-_10px)] left-[300px]">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.label} className="inline-flex items-center gap-2">
            {index > 0 && <CaretRight className="!relative !w-3 !h-3" />}
            {crumb.icon && <House className="!relative !w-5 !h-5" />}
            <span
              className={
                crumb.isActive
                  ? "relative w-fit mt-[-1.00px] font-body-small-500 font-[number:var(--body-small-500-font-weight)] text-secondary-500 text-[length:var(--body-small-500-font-size)] tracking-[var(--body-small-500-letter-spacing)] leading-[var(--body-small-500-line-height)] whitespace-nowrap [font-style:var(--body-small-500-font-style)]"
                  : "relative w-fit mt-[-1.00px] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-600 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] whitespace-nowrap [font-style:var(--body-small-400-font-style)]"
              }
              aria-current={crumb.isActive ? "page" : undefined}
            >
              {crumb.label}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
};
