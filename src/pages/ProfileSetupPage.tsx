import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  User,
  Code,
  Trophy,
  ArrowRight,
  SkipForward,
} from "lucide-react";

const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    programmingLanguage: "",
    solvedacTier: "",
    profileImage: null as File | null,
  });

  const programmingLanguages = [
    "Python",
    "Java",
    "JavaScript",
    "C++",
    "C",
    "C#",
    "Go",
    "Rust",
    "Kotlin",
    "Swift",
    "TypeScript",
    "Ruby",
  ];

  const solvedacTiers = [
    "Unrated",
    "Bronze V",
    "Bronze IV",
    "Bronze III",
    "Bronze II",
    "Bronze I",
    "Silver V",
    "Silver IV",
    "Silver III",
    "Silver II",
    "Silver I",
    "Gold V",
    "Gold IV",
    "Gold III",
    "Gold II",
    "Gold I",
    "Platinum V",
    "Platinum IV",
    "Platinum III",
    "Platinum II",
    "Platinum I",
    "Diamond V",
    "Diamond IV",
    "Diamond III",
    "Diamond II",
    "Diamond I",
    "Ruby V",
    "Ruby IV",
    "Ruby III",
    "Ruby II",
    "Ruby I",
    "Master",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 시뮬레이션: 추가 정보 저장 후 홈으로 이동
    setTimeout(() => {
      navigate("/home");
    }, 1500);
  };

  const handleSkip = () => {
    navigate("/home");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profileImage: file,
      }));
    }
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
              <h1 className="text-2xl font-bold text-white mb-2">
                프로필 설정
              </h1>
              <p className="text-gray-400">
                추가 정보를 설정해보세요 (선택사항)
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 프로필 사진 */}
              <div className="space-y-4 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full mx-auto flex items-center justify-center">
                  <User className="h-10 w-10 text-white" />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="profileImage"
                    className="block text-sm font-medium text-gray-300"
                  >
                    프로필 이미지
                  </label>
                  <div className="flex items-center justify-center">
                    <label htmlFor="profileImage" className="cursor-pointer">
                      <div className="flex items-center space-x-2 px-4 py-2 bg-black/30 border border-gray-600 rounded-lg hover:border-cyber-blue/40 transition-colors">
                        <Upload className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-300">
                          이미지 업로드
                        </span>
                      </div>
                    </label>
                    <input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                  {formData.profileImage && (
                    <p className="text-xs text-green-400">
                      선택된 파일: {formData.profileImage.name}
                    </p>
                  )}
                </div>
              </div>

              {/* 주 사용 언어 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  주 사용 프로그래밍 언어
                </label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      programmingLanguage: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full bg-black/20 border-gray-600 text-white">
                    <div className="flex items-center space-x-2">
                      <Code className="h-4 w-4 text-gray-400" />
                      <SelectValue placeholder="언어를 선택하세요" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-cyber-darker border-gray-600">
                    {programmingLanguages.map((lang) => (
                      <SelectItem
                        key={lang}
                        value={lang}
                        className="text-white hover:bg-cyber-blue/20"
                      >
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* solved.ac 티어 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  solved.ac 티어
                </label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, solvedacTier: value }))
                  }
                >
                  <SelectTrigger className="w-full bg-black/20 border-gray-600 text-white">
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4 text-gray-400" />
                      <SelectValue placeholder="티어를 선택하세요" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-cyber-darker border-gray-600">
                    {solvedacTiers.map((tier) => (
                      <SelectItem
                        key={tier}
                        value={tier}
                        className="text-white hover:bg-cyber-blue/20"
                      >
                        {tier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 버튼들 */}
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
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
