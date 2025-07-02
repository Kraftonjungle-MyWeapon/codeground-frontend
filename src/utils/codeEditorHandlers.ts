
import { ProgrammingLanguage, LanguageConfig } from '@/types/codeEditor';
import { getLanguageConfig, getIndentString, shouldAutoIndent } from './languageConfig';

export class CodeEditorHandler {
  private language: ProgrammingLanguage;
  private config: LanguageConfig;

  constructor(language: ProgrammingLanguage) {
    this.language = language;
    this.config = getLanguageConfig(language);
  }

  handleTabKey(textarea: HTMLTextAreaElement, shiftKey: boolean): void {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;

    if (start === end) {
      this.handleSingleCursorTab(textarea, start, value, shiftKey);
    } else {
      this.handleMultiLineTab(textarea, start, end, value, shiftKey);
    }
  }

  private handleSingleCursorTab(textarea: HTMLTextAreaElement, start: number, value: string, shiftKey: boolean): void {
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const currentLine = value.substring(lineStart, start);
    const indentLevel = currentLine.length - currentLine.trimStart().length;
    
    if (shiftKey) {
      // Shift+Tab: 들여쓰기 제거
      if (indentLevel > 0) {
        const removeSpaces = Math.min(this.config.indentSize, indentLevel % this.config.indentSize === 0 ? this.config.indentSize : indentLevel % this.config.indentSize);
        const newValue = value.substring(0, lineStart) + 
                       currentLine.substring(removeSpaces) + 
                       value.substring(start);
        textarea.value = newValue;
        
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start - removeSpaces;
          textarea.focus();
        }, 0);
      }
    } else {
      // Tab: 들여쓰기 추가
      const spacesToAdd = this.config.indentSize - (indentLevel % this.config.indentSize);
      const spaces = ' '.repeat(spacesToAdd);
      const newValue = value.substring(0, start) + spaces + value.substring(start);
      textarea.value = newValue;
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + spacesToAdd;
        textarea.focus();
      }, 0);
    }
  }

  private handleMultiLineTab(textarea: HTMLTextAreaElement, start: number, end: number, value: string, shiftKey: boolean): void {
    const beforeSelection = value.substring(0, start);
    const afterSelection = value.substring(end);
    
    const startLineBegin = beforeSelection.lastIndexOf('\n') + 1;
    const endLineEnd = afterSelection.indexOf('\n');
    const fullEnd = endLineEnd === -1 ? value.length : end + endLineEnd;
    
    const fullSelection = value.substring(startLineBegin, fullEnd);
    const lines = fullSelection.split('\n');
    
    if (shiftKey) {
      // Shift+Tab: 모든 선택된 줄의 들여쓰기 제거
      const processedLines = lines.map(line => {
        if (line.trim() === '') return line;
        const indentLevel = line.length - line.trimStart().length;
        if (indentLevel > 0) {
          const removeSpaces = Math.min(this.config.indentSize, indentLevel % this.config.indentSize === 0 ? this.config.indentSize : indentLevel % this.config.indentSize);
          return line.substring(removeSpaces);
        }
        return line;
      });
      
      const newSelection = processedLines.join('\n');
      const newValue = value.substring(0, startLineBegin) + newSelection + value.substring(fullEnd);
      textarea.value = newValue;
      
      setTimeout(() => {
        textarea.selectionStart = startLineBegin;
        textarea.selectionEnd = startLineBegin + newSelection.length;
        textarea.focus();
      }, 0);
    } else {
      // Tab: 모든 선택된 줄에 들여쓰기 추가
      const indentString = getIndentString(this.language);
      const processedLines = lines.map(line => {
        if (line.trim() === '') return line;
        return indentString + line;
      });
      
      const newSelection = processedLines.join('\n');
      const newValue = value.substring(0, startLineBegin) + newSelection + value.substring(fullEnd);
      textarea.value = newValue;
      
      setTimeout(() => {
        textarea.selectionStart = startLineBegin;
        textarea.selectionEnd = startLineBegin + newSelection.length;
        textarea.focus();
      }, 0);
    }
  }

  handleEnterKey(textarea: HTMLTextAreaElement): void {
    const start = textarea.selectionStart;
    const value = textarea.value;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const currentLine = value.substring(lineStart, start);
    const indent = currentLine.match(/^(\s*)/)?.[1] || '';
    
    // 언어별 자동 들여쓰기 조건 확인
    const trimmedLine = currentLine.trim();
    const needsExtraIndent = shouldAutoIndent(this.language, trimmedLine);
    
    let newIndent = indent;
    if (needsExtraIndent) {
      newIndent = indent + getIndentString(this.language);
    }
    
    const newValue = value.substring(0, start) + '\n' + newIndent + value.substring(textarea.selectionEnd);
    textarea.value = newValue;
    
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + 1 + newIndent.length;
      textarea.focus();
    }, 0);
  }
}
