import { AlertTriangle, FileText, Trophy, Users } from 'lucide-react';

const tabs = [
  { id: 'reports', label: '신고 관리', icon: AlertTriangle },
  { id: 'problems', label: '문제 관리', icon: FileText },
  { id: 'achievements', label: '업적 관리', icon: Trophy },
  { id: 'users', label: '사용자 관리', icon: Users }
];

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar = ({ activeTab, setActiveTab }: Props) => (
  <nav className="space-y-2">
    {tabs.map(tab => {
      const Icon = tab.icon;
      return (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            activeTab === tab.id
              ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30'
              : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
          }`}
        >
          <Icon className="h-5 w-5" />
          <span className="font-medium">{tab.label}</span>
        </button>
      );
    })}
  </nav>
);

export default AdminSidebar;
