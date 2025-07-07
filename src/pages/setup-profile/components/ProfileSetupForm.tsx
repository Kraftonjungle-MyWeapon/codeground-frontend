import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, SkipForward, Code, Trophy } from "lucide-react";
import AuthHeader from "@/components/auth/AuthHeader";
import ProfileImageUpload from "./ProfileImageUpload";
import SelectField from "./SelectField";
import { programmingLanguages, solvedacTiers } from "../constants";

const ProfileSetupForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    programmingLanguage: "",
    solvedacTier: "",
    profileImage: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      navigate("/home");
    }, 1500);
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
              setFormData((prev) => ({ ...prev, profileImage: file }))
            }
          />
        </div>

        <SelectField
          label="주 사용 프로그래밍 언어"
          placeholder="언어를 선택하세요"
          options={programmingLanguages}
          icon={<Code className="h-4 w-4 text-gray-400" />}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, programmingLanguage: value }))
          }
        />

        <SelectField
          label="solved.ac 티어"
          placeholder="티어를 선택하세요"
          options={solvedacTiers}
          icon={<Trophy className="h-4 w-4 text-gray-400" />}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, solvedacTier: value }))
          }
        />

        <div className="space-y-3 pt-4">
          <CyberButton
            type="submit"
            className="w-full text-lg py-3"
            disabled={isSubmitting}
          >
            <ArrowRight className="h-5 w-5" />
            {isSubmitting ? "저장 중..." : "설정 완료"}
          </CyberButton>

          <button
            type="button"
            onClick={handleSkip}
            className="w-full py-3 px-4 text-gray-400 hover:text-white transition-colors flex items-center justify-center space-x-2"
          >
            <SkipForward className="h-4 w-4" />
            <span>나중에 설정하기</span>
          </button>
        </div>
      </form>
    </CyberCard>
  );
};

export default ProfileSetupForm;