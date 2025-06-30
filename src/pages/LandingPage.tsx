import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '@/lib/utils';
import CyberCard from '@/components/CyberCard';
import CyberButton from '@/components/CyberButton';
import { Play, Code, Zap, Trophy } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getCookie('access_token');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);


  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const features = [
    {
      icon: Code,
      title: '실시간 코딩 대결',
      description: '다른 개발자들과 실시간으로 코딩 실력을 겨뤄보세요'
    },
    {
      icon: Trophy,
      title: '랭킹 시스템',
      description: 'MMR 기반 랭킹으로 자신의 실력을 증명하세요'
    },
    {
      icon: Zap,
      title: '다양한 문제',
      description: '알고리즘부터 자료구조까지 다양한 문제에 도전하세요'
    }
  ];

  return (
    <div className="min-h-screen cyber-grid overflow-hidden">
      {/* 헤더 */}
      <header className="relative z-10 p-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/af0ff57a-93d9-40b0-a0ff-1f22a23418ce.png" 
              alt="Codeground Logo"
              className="h-20 w-auto select-none pointer-events-none"
              draggable="false"
            />
            <span className="text-4xl font-bold neon-text">CODEGROUND</span>
          </div>
          <div className="flex items-center gap-4">
            <CyberButton 
              variant="secondary" 
              size="sm"
              onClick={handleLogin}
            >
              로그인
            </CyberButton>
            <CyberButton 
              size="sm"
              onClick={handleSignup}
            >
              회원가입
            </CyberButton>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="relative z-10 container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          {/* 왼쪽: 텍스트 콘텐츠 */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="neon-text">코딩 실력을</span>
                <br />
                <span className="text-white">겨뤄보세요</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                실시간 코딩 대결로 다른 개발자들과 경쟁하고, 
                랭킹 시스템을 통해 자신의 실력을 증명해보세요.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <CyberButton 
                onClick={handleLogin}
                size="lg"
                className="text-lg px-8 py-4"
              >
                <Play className="h-6 w-6" />
                지금 시작하기
              </CyberButton>
            </div>

            {/* 특징들 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="text-center space-y-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-lg mx-auto flex items-center justify-center">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 오른쪽: 배경 영상 영역 */}
          <div className="relative">
            <CyberCard className="relative overflow-hidden h-96 lg:h-[500px]">
              {/* 배경 영상 */}
              <div className="absolute inset-0">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover opacity-60"
                >
                  <source
                    src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                    type="video/mp4"
                  />
                  {/* 비디오가 로드되지 않을 경우 대체 배경 */}
                </video>
                {/* 비디오 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
              </div>

              {/* 오버레이 콘텐츠 */}
              <div className="relative z-10 h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-cyber-blue/20 rounded-full mx-auto flex items-center justify-center backdrop-blur-sm">
                    <Play className="h-10 w-10 text-cyber-blue" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">실시간 대결 시스템</h3>
                    <p className="text-gray-300">최고의 코딩 경험을 제공합니다</p>
                  </div>
                </div>
              </div>

              {/* 코드 스니펫 애니메이션 효과 */}
              <div className="absolute top-4 left-4 bg-black/60 rounded p-2 text-xs text-green-400 font-mono backdrop-blur-sm">
                <div className="animate-pulse">
                  {'> function solve(arr) {'}
                  <br />
                  {'    return arr.sort();'}
                  <br />
                  {'}'}
                </div>
              </div>

              <div className="absolute bottom-4 right-4 bg-black/60 rounded p-2 text-xs text-cyber-blue font-mono backdrop-blur-sm">
                <div className="animate-pulse">
                  {'Status: Connected'}
                  <br />
                  {'Players: 1,247 online'}
                </div>
              </div>
            </CyberCard>
          </div>
        </div>
      </main>

      {/* 통계 섹션 */}
      <section className="relative z-10 py-16 border-t border-cyber-blue/20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold neon-text">10K+</div>
              <div className="text-gray-400">활성 사용자</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold neon-text">50K+</div>
              <div className="text-gray-400">완료된 대결</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold neon-text">500+</div>
              <div className="text-gray-400">문제 수</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold neon-text">24/7</div>
              <div className="text-gray-400">실시간 서비스</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
