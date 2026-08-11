export type ThemeType = 'ide' | 'dracula' | 'cyberpunk' | 'github';

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  extension?: 'md' | 'json' | 'yaml' | 'socials' | 'ts';
  content?: string;
  children?: FileItem[];
  path: string;
}

export interface WindowItem {
  id: string;
  title: string;
  url?: string;
  type: 'project' | 'terminal' | 'settings';
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  projectKey?: string;
}
