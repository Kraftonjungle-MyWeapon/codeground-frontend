import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CyberCard from '@/components/CyberCard';
import CyberButton from '@/components/CyberButton';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { authFetch } from '../utils/api';
import { useUser } from '../context/UserContext';
import { setCookie } from '@/lib/utils';

const SignupPage = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    setIsSigningUp(true);
    
    try {
      console.log('Attempting signup with data:', JSON.stringify({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        nickname: formData.nickname,
        use_lang: 'python3',
      }));
      const response = await authFetch('http://localhost:8000/api/v1/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          nickname: formData.nickname,
          use_lang: 'python3', // Default to python3 as requested
        }),
      });

      console.log('Signup API response status:', response.status);
      console.log('Signup API response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Signup API response data:', data);
        const accessToken = data.access_token;
        console.log('Extracted access_token:', accessToken);
        setCookie('access_token', accessToken, 7); // Store token in cookie for persistence
        console.log('access_token stored in cookie.');

        // Fetch user data and set context immediately after signup
        const userResponse = await authFetch('http://localhost:8000/api/v1/user/me');
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData); // Set user data in context
          console.log('User data fetched and set in context:', userData);
        } else {
          console.error('Failed to fetch user data after signup.');
          // Even if user data fetch fails, we still navigate, but log the error.
        }

        alert('회원가입이 성공적으로 완료되었습니다. 추가 정보를 입력해주세요.');
        navigate('/setup-profile');
        console.log('Navigated to /setup-profile');
      } else {
        const errorData = await response.json();
        console.error('Signup failed:', errorData);
        alert('회원가입 실패: ' + (errorData.detail ? errorData.detail[0].msg : '알 수 없는 오류'));
      }
    } catch (error) {
      console.error('Network error during signup:', error);
      alert('네트워크 오류가 발생했습니다.');
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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
              <h1 className="text-2xl font-bold text-white mb-2">회원가입</h1>
              <p className="text-gray-400">새로운 계정을 만들어보세요</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="realName" className="block text-sm font-medium text-gray-300 mb-2">
                  본명
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-cyber-blue focus:outline-none focus:ring-2 focus:ring-cyber-blue/20 text-white placeholder-gray-400"
                      placeholder="실명을 입력하세요"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="nickname" className="block text-sm font-medium text-gray-300 mb-2">
                    닉네임
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="nickname"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-cyber-blue focus:outline-none focus:ring-2 focus:ring-cyber-blue/20 text-white placeholder-gray-400"
                      placeholder="서비스에서 사용할 닉네임을 입력하세요"
                      required
                    />
                  </div>
                </div>

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

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    비밀번호 확인
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-cyber-blue focus:outline-none focus:ring-2 focus:ring-cyber-blue/20 text-white placeholder-gray-400"
                      placeholder="비밀번호를 다시 입력하세요"
                      required
                    />
                  </div>
                </div>
              </div>

              <CyberButton
                type="submit"
                className="w-full text-lg py-3"
                disabled={isSigningUp}
              >
                <UserPlus className="h-5 w-5" />
                {isSigningUp ? '가입 중...' : '회원가입'}
              </CyberButton>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                이미 계정이 있으신가요?{' '}
                <Link to="/login" className="text-cyber-blue hover:text-cyber-blue/80 font-medium">
                  로그인
                </Link>
              </p>
            </div>
          </CyberCard>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
