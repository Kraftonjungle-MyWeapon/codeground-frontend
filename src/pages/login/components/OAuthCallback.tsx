import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import { authFetch } from "../../../utils/api";

const OAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useUser();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const params = new URLSearchParams(location.search);
      const isNewUser = params.get("is_new_user") === "true";

      try {
        const userResponse = await authFetch(`/api/v1/user/me`);

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser({
            ...userData,
            totalScore: userData.user_mmr,
            name: userData.nickname || userData.username,
          });

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
    <div className="min-h-screen flex items-center justify-center text-white text-lg">
      GitHub 로그인 처리 중...
    </div>
  );
};

export default OAuthCallback;
