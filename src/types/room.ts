export interface ResponseRoom {
  room_id: number;
  maker: string;
  user_cnt: number;
  difficulty: string;
  category: number;
  use_language: string;
  title: string;
  is_gaming: boolean;
}

export interface RoomCreateRequest {
  difficulty: string;
  title: string;
  use_language: string;
  category: number;
}

export interface UserState {
  user_id: number;
  nickname: string;
  mmr: number;
  img_url: string;
  ready: boolean;
  screen_sharing: boolean;
  screen_sharing_ready: boolean;
  connected: boolean;
}

export interface CustomRoom {
  room_id: number;
  maker: UserState | null;
  user: UserState | null;
  difficulty: string;
  category: number;
  use_language: string;
  title: string;
  is_gaming: boolean;
}