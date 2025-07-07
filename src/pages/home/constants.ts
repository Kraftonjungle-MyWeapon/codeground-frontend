export interface WaitingRoom {
    id: number;
    title: string;
    description: string;
    players: string;
    language: string;
    difficulty: string;
    hostName: string;
    hostTier: string;
  }
  
  export const waitingRooms: WaitingRoom[] = [
    { id: 1, title: "알고리즘 스피드런", description: "Python / 정렬 / 초급", players: "1/2", language: "Python", difficulty: "초급", hostName: "SpeedCoder", hostTier: "Silver III" },
    { id: 2, title: "Node.js 백엔드 구현", description: "JavaScript / 백엔드 / 고급", players: "0/2", language: "JavaScript", difficulty: "고급", hostName: "BackendNinja", hostTier: "Diamond V" },
    { id: 3, title: "Rust 메모리 관리", description: "Rust / 시스템 / 전문가", players: "1/2", language: "Rust", difficulty: "전문가", hostName: "RustGuru", hostTier: "Diamond II" },
    { id: 4, title: "Python 알고리즘 챌린지", description: "Python / 자료구조 / 중급", players: "1/2", language: "Python", difficulty: "중급", hostName: "AlgoMaster", hostTier: "Diamond III" },
    { id: 5, title: "JavaScript 스피드 코딩", description: "JavaScript / 구현 / 초급", players: "1/2", language: "JavaScript", difficulty: "초급", hostName: "CodeNinja", hostTier: "Gold I" },
    { id: 6, title: "Java 고급 문제 해결", description: "Java / 동적계획법 / 고급", players: "2/2", language: "Java", difficulty: "고급", hostName: "ByteWarrior", hostTier: "Platinum II" },
    { id: 7, title: "C++ 전문가 대결", description: "C++ / 그래프 / 전문가", players: "1/2", language: "C++", difficulty: "전문가", hostName: "CompilerKing", hostTier: "Diamond I" },
    { id: 8, title: "TypeScript 실전 코딩", description: "TypeScript / 문자열 / 중급", players: "1/2", language: "TypeScript", difficulty: "중급", hostName: "ScriptMaster", hostTier: "Platinum IV" },
    { id: 9, title: "React 컴포넌트 챌린지", description: "JavaScript / React / 중급", players: "0/2", language: "JavaScript", difficulty: "중급", hostName: "ReactPro", hostTier: "Gold II" },
    { id: 10, title: "SQL 쿼리 최적화", description: "SQL / 데이터베이스 / 고급", players: "1/2", language: "SQL", difficulty: "고급", hostName: "DBMaster", hostTier: "Platinum I" },
  ];