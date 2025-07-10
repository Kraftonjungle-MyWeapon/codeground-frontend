import React from 'react';

interface OpponentInfoProps {
  userAccepted: boolean;
  opponentAccepted: boolean;
  opponent: {
    name: string;
    rank: string;
  };
}

const OpponentInfo: React.FC<OpponentInfoProps> = ({
  userAccepted,
  opponentAccepted,
  opponent,
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <h2 className="text-xl font-bold text-cyber-green">상대방 정보</h2>
      <p className="text-lg text-cyber-blue">이름: {opponent.name}</p>
      <p className="text-lg text-cyber-blue">랭크: {opponent.rank}</p>
      <div className="flex space-x-4 mt-2">
        <span className={`text-md ${userAccepted ? 'text-green-400' : 'text-red-400'}`}>
          나: {userAccepted ? '수락' : '대기중'}
        </span>
        <span className={`text-md ${opponentAccepted ? 'text-green-400' : 'text-red-400'}`}>
          상대방: {opponentAccepted ? '수락' : '대기중'}
        </span>
      </div>
    </div>
  );
};

export default OpponentInfo;