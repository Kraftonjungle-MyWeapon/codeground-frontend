
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import CyberCard from '@/components/CyberCard';
import CyberButton from '@/components/CyberButton';
import RoomSettingsModal from '@/components/RoomSettingsModal';
import { User, Settings, MessageCircle, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';

const WaitingRoomPage = () => {
  const navigate = useNavigate();
  const [isHost, setIsHost] = useState(true); // 예시로 방장으로 설정
  const [isReady, setIsReady] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { type: 'system', message: 'CyberCoder님이 대기실을 생성했습니다.' },
    { type: 'system', message: 'Player2님이 입장했습니다.' }
  ]);
  
  const [roomSettings] = useState({
    title: '알고리즘 기초 대결',
    language: 'Python',
    category: '자료구조',
    difficulty: '초급'
  });

  const handleReady = () => {
    setIsReady(!isReady);
    const message = isReady ? 'CyberCoder님이 준비를 취소했습니다.' : 'CyberCoder님이 준비 완료했습니다.';
    setChatMessages(prev => [...prev, { type: 'system', message }]);
  };

  const handleGameStart = () => {
    navigate('/battle');
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setChatMessages(prev => [...prev, { type: 'user', message: `CyberCoder: ${chatMessage}` }]);
      setChatMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen cyber-grid">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 대기실 설정 정보 */}
          <CyberCard className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-cyber-blue">{roomSettings.title}</h1>
              {isHost && (
                <CyberButton 
                  size="sm" 
                  variant="secondary"
                  onClick={() => setIsSettingsModalOpen(true)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  설정 변경
                </CyberButton>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-400">사용 언어</div>
                <div className="text-lg font-semibold text-white">{roomSettings.language}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">문제 분야</div>
                <div className="text-lg font-semibold text-white">{roomSettings.category}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">난이도</div>
                <div className="text-lg font-semibold text-white">{roomSettings.difficulty}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">참가자</div>
                <div className="text-lg font-semibold text-white">2/2</div>
              </div>
            </div>
          </CyberCard>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 플레이어 섹션 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 플레이어 카드들 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 플레이어 1 (방장) */}
                <CyberCard glowing>
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full mx-auto flex items-center justify-center">
                      <User className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">CyberCoder</h3>
                      <p className="text-cyber-blue font-semibold">방장</p>
                      <p className="text-sm text-gray-400">MMR: 1847</p>
                    </div>
                    {isHost ? (
                      <CyberButton 
                        onClick={handleGameStart}
                        disabled={!isReady}
                        className="w-full"
                      >
                        게임 시작
                      </CyberButton>
                    ) : (
                      <div className="text-green-400 font-semibold">준비 완료</div>
                    )}
                  </div>
                </CyberCard>

                {/* 플레이어 2 */}
                <CyberCard>
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full mx-auto flex items-center justify-center">
                      <User className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Player2</h3>
                      <p className="text-gray-400">플레이어</p>
                      <p className="text-sm text-gray-400">MMR: 1623</p>
                    </div>
                    {!isHost ? (
                      <CyberButton 
                        onClick={handleReady}
                        variant={isReady ? 'secondary' : 'primary'}
                        className="w-full"
                      >
                        {isReady ? '준비 취소' : '준비'}
                      </CyberButton>
                    ) : (
                      <div className={`font-semibold ${isReady ? 'text-green-400' : 'text-yellow-400'}`}>
                        {isReady ? '준비 완료' : '준비 중...'}
                      </div>
                    )}
                  </div>
                </CyberCard>
              </div>
            </div>

            {/* 채팅 섹션 */}
            <div className="space-y-6">
              <CyberCard>
                <div className="flex items-center mb-4">
                  <MessageCircle className="mr-2 h-5 w-5 text-cyber-blue" />
                  <h3 className="text-xl font-bold text-cyber-blue">채팅</h3>
                </div>
                
                <div className="space-y-3 h-64 overflow-y-auto mb-4">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={`text-sm ${
                      msg.type === 'system' ? 'text-gray-400 italic' : 'text-white'
                    }`}>
                      {msg.message}
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <Input
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="메시지를 입력하세요..."
                    className="bg-black/30 border-gray-600 text-white flex-1"
                  />
                  <CyberButton size="sm" onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </CyberButton>
                </div>
              </CyberCard>
            </div>
          </div>
        </div>
      </main>

      <RoomSettingsModal 
        isOpen={isSettingsModalOpen} 
        onClose={() => setIsSettingsModalOpen(false)}
        currentSettings={roomSettings}
      />
    </div>
  );
};

export default WaitingRoomPage;
