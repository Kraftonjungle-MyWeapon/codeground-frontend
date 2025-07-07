import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import AuthHeader from "@/components/auth/AuthHeader";
import IconInput from "@/components/auth/IconInput";
import { authFetch } from "../../../utils/api";
import { useUser } from "../../../context/UserContext";
import { setCookie } from "@/lib/utils";

const apiUrl = import.meta.env.VITE_API_URL;

const SignupForm = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsSigningUp(true);

    try {
      const response = await authFetch(`${apiUrl}/api/v1/auth/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          nickname: formData.nickname,
          use_lang: "python3",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const accessToken = data.access_token;
        setCookie("access_token", accessToken, 7);

        const userResponse = await authFetch(`${apiUrl}/api/v1/user/me`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        } else {
          console.error("Failed to fetch user data after signup.");
        }

        alert(
          "회원가입이 성공적으로 완료되었습니다. 추가 정보를 입력해주세요.",
        );
        navigate("/setup-profile");
      } else {
        const errorData = await response.json();
        alert(
          "회원가입 실패: " +
            (errorData.detail ? errorData.detail[0].msg : "알 수 없는 오류"),
        );
      }
    } catch (error) {
      console.error("Network error during signup:", error);
      alert("네트워크 오류가 발생했습니다.");
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <CyberCard glowing className="p-8">
      <AuthHeader title="회원가입" description="새로운 계정을 만들어보세요" />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <IconInput
            id="username"
            name="username"
            type="text"
            label="본명"
            placeholder="실명을 입력하세요"
            value={formData.username}
            onChange={handleChange}
            icon={<User />}
            required
          />

          <IconInput
            id="nickname"
            name="nickname"
            type="text"
            label="닉네임"
            placeholder="서비스에서 사용할 닉네임을 입력하세요"
            value={formData.nickname}
            onChange={handleChange}
            icon={<User />}
            required
          />

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

          <IconInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="비밀번호 확인"
            placeholder="비밀번호를 다시 입력하세요"
            value={formData.confirmPassword}
            onChange={handleChange}
            icon={<Lock />}
            required
          />
        </div>

        <CyberButton
          type="submit"
          className="w-full text-lg py-3"
          disabled={isSigningUp}
        >
          <UserPlus className="h-5 w-5" />
          {isSigningUp ? "가입 중..." : "회원가입"}
        </CyberButton>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400">
          이미 계정이 있으신가요?{" "}
          <Link
            to="/login"
            className="text-cyber-blue hover:text-cyber-blue/80 font-medium"
          >
            로그인
          </Link>
        </p>
      </div>
    </CyberCard>
  );
};

export default SignupForm;