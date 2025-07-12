import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import { authFetch } from "../../../utils/api";

const apiUrl = import.meta.env.VITE_API_URL;

const OAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useUser();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get("code");

      if (!code) {
        console.error("Authorization code not found.");
        navigate("/login?error=oauth_failed&message=인증 코드를 찾을 수 없습니다.");
        return;
      }

      try {
        // 1. 백엔드로 인증 코드 전송
        const tokenResponse = await fetch(
          `${apiUrl}/api/v1/auth/github/callback?code=${code}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json();
          const message =
            errorData?.detail ||
            "GitHub 로그인에 실패했습니다. 일반 로그인 또는 다른 GitHub 계정을 사용해주세요.";
          navigate(`/login?error=oauth_failed&message=${message}`);
          return;
        }

        // 2. 사용자 정보 요청 (쿠키가 설정된 상태)
        const userResponse = await authFetch(`${apiUrl}/api/v1/user/me`);

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser({
            ...userData,
            totalScore: userData.user_mmr,
            name: userData.nickname || userData.username,
          });

          const tokenData = await tokenResponse.json();
          const isNewUser = tokenData.is_new_user;

          if (isNewUser) {
            navigate("/setup-profile");
          } else {
            navigate("/home");
          }
        } else {
          throw new Error("Failed to fetch user profile.");
        }
      } catch (error) {
        console.error("OAuth 처리 중 예외:", error);
        navigate(
          `/login?error=network_error&message=OAuth 처리 중 오류가 발생했습니다.`
        );
      }
    };

    handleOAuthCallback();
  }, [location, navigate, setUser]);

  return (
    <div className="min-h-screen">
      GitHub 로그인 처리 중...
    </div>
  );
};

export default OAuthCallback;
