import { Link } from "react-router-dom";
import Logo from "../Logo";

interface AuthHeaderProps {
  title: string;
  description: string;
}

const AuthHeader = ({ title, description }: AuthHeaderProps) => (
  <div className="text-center mb-8">
    <Link to="/" className="inline-block mb-6">
      <div className="flex flex-col items-center space-y-2">
        <Logo />
        <span className="text-2xl font-bold text-cyber-blue">CODEGROUND</span>
      </div>
    </Link>
    <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
    <p className="text-gray-400">{description}</p>
  </div>
);

export default AuthHeader;