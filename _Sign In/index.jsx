import { useState } from "react";
import { UserBreadcrumbSection } from "./UserBreadcrumbSection";
import { MainNavigationSection } from "./MainNavigationSection";
import { UserAuthFormSection } from "./UserAuthFormSection";
import { UserForgetPasswordFormSection } from "./UserForgetPasswordFormSection";
import { UserResetPasswordFormSection } from "./UserResetPasswordFormSection";
import { UserError404Section } from "./UserError404Section";
import { UserRegistrationFormSection } from "./UserRegistrationFormSection";
import { ElementShopPage } from "./ElementShopPage";

export const ElementSignIn = () => {
  const [authView, setAuthView] = useState("sign-in");
  /** "login" | "forgot" — where 404 "Quay lại" returns to */
  const [error404Source, setError404Source] = useState("login");

  const breadcrumbView =
    authView === "reset-password"
      ? "reset-password"
      : authView === "forgot-password"
        ? "forgot-password"
        : authView === "sign-up"
          ? "sign-up"
          : "sign-in";

  if (authView === "shop") {
    return <ElementShopPage />;
  }

  if (authView === "error-404") {
    return (
      <UserError404Section
        onGoHome={() => setAuthView("sign-in")}
        onGoBack={() =>
          setAuthView(error404Source === "forgot" ? "forgot-password" : "sign-in")
        }
      />
    );
  }

  return (
    <div className="inline-flex flex-col min-h-[1436px] items-start relative bg-white overflow-hidden w-full max-w-[1920px]">
      <MainNavigationSection />
      <UserBreadcrumbSection view={breadcrumbView} />
      {authView === "sign-in" && (
        <UserAuthFormSection
          onForgotPassword={() => setAuthView("forgot-password")}
          onGoToRegister={() => setAuthView("sign-up")}
          onLoginSuccess={() => setAuthView("shop")}
          onLoginMissingEmail={() => {
            setError404Source("login");
            setAuthView("error-404");
          }}
        />
      )}
      {authView === "sign-up" && (
        <UserRegistrationFormSection onGoToLogin={() => setAuthView("sign-in")} />
      )}
      {authView === "forgot-password" && (
        <UserForgetPasswordFormSection
          onBackToSignIn={() => setAuthView("sign-in")}
          onSentCode={() => setAuthView("reset-password")}
          onWrongCode={() => {
            setError404Source("forgot");
            setAuthView("error-404");
          }}
          onGoToSignUp={() => setAuthView("sign-up")}
        />
      )}
      {authView === "reset-password" && (
        <UserResetPasswordFormSection
          onComplete={() => setAuthView("sign-in")}
        />
      )}
    </div>
  );
};
