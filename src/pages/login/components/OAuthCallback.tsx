import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";

const apiUrl = import.meta.env.VITE_API_URL;

const OAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useUser();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/v1/user/me`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const userData = await res.json();
          setUser({
            ...userData,
            totalScore: userData.user_mmr,
            name: userData.nickname || userData.username,
          });

          const params = new URLSearchParams(location.search);
          const isNewUser = params.get("new_user") === "true";

          if (isNewUser) {
            navigate("/setup-profile");
          } else {
            navigate("/home");
          }
        } else {
          const errorData = await res.json();
          const message =
            errorData?.detail ||
            "GitHub 로그인에 실패했습니다. 일반 로그인 또는 다른 GitHub 계정을 사용해주세요.";

          // 메시지 쿼리스트링으로 /login 페이지에 전달
          const params = new URLSearchParams();
          params.set("error", "oauth_failed");
          params.set("message", message);

          navigate(`/login?${params.toString()}`);
        }
      } catch (error) {
        console.error("OAuth 처리 중 예외:", error);
        const params = new URLSearchParams();
        params.set("error", "network_error");
        params.set("message", "OAuth 처리 중 오류가 발생했습니다. 다시 시도해주세요.");

        navigate(`/login?${params.toString()}`);
      }
    };

    fetchUser();
  }, [location, navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white text-lg">
      로그인 처리 중...
    </div>
  );
};

export default OAuthCallback;
