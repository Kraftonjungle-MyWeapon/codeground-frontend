import React, {useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useUser} from "../../../context/UserContext";
import {authFetch} from "../../../utils/api";
import { getAbsoluteUrl,setCookie } from "@/lib/utils";
// Define your API base URL here
const apiUrl = import.meta.env.VITE_API_URL;


const OAuthCallback = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {setUser} = useUser();

    useEffect(() => {
        const handleOAuthCallback = async () => {
            const params = new URLSearchParams(location.search);
            const isNewUser = params.get("is_new_user") === "true";
            const newAccessToken = params.get("new_access_token");
                
            // 이거는 `code-ground.com`을 세팅하는 쿠키. `.code-ground-com`은 백엔드에서 세팅했음.
            setCookie("access_token", newAccessToken, 7); 

            try {
                // const userResponse = await authFetch(`/api/v1/user/me`);
                const userResponse = await authFetch(`${apiUrl}/api/v1/user/me`);

                const contentType = userResponse.headers.get("content-type") || "";
                if (!userResponse.ok || !contentType.includes("application/json")) {
                    throw new Error("서버 응답이 JSON이 아닙니다.");
                }

                const userData = await userResponse.json();

                setUser({
                    ...userData,
                    profileImageUrl: getAbsoluteUrl(userData.profile_image_url),
                    totalScore: userData.user_mmr,
                    name: userData.nickname || userData.username,
                });

                if (isNewUser) {
                    navigate("/setup-profile");
                } else {
                    navigate("/home");
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
