export interface Achievement {
  achievement_id: number;
  title: string;
  description: string;
  trigger_type: string;
  parameter: number;
  reward_type: string;
  reward_amount: number;
  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  user_achievement_id: number;
  user_id: number;
  achievement_id: number;
  current_value: number;
  is_reward_received: boolean;
  obtained_at: string;
  achievement: Achievement;
}

export interface AllAchievementsResponse {
  all_achievements: Achievement[];
  user_achievements: UserAchievement[];
}