import {useState} from "react";
import {useNavigate} from "react-router-dom";
import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import {ArrowRight, SkipForward, Code, Trophy} from "lucide-react";
import AuthHeader from "@/components/auth/AuthHeader";
import ProfileImageUpload from "./ProfileImageUpload";
import SelectField from "./SelectField";
import {programmingLanguages, solvedacTiers} from "../constants";
import {useUser} from "@/hooks/use-user";
import {authFetch} from "@/utils/api";
import type {User} from "@/context/UserContext";

const apiUrl = import.meta.env.VITE_API_URL;

const ProfileSetupForm = () => {
    const navigate = useNavigate();
    const {user, refreshUser} = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        programmingLanguage: user?.favoriteLanguage || "",
        solvedacTier: user?.totalScore ? solvedacTiers.find(tier => tier.mmr === user.totalScore)?.value || "Unrated" : "Unrated",
        profileImage: null as File | null,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const selectedTier = solvedacTiers.find(
            (tier) => tier.value === formData.solvedacTier
        );

        try {
            const formDataToSend = new FormData();

            if (formData.programmingLanguage)
                formDataToSend.append("use_lang", formData.programmingLanguage);

            if (selectedTier)
                formDataToSend.append("user_mmr", selectedTier.mmr.toString());

            if (formData.profileImage)
                formDataToSend.append("profile_image", formData.profileImage);

            const response = await authFetch(`${apiUrl}/api/v1/user/me`, {
                method: "PUT",
                body: formDataToSend, // ✅ JSON 아님! FormData 그대로 전달
            });

            if (response.ok) {
                const updatedUserData = await response.json();

                if (updatedUserData && typeof updatedUserData === "object") {
                    // ✅ 최신 유저 정보를 다시 불러오기
                    await refreshUser();
                    navigate("/home");
                } else {
                    console.error(
                        "Failed to parse updated user data or data is not an object:",
                        updatedUserData
                    );
                }
            } else {
                console.error("Failed to update profile:", response.statusText);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleSkip = () => {
        navigate("/home");
    };

    return (
        <CyberCard glowing className="p-8">
            <AuthHeader
                title="프로필 설정"
                description="추가 정보를 설정해보세요 (선택사항)"
            />

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4 text-center">
                    <ProfileImageUpload
                        file={formData.profileImage}
                        onChange={(file) =>
                            setFormData((prev) => ({...prev, profileImage: file}))
                        }
                    />
                </div>

                <SelectField
                    label="주 사용 프로그래밍 언어"
                    placeholder="언어를 선택하세요"
                    options={programmingLanguages}
                    icon={<Code className="h-4 w-4 text-gray-400"/>}
                    onValueChange={(value) =>
                        setFormData((prev) => ({...prev, programmingLanguage: value}))
                    }
                    value={formData.programmingLanguage}
                />

                <SelectField
                    label="solved.ac 티어"
                    placeholder="티어를 선택하세요"
                    options={solvedacTiers}
                    icon={<Trophy className="h-4 w-4 text-gray-400"/>}
                    onValueChange={(value) =>
                        setFormData((prev) => ({...prev, solvedacTier: value}))
                    }
                    value={formData.solvedacTier}
                />

                <div className="space-y-3 pt-4">
                    <CyberButton
                        type="submit"
                        className="w-full text-lg py-3"
                        disabled={isSubmitting}
                    >
                        <ArrowRight className="h-5 w-5"/>
                        {isSubmitting ? "저장 중..." : "설정 완료"}
                    </CyberButton>

                    <button
                        type="button"
                        onClick={handleSkip}
                        className="w-full py-3 px-4 text-gray-400 hover:text-white transition-colors flex items-center justify-center space-x-2"
                    >
                        <SkipForward className="h-4 w-4"/>
                        <span>나중에 설정하기</span>
                    </button>
                </div>
            </form>
        </CyberCard>
    );
};

export default ProfileSetupForm;