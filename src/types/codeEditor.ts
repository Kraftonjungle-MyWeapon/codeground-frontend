export type ProgrammingLanguage = 'python' | 'c' | 'cpp' | 'java';

export interface LanguageConfig {
  name: string;
  extension: string;
  indentSize: number;
  autoIndentTriggers: string[];
  commentSyntax: {
    single: string;
    multiStart?: string;
    multiEnd?: string;
  };
  keywords: string[];
  placeholder: string;
  fontFamily: string;
}

export interface EditorSettings {
  tabSize: number;
  insertSpaces: boolean;
  detectIndentation: boolean;
  trimAutoWhitespace: boolean;
  wordWrap: boolean;
}

export interface Problem {
  problem_id: string;
  title: string;
  description: string;
  input_format: string;
  output_format: string;
  time_limit_milliseconds: string;
  memory_limit_kilobytes: string;
  difficulty: string;
  category: string[];
  languages: string[];
  test_cases: {
    id?: number; // Make id optional as it's generated on frontend
    input: string;
    output: string;
    description?: string; // Add optional description field
    visibility: 'public' | 'hidden';
  }[];
  constraints?: string;
}

export interface ProblemWithImages extends Problem {
  problemStatementImages: { url: string; name: string }[];
}


export interface MatchLog {
  result? : string;
  opponent_name : string;
  mmr_earned: number;
  opponent_tier: string;
  game_difficulty: string;
  game_time: string; 
  game_title : string;
}

export type UserLogsResult = MatchLog[] | null;