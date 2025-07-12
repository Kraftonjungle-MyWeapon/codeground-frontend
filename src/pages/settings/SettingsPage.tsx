import { useState } from "react";
import Header from "@/components/Header";
import CyberButton from "@/components/CyberButton";
import { Settings } from "lucide-react";
import AccountSettingsCard from "./components/AccountSettingsCard";
import ThemeSettingsCard from "./components/ThemeSettingsCard";
import CreateProblemCard from "./components/CreateProblemCard"; // 추가
import PasswordChangeModal from "./components/PasswordChangeModal";
import DeleteAccountModal from "./components/DeleteAccountModal";

const SettingsPage = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  

  return (
    <div>
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
            <AccountSettingsCard
              onChangePassword={() => setShowPasswordModal(true)}
              onDeleteAccount={() => setShowDeleteModal(true)}
            />
            
            <CreateProblemCard />
          </div>

          
        </div>
      </main>

      {showPasswordModal && (
        <PasswordChangeModal onClose={() => setShowPasswordModal(false)} />
      )}

      {showDeleteModal && (
        <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />
      )}
    </div>
  );
};

export default SettingsPage;