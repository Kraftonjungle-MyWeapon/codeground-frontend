
import { ProgrammingLanguage, LanguageConfig, EditorSettings } from '@/types/codeEditor';

export const LANGUAGE_CONFIGS: Record<ProgrammingLanguage, LanguageConfig> = {
  python: {
    name: 'Python',
    extension: '.py',
    indentSize: 4,
    autoIndentTriggers: [':'],
    commentSyntax: {
      single: '#',
      multiStart: '"""',
      multiEnd: '"""'
    },
    keywords: [
      'and', 'as', 'assert', 'break', 'class', 'continue', 'def', 'del',
      'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if',
      'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass',
      'raise', 'return', 'try', 'while', 'with', 'yield', 'True', 'False', 'None'
    ],
    placeholder: '# Python 코드를 입력하세요',
    fontFamily: 'Monaco, Consolas, "Courier New", monospace'
  },
  c: {
    name: 'C',
    extension: '.c',
    indentSize: 4,
    autoIndentTriggers: ['{'],
    commentSyntax: {
      single: '//',
      multiStart: '/*',
      multiEnd: '*/'
    },
    keywords: [
      'auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do',
      'double', 'else', 'enum', 'extern', 'float', 'for', 'goto', 'if',
      'int', 'long', 'register', 'return', 'short', 'signed', 'sizeof', 'static',
      'struct', 'switch', 'typedef', 'union', 'unsigned', 'void', 'volatile', 'while'
    ],
    placeholder: '// C 코드를 입력하세요\n#include <stdio.h>\n\nint main() {\n    \n    return 0;\n}',
    fontFamily: 'Monaco, Consolas, "Courier New", monospace'
  },
  cpp: {
    name: 'C++',
    extension: '.cpp',
    indentSize: 4,
    autoIndentTriggers: ['{'],
    commentSyntax: {
      single: '//',
      multiStart: '/*',
      multiEnd: '*/'
    },
    keywords: [
      'alignas', 'alignof', 'and', 'and_eq', 'asm', 'auto', 'bitand', 'bitor',
      'bool', 'break', 'case', 'catch', 'char', 'char16_t', 'char32_t', 'class',
      'compl', 'const', 'constexpr', 'const_cast', 'continue', 'decltype', 'default',
      'delete', 'do', 'double', 'dynamic_cast', 'else', 'enum', 'explicit',
      'export', 'extern', 'false', 'float', 'for', 'friend', 'goto', 'if',
      'inline', 'int', 'long', 'mutable', 'namespace', 'new', 'noexcept', 'not',
      'not_eq', 'nullptr', 'operator', 'or', 'or_eq', 'private', 'protected',
      'public', 'register', 'reinterpret_cast', 'return', 'short', 'signed',
      'sizeof', 'static', 'static_assert', 'static_cast', 'struct', 'switch',
      'template', 'this', 'thread_local', 'throw', 'true', 'try', 'typedef',
      'typeid', 'typename', 'union', 'unsigned', 'using', 'virtual', 'void',
      'volatile', 'wchar_t', 'while', 'xor', 'xor_eq'
    ],
    placeholder: '// C++ 코드를 입력하세요\n#include <iostream>\n\nint main() {\n    \n    return 0;\n}',
    fontFamily: 'Monaco, Consolas, "Courier New", monospace'
  },
  java: {
    name: 'Java',
    extension: '.java',
    indentSize: 4,
    autoIndentTriggers: ['{'],
    commentSyntax: {
      single: '//',
      multiStart: '/*',
      multiEnd: '*/'
    },
    keywords: [
      'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char',
      'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum',
      'extends', 'final', 'finally', 'float', 'for', 'goto', 'if', 'implements',
      'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new',
      'package', 'private', 'protected', 'public', 'return', 'short', 'static',
      'strictfp', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws',
      'transient', 'try', 'void', 'volatile', 'while', 'true', 'false', 'null'
    ],
    placeholder: '// Java 코드를 입력하세요\npublic class Main {\n    public static void main(String[] args) {\n        \n    }\n}',
    fontFamily: 'Monaco, Consolas, "Courier New", monospace'
  }
};

export const DEFAULT_EDITOR_SETTINGS: EditorSettings = {
  tabSize: 4,
  insertSpaces: true,
  detectIndentation: true,
  trimAutoWhitespace: true,
  wordWrap: false
};

export function getLanguageConfig(language: ProgrammingLanguage): LanguageConfig {
  return LANGUAGE_CONFIGS[language];
}

export function getIndentString(language: ProgrammingLanguage): string {
  const config = getLanguageConfig(language);
  return ' '.repeat(config.indentSize);
}

export function shouldAutoIndent(language: ProgrammingLanguage, line: string): boolean {
  const config = getLanguageConfig(language);
  return config.autoIndentTriggers.some(trigger => line.trim().endsWith(trigger));
}
