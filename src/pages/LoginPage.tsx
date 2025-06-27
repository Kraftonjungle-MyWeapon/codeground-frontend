import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CyberCard from '@/components/CyberCard';
import CyberButton from '@/components/CyberButton';
import { LogIn, Mail, Lock } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    // 시뮬레이션: 2초 후 로그인 완료
    setTimeout(() => {
      navigate('/home');
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
                  <span className="text-2xl font-bold text-cyber-blue">CODEGROUND</span>
                </div>
              </Link>
              <h1 className="text-2xl font-bold text-white mb-2">로그인</h1>
              <p className="text-gray-400">계정에 로그인하세요</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    이메일
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-cyber-blue focus:outline-none focus:ring-2 focus:ring-cyber-blue/20 text-white placeholder-gray-400"
                      placeholder="이메일을 입력하세요"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    비밀번호
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-cyber-blue focus:outline-none focus:ring-2 focus:ring-cyber-blue/20 text-white placeholder-gray-400"
                      placeholder="비밀번호를 입력하세요"
                      required
                    />
                  </div>
                </div>
              </div>

              <CyberButton
                type="submit"
                className="w-full text-lg py-3"
                disabled={isLoggingIn}
              >
                <LogIn className="h-5 w-5" />
                {isLoggingIn ? '로그인 중...' : '로그인'}
              </CyberButton>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                계정이 없으신가요?{' '}
                <Link to="/signup" className="text-cyber-blue hover:text-cyber-blue/80 font-medium">
                  회원가입
                </Link>
              </p>
            </div>
          </CyberCard>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
