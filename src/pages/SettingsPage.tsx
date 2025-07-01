import { useState } from "react";
import Header from "@/components/Header";
import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import { Settings, Shield, Palette } from "lucide-react";

const SettingsPage = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("cyber");

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (newPassword.length < 6) {
      alert("비밀번호는 6자 이상이어야 합니다.");
      return;
    }
    // 비밀번호 변경 로직 구현
    alert("비밀번호가 변경되었습니다.");
    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleDeleteAccount = () => {
    // 계정 삭제 요청 로직 구현
    alert("계정 삭제 요청이 전송되었습니다.");
    setShowDeleteModal(false);
  };

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    // 테마 적용 로직 구현
    alert(`${theme} 테마가 적용되었습니다.`);
  };

  return (
    <div className="min-h-screen cyber-grid">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <Settings className="mr-3 h-8 w-8 text-cyber-blue" />
              설정
            </h1>
            <p className="text-gray-400">계정 및 앱 설정을 관리하세요</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 계정 설정 */}
            <CyberCard>
              <h2 className="text-xl font-bold text-cyber-blue mb-4 flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                계정 설정
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-white">비밀번호 변경</h3>
                    <p className="text-sm text-gray-400">
                      계정 보안을 위해 비밀번호를 변경하세요
                    </p>
                  </div>
                  <CyberButton
                    size="sm"
                    variant="secondary"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    변경
                  </CyberButton>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-white">계정 삭제</h3>
                    <p className="text-sm text-gray-400">
                      계정을 영구적으로 삭제합니다
                    </p>
                  </div>
                  <CyberButton
                    size="sm"
                    className="bg-red-500 hover:bg-red-600"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    삭제
                  </CyberButton>
                </div>
              </div>
            </CyberCard>

            {/* 테마 설정 */}
            <CyberCard>
              <h2 className="text-xl font-bold text-cyber-blue mb-4 flex items-center">
                <Palette className="mr-2 h-5 w-5" />
                테마 설정
              </h2>
              <div className="space-y-4">
                <div className="p-3 bg-black/20 rounded-lg">
                  <h3 className="font-semibold text-white mb-3">테마 선택</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleThemeChange("cyber")}
                      className={`aspect-square bg-gradient-to-br from-cyber-blue to-cyber-purple rounded-lg border-2 ${
                        selectedTheme === "cyber"
                          ? "border-cyber-blue"
                          : "border-transparent"
                      } flex items-center justify-center transition-all`}
                    >
                      <span className="text-xs text-white font-medium">
                        사이버
                      </span>
                    </button>
                    <button
                      onClick={() => handleThemeChange("dark")}
                      className={`aspect-square bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg border-2 ${
                        selectedTheme === "dark"
                          ? "border-gray-400"
                          : "border-transparent"
                      } flex items-center justify-center transition-all`}
                    >
                      <span className="text-xs text-white font-medium">
                        어둠
                      </span>
                    </button>
                    <button
                      onClick={() => handleThemeChange("classic")}
                      className={`aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg border-2 ${
                        selectedTheme === "classic"
                          ? "border-blue-400"
                          : "border-transparent"
                      } flex items-center justify-center transition-all`}
                    >
                      <span className="text-xs text-white font-medium">
                        클래식
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </CyberCard>
          </div>

          <div className="mt-8 flex justify-center">
            <CyberButton>설정 저장</CyberButton>
          </div>
        </div>
      </main>

      {/* 비밀번호 변경 모달 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center">
          <CyberCard className="w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-white mb-4">비밀번호 변경</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  현재 비밀번호
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3 bg-black/30 border border-gray-600 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  새 비밀번호
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 bg-black/30 border border-gray-600 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 bg-black/30 border border-gray-600 rounded text-white"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <CyberButton
                variant="secondary"
                onClick={() => setShowPasswordModal(false)}
              >
                취소
              </CyberButton>
              <CyberButton onClick={handlePasswordChange}>변경</CyberButton>
            </div>
          </CyberCard>
        </div>
      )}

      {/* 계정 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center">
          <CyberCard className="w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-red-400 mb-4">계정 삭제</h3>
            <p className="text-gray-300 mb-6">
              정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex justify-end space-x-3">
              <CyberButton
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                취소
              </CyberButton>
              <CyberButton
                className="bg-red-500 hover:bg-red-600"
                onClick={handleDeleteAccount}
              >
                확인
              </CyberButton>
            </div>
          </CyberCard>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
