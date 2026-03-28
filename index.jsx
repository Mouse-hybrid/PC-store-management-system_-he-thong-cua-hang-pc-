import { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { UserBreadcrumbSection } from "./UserBreadcrumbSection";
import { MainNavigationSection } from "./MainNavigationSection";
import { UserAuthFormSection } from "./UserAuthFormSection";
import { UserForgetPasswordFormSection } from "./UserForgetPasswordFormSection";
import { UserResetPasswordFormSection } from "./UserResetPasswordFormSection";
import { UserError404Section } from "./UserError404Section";
import { UserRegistrationFormSection } from "./UserRegistrationFormSection";
import { ElementShopPage } from "./ElementShopPage";

function ElementSignInAuth() {
  const [authView, setAuthView] = useState("sign-in");
  const [error404Source, setError404Source] = useState("login");
  const navigate = useNavigate();

  const breadcrumbView =
    authView === "reset-password"
      ? "reset-password"
      : authView === "forgot-password"
        ? "forgot-password"
        : authView === "sign-up"
          ? "sign-up"
          : "sign-in";

  const handleLoginSuccess = () => {
    const pending = sessionStorage.getItem("pendingCheckout") === "1";
    if (pending) sessionStorage.removeItem("pendingCheckout");
    navigate("/shop", { state: { openCheckout: pending } });
  };

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
          onLoginSuccess={handleLoginSuccess}
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
        <UserResetPasswordFormSection onComplete={() => setAuthView("sign-in")} />
      )}
    </div>
  );
}

export const ElementSignIn = () => {
  return (
    <Routes>
      <Route path="/shop/*" element={<ElementShopPage />} />
      <Route path="/login" element={<ElementSignInAuth />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
