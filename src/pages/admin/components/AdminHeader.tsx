import { Search, Filter, Shield } from 'lucide-react';
import CyberButton from '@/components/CyberButton';

const AdminHeader = () => (
<div className="flex items-center justify-between mb-8">
    <div className="flex items-center space-x-3">
      <Shield className="h-8 w-8 text-red-400" />
      <h1 className="text-3xl font-bold text-white">관리자 대시보드</h1>
    </div>
    <div className="flex items-center space-x-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="검색..."
          className="pl-10 pr-4 py-2 bg-black/20 border border-cyber-blue/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyber-blue"
        />
      </div>
      <CyberButton size="sm">
        <Filter className="h-4 w-4" />
        필터
      </CyberButton>
    </div>
  </div>
);

export default AdminHeader;
