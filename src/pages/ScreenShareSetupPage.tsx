import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CyberCard from '@/components/CyberCard';
import CyberButton from '@/components/CyberButton';
import { Monitor, User, Clock, AlertTriangle, Check, Video } from 'lucide-react';

const ScreenShareSetupPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get('gameId');
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [myShareStatus, setMyShareStatus] = useState<'waiting' | 'sharing' | 'invalid' | 'valid'>('waiting');
  const [opponentReady, setOpponentReady] = useState(false);
  const [myReady, setMyReady] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);

  const startScreenShare = async () => {
    try {
      setMyShareStatus('sharing');
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      });

      const videoTrack = mediaStream.getVideoTracks()[0];
      const settings = videoTrack.getSettings() as any;

      console.log('Screen share settings:', settings);

      if (settings.displaySurface === 'monitor') {
        setMyShareStatus('valid');
        setMyStream(mediaStream);
        // 화면 공유가 종료되었을 때 감지
        videoTrack.addEventListener('ended', () => {
            console.log('Screen share ended');
            setMyShareStatus('waiting');
            setMyStream(null);
            setMyReady(false);
            setIsCountingDown(false);
            setCountdown(0);
          });
      } else {
        setMyShareStatus('invalid');
        setMyReady(false);
        setIsCountingDown(false);
        setCountdown(0);
        mediaStream.getTracks().forEach(track => track.stop());
      }
    } catch (error) {
      console.error('Screen share failed:', error);
      setMyShareStatus('waiting');
    }
  };

  const handleRetryShare = () => {
    setMyShareStatus('waiting');
    startScreenShare();
  };

  const handleReady = () => {
    if (myShareStatus === 'valid') {
      setMyReady(true);
      // 시뮬레이션: 상대방도 준비됨 (더미 데이터)
      setTimeout(() => {
        setOpponentReady(true);
      }, 2000);
    }
  };

  useEffect(() => {
    if (myReady && !isCountingDown) {
      console.log('Starting countdown...');
      setIsCountingDown(true);
      setCountdown(3);
    }
  }, [myReady, isCountingDown]);

  useEffect(() => {
    if (isCountingDown && countdown > 0) {
      console.log('Countdown:', countdown);
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (isCountingDown && countdown === 0) {
      console.log('Game starting...');
      if (myStream) {
        myStream.getTracks().forEach(track => track.stop());
      }
      if (gameId) {
        navigate(`/battle?gameId=${gameId}`);
      } else {
        navigate('/battle');
      }
    }
  }, [isCountingDown, countdown, myStream, navigate, gameId]);

  useEffect(() => {
    startScreenShare();
  }, []);

  return (
    <div className="min-h-screen cyber-grid bg-cyber-darker">
      <header className="cyber-card border-b border-cyber-blue/20 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center">
            <span className="text-xl font-bold neon-text">화면 공유 설정</span>
          </div>
        </div>
      </header>

      {isCountingDown && countdown > 0 && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in">
          <div className="text-center">
            <div className="text-8xl font-bold neon-text mb-4 animate-bounce">
              <span
                key={countdown}
                className="inline-block animate-pulse"
                style={{
                  animation: 'pulse 0.5s ease-in-out, bounce 0.6s ease-in-out',
                  textShadow: '0 0 30px rgba(0, 200, 255, 0.8), 0 0 60px rgba(0, 200, 255, 0.6)'
                }}
              >
                {countdown}
              </span>
            </div>
            <div className="text-2xl text-cyber-blue animate-pulse">
              게임이 곧 시작됩니다!
            </div>
            <div className="mt-6 w-48 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full transition-all duration-1000 ease-linear"
                style={{
                  width: `${((4 - countdown) / 3) * 100}%`,
                  boxShadow: '0 0 10px rgba(0, 200, 255, 0.5)'
                }}
              />
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <CyberCard className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">나</div>
                    <div className="flex items-center space-x-2">
                      {myShareStatus === 'valid' && (
                        <Check className="h-4 w-4 text-green-400" />
                      )}
                      <span className={`text-sm ${
                        myShareStatus === 'valid' ? 'text-green-400' :
                        myShareStatus === 'invalid' ? 'text-red-400' :
                        'text-yellow-400'
                      }`}>
                        {myShareStatus === 'valid' ? '화면 공유 완료' :
                         myShareStatus === 'invalid' ? '전체 화면 필요' :
                         myShareStatus === 'sharing' ? '공유 설정 중...' :
                         '화면 공유 대기'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-2xl font-bold neon-text">VS</div>

                <div className="flex items-center space-x-4">
                  <div>
                    <div className="text-white font-semibold text-right">상대방</div>
                    <div className="flex items-center justify-end space-x-2">
                      {opponentReady && (
                        <Check className="h-4 w-4 text-green-400" />
                      )}
                      <span className={`text-sm ${opponentReady ? 'text-green-400' : 'text-yellow-400'}`}>
                        {opponentReady ? '준비 완료' : '준비 중...'}
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </CyberCard>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <CyberCard className="p-6">
              <h3 className="text-lg font-semibold text-cyber-blue mb-4 flex items-center">
                <Monitor className="mr-2 h-5 w-5" />
                내 화면 공유
              </h3>

              <div className="aspect-video bg-black/50 rounded-lg border-2 border-cyber-blue/30 flex items-center justify-center mb-4">
                {myShareStatus === 'valid' ? (
                  <div className="text-center">
                    <Video className="h-12 w-12 text-green-400 mx-auto mb-2" />
                    <div className="text-green-400 font-semibold">화면 공유 중</div>
                    <div className="text-sm text-gray-400">전체 화면이 공유되고 있습니다</div>
                  </div>
                ) : myShareStatus === 'invalid' ? (
                  <div className="text-center">
                    <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-2" />
                    <div className="text-red-400 font-semibold">전체 화면이 아님</div>
                    <div className="text-sm text-gray-400">창이나 탭이 아닌 전체 화면을 선택해주세요</div>
                  </div>
                ) : myShareStatus === 'sharing' ? (
                  <div className="text-center">
                    <Clock className="h-12 w-12 text-yellow-400 mx-auto mb-2 animate-spin" />
                    <div className="text-yellow-400 font-semibold">공유 설정 중...</div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <div className="text-gray-400">화면 공유 대기 중</div>
                  </div>
                )}
              </div>

              <div className="flex justify-center space-x-3">
                {(myShareStatus === 'invalid' || myShareStatus === 'waiting') && (
                  <CyberButton onClick={handleRetryShare} size="sm">
                    {myShareStatus === 'waiting' ? '화면 공유 시작' : '다시 시도'}
                  </CyberButton>
                )}
                {myShareStatus === 'valid' && !myReady && (
                  <CyberButton onClick={handleReady} className="bg-gradient-to-r from-green-500 to-emerald-600">
                    준비 완료
                  </CyberButton>
                )}
                {myReady && (
                  <div className="flex items-center space-x-2 text-green-400">
                    <Check className="h-5 w-5" />
                    <span className="font-semibold">준비됨</span>
                  </div>
                )}
              </div>
            </CyberCard>

            <CyberCard className="p-6">
              <h3 className="text-lg font-semibold text-cyber-blue mb-4 flex items-center">
                <Monitor className="mr-2 h-5 w-5" />
                상대방 화면 공유
              </h3>

              <div className="aspect-video bg-black/50 rounded-lg border-2 border-cyber-blue/30 flex items-center justify-center mb-4">
                {opponentReady ? (
                  <div className="text-center">
                    <Video className="h-12 w-12 text-green-400 mx-auto mb-2" />
                    <div className="text-green-400 font-semibold">화면 공유 중</div>
                    <div className="text-sm text-gray-400">상대방의 화면이 공유되고 있습니다</div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Clock className="h-12 w-12 text-yellow-400 mx-auto mb-2 animate-pulse" />
                    <div className="text-yellow-400 font-semibold">대기 중...</div>
                    <div className="text-sm text-gray-400">상대방이 화면 공유를 설정하고 있습니다</div>
                  </div>
                )}
              </div>
            </CyberCard>
          </div>

          <CyberCard className="p-4">
            <div className="text-center">
              {!myReady ? (
                <div className="text-gray-300">
                  전체 화면을 공유하고 준비 버튼을 눌러주세요
                </div>
              ) : isCountingDown ? (
                <div className="text-green-400 font-semibold">
                  게임이 곧 시작됩니다!
                </div>
              ) : (
                <div className="text-green-400 font-semibold">
                  준비 완료! 게임 시작을 기다리고 있습니다.
                </div>
              )}
            </div>
          </CyberCard>
        </div>
      </main>
    </div>
  );
};

export default ScreenShareSetupPage;