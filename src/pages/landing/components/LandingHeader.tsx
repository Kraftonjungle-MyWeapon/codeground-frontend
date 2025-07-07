import CyberButton from "@/components/CyberButton";
import Logo from "@/components/Logo";
import { useNavigate } from "react-router-dom";

const LandingHeader = () => {
  const navigate = useNavigate();

  const handleLogin = () => navigate("/login");
  const handleSignup = () => navigate("/signup");

  return (
    <header className="relative z-10 p-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Logo className="h-20 w-auto" />
          <span className="text-4xl font-bold neon-text">CODEGROUND</span>
        </div>
        <div className="flex items-center gap-4">
          <CyberButton variant="secondary" size="sm" onClick={handleLogin}>
            로그인
          </CyberButton>
          <CyberButton size="sm" onClick={handleSignup}>
            회원가입
          </CyberButton>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;