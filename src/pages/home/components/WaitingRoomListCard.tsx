import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Crown } from "lucide-react";
import { WaitingRoom } from "../constants";

interface Props {
  waitingRooms: WaitingRoom[];
  onCreateRoom: () => void;
  onJoinRoom: (id: number) => void;
}

const WaitingRoomListCard = ({ waitingRooms, onCreateRoom, onJoinRoom }: Props) => (
  <CyberCard className="flex-1 flex flex-col">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-cyber-blue">대기실 리스트</h2>
      <CyberButton size="sm" onClick={onCreateRoom}>
        + 대기실 생성
      </CyberButton>
    </div>
    <div className="h-[500px] overflow-hidden">
      <ScrollArea className="h-full">
        <div className="space-y-3 pr-4">
          {waitingRooms.map((room) => (
            <div
              key={room.id}
              className="flex items-center justify-between p-4 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Crown className="h-4 w-4 text-yellow-400" />
                  <span className="text-white font-medium">{room.title}</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      room.difficulty === "초급"
                        ? "bg-green-500/20 text-green-400"
                        : room.difficulty === "중급"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : room.difficulty === "고급"
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {room.difficulty}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-1">{room.description}</p>
                <p className="text-xs text-gray-500">
                  호스트: {room.hostName} ({room.hostTier})
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">{room.players}</span>
                <CyberButton
                  size="sm"
                  disabled={room.players === "2/2"}
                  onClick={() => onJoinRoom(room.id)}
                >
                  {room.players === "2/2" ? "대기중" : "입장"}
                </CyberButton>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  </CyberCard>
);

export default WaitingRoomListCard;