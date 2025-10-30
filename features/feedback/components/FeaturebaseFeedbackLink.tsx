import { MessageCircle } from "lucide-react";

export const FeaturebaseFeedbackLink = () => {
  return (
    <a
      href="https://vsevochart.featurebase.app/"
      className="flex items-center gap-2 rounded-full border border-primary-400/80 p-3 text-primary-400/80 backdrop-blur-xs transition-colors duration-200 hover:border-primary-400 hover:text-primary-400 hover:no-underline"
      aria-label="Provide feedback. Opens in new tab"
      target="_blank"
      rel="noopener noreferrer"
    >
      <MessageCircle size={16} />
    </a>
  );
};