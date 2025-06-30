
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Trophy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, UserRound } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { eraseCookie } from '@/lib/utils';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  
  const navItems = [
    { path: '/home', label: '홈', icon: null },
    { path: '/ranking', label: '랭킹', icon: Trophy },
  ];

  const handleLogout = () => {
    eraseCookie('access_token'); // Clear token from cookies
    setUser(null); // Clear user from context
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 cyber-card border-b border-cyber-blue/20 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/home" className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/af0ff57a-93d9-40b0-a0ff-1f22a23418ce.png" 
              alt="Codeground Logo"
              className="h-16 w-auto select-none pointer-events-none"
              draggable="false"
            />
            <span className="text-3xl font-bold neon-text">CODEGROUND</span>
          </Link>
          
          <nav className="flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-cyber-blue/10 ${
                    isActive ? 'text-cyber-blue bg-cyber-blue/10 glow-border' : 'text-gray-300 hover:text-cyber-blue'
                  }`}
                >
                  {Icon && <Icon className="h-5 w-5" />}
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-cyber-blue/10 text-gray-300 hover:text-cyber-blue">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{user ? user.username : '프로필'}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-card/95 backdrop-blur-sm border border-cyber-blue/20">
                <DropdownMenuItem 
                  onClick={() => navigate('/profile')}
                  className="cursor-pointer hover:bg-cyber-blue/10 text-gray-300 hover:text-white"
                >
                  <UserRound className="mr-2 h-4 w-4" />
                  프로필 가기
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/settings')}
                  className="cursor-pointer hover:bg-cyber-blue/10 text-gray-300 hover:text-white"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  설정
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="cursor-pointer hover:bg-red-500/10 text-red-400 hover:text-red-300"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
