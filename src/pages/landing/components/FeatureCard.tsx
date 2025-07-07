import { LucideIcon } from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: Feature) => (
  <div className="text-center space-y-3">
    <div className="w-12 h-12 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-lg mx-auto flex items-center justify-center">
      <Icon className="h-6 w-6 text-white" />
    </div>
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    <p className="text-sm text-gray-400">{description}</p>
  </div>
);

export default FeatureCard;