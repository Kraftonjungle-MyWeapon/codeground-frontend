import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import { LogIn, Mail, Lock } from "lucide-react";
import AuthHeader from "@/components/auth/AuthHeader";
import IconInput from "@/components/auth/IconInput";
import { useUser } from "../../../context/UserContext";
import { authFetch } from "../../../utils/api";
import { setCookie } from "@/lib/utils";

const apiUrl = import.meta.env.VITE_API_URL;

const LoginForm = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    const params = new URLSearchParams();
    params.append("username", formData.email);
    params.append("password", formData.password);

    try {
      const response = await authFetch(`${apiUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (response.ok) {
        const data = await response.json();
        const accessToken = data.access_token;
        setCookie("access_token", accessToken, 7);
        
        const userResponse = await authFetch(`${apiUrl}/api/v1/user/me`, {
          method: "GET",
          headers: {
      "Content-Type": "application/json",
          },
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser({
            ...userData,
            totalScore: userData.user_mmr,
            name: userData.nickname || userData.username,
          });
          alert("로그인이 완료되었습니다!");
          navigate("/home");
        } else {
          console.error("Failed to fetch user data");
          alert("사용자 정보를 가져오는데 실패했습니다.");
        }
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData);
        alert("로그인 실패: " + (errorData.detail || "알 수 없는 오류"));
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGithubLogin = async () => {
    setIsLoggingIn(true);
    try {
      const response = await authFetch(`${apiUrl}/api/v1/auth/github/login`);

      if (response.ok) {
        const data = await response.json();
        if (data.redirect_url) {
          window.location.href = data.redirect_url;
        } else {
          console.error("GitHub login redirect URL not found in response");
          alert("GitHub 로그인에 실패했습니다.");
        }
      } else {
        const errorData = await response.json();
        console.error("GitHub login failed:", errorData);
        alert("GitHub 로그인 실패: " + (errorData.detail || "알 수 없는 오류"));
      }
    } catch (error) {
      console.error("Network error during GitHub login:", error);
      alert("네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <CyberCard glowing className="p-8">
      <AuthHeader title="로그인" description="계정에 로그인하세요" />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <IconInput
              id="email"
              name="email"
              type="email"
              label="이메일"
              placeholder="이메일을 입력하세요"
              value={formData.email}
              onChange={handleChange}
              icon={<Mail />}
              required
          />
          <IconInput
            id="password"
            name="password"
            type="password"
            label="비밀번호"
            placeholder="비밀번호를 입력하세요"
            value={formData.password}
            onChange={handleChange}
            icon={<Lock />}
            required
          />
        </div>

        <CyberButton
          type="submit"
          className="w-full text-lg py-3"
          disabled={isLoggingIn}
        >
          <LogIn className="h-5 w-5" />
          {isLoggingIn ? "로그인 중..." : "로그인"}
        </CyberButton>
      </form>

      {/* GitHub 로그인 버튼 추가  */}
      <div className="mt-4 text-center">
        <CyberButton
          type="button"
          className="w-full text-lg py-3 flex items-center justify-center gap-2"
          onClick={handleGithubLogin}
          disabled={isLoggingIn}
        >
          <img
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub"
            className="h-5 w-5"
          />
          {isLoggingIn ? "연결 중..." : "GitHub 계정으로 로그인"}
        </CyberButton>
      </div>
      <div className="mt-6 text-center">
        <p className="text-gray-400">
          계정이 없으신가요?{" "}
          <Link
            to="/signup"
            className="text-cyber-blue hover:text-cyber-blue/80 font-medium"
          >
            회원가입
          </Link>
        </p>
      </div>
    </CyberCard>
  );
};

export default LoginForm;