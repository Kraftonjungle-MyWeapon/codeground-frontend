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