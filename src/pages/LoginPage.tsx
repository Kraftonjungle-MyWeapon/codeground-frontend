import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import { LogIn, Mail, Lock } from "lucide-react";
import { useUser } from "../context/UserContext";
import { authFetch } from "../utils/api";
import { setCookie } from "@/lib/utils";

const LoginPage = () => {
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
      const response = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (response.ok) {
        const data = await response.json();
        const accessToken = data.access_token;
        console.log("access_token:", accessToken);
        setCookie("access_token", accessToken, 7); // Store token in cookie for persistence

        // Fetch user data after successful login using authFetch
        const userResponse = await authFetch(
          "http://localhost:8000/api/v1/user/me",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser({
            ...userData,
            totalScore: userData.user_mmr, // user_mmr를 totalScore로 매핑
            name: userData.nickname || userData.username, // nickname 또는 username을 name으로 매핑
          }); // Store user data in context
          alert("로그인이 완료되었습니다!");
          navigate("/home");
        } else {
          console.error("Failed to fetch user data");
          alert("사용자 정보를 가져오는데 실패했습니다.");
        }
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData);
        alert("로그인 실패: " + (errorData.detail || "알 수 없는 오류")); // Display error to user
      }
    } catch (error) {
      console.error("Network error:", error);
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
    <div className="min-h-screen cyber-grid flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <CyberCard glowing className="p-8">
            <div className="text-center mb-8">
              <Link to="/" className="inline-block mb-6">
                <div className="flex flex-col items-center space-y-2">
                  <img
                    src="/lovable-uploads/af0ff57a-93d9-40b0-a0ff-1f22a23418ce.png"
                    alt="Codeground Logo"
                    className="h-16 w-auto select-none pointer-events-none"
                    draggable="false"
                  />
                  <span className="text-2xl font-bold text-cyber-blue">
                    CODEGROUND
                  </span>
                </div>
              </Link>
              <h1 className="text-2xl font-bold text-white mb-2">로그인</h1>
              <p className="text-gray-400">계정에 로그인하세요</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    이메일
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-cyber-blue focus:outline-none focus:ring-2 focus:ring-cyber-blue/20 text-white placeholder-gray-400"
                      placeholder="이메일을 입력하세요"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    비밀번호
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-cyber-blue focus:outline-none focus:ring-2 focus:ring-cyber-blue/20 text-white placeholder-gray-400"
                      placeholder="비밀번호를 입력하세요"
                      required
                    />
                  </div>
                </div>
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
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
