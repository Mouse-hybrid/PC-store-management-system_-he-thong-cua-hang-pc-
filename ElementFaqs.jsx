import { FrequentlyAskedQuestionsSection } from "./FrequentlyAskedQuestionsSection";
import { MainNavigationSection } from "./MainNavigationSection";
import { FaqBreadcrumbNavigationSection } from "./FaqBreadcrumbNavigationSection";

export const ElementFaqs = ({ onGoHome, cartCount = 0, onGoShoppingCard }) => {
  return (
    <div className="inline-flex flex-col h-[1436px] items-start relative bg-gray-00 overflow-hidden w-full max-w-[1920px] mx-auto">
      <MainNavigationSection
        cartCount={cartCount}
        onFaqClick={() => {}}
        onCartClick={onGoShoppingCard}
      />
      <FaqBreadcrumbNavigationSection onGoHome={onGoHome} />
      <FrequentlyAskedQuestionsSection />
      <div className="relative w-[1920px] h-[472px]" />
    </div>
  );
};

