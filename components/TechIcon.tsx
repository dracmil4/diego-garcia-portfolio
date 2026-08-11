'use client';

import React from 'react';
import { IconType } from 'react-icons';
import { SiNodedotjs, SiTypescript, SiReact, SiFlutter, SiDart, SiPrisma, SiPostgresql, SiGit, SiGithub } from 'react-icons/si';
import { Layers, ShieldCheck, Database, GitPullRequest, Code2, Lock, TerminalSquare } from 'lucide-react';

interface TechIconProps {
  tech: string;
  className?: string;
}

interface TechMeta {
  Icon: IconType;
  color: string;
}

export default function TechIcon({ tech, className }: TechIconProps) {
  const t = tech.toLowerCase();
  let meta: TechMeta;

  if (t.includes('node')) meta = { Icon: SiNodedotjs, color: '#5fa04e' };
  else if (t.includes('typescript')) meta = { Icon: SiTypescript, color: '#3178c6' };
  else if (t.includes('react')) meta = { Icon: SiReact, color: '#61dafb' };
  else if (t.includes('flutter')) meta = { Icon: SiFlutter, color: '#02569b' };
  else if (t.includes('bloc') || t.includes('dart')) meta = { Icon: SiDart, color: '#0175c2' };
  else if (t.includes('prisma')) meta = { Icon: SiPrisma, color: '#9db2c6' };
  else if (t.includes('postgres') || t.includes('postgis') || t.includes('spatial')) meta = { Icon: SiPostgresql, color: '#4169e1' };
  else if (t.includes('github')) meta = { Icon: SiGithub, color: '#ffffff' };
  else if (t.includes('git')) meta = { Icon: SiGit, color: '#f05032' };
  else if (t.includes('clean architecture')) meta = { Icon: Layers, color: '#bd93f9' };
  else if (t.includes('clean code')) meta = { Icon: ShieldCheck, color: '#50fa7b' };
  else if (t.includes('asyncstorage')) meta = { Icon: Database, color: '#ffb86c' };
  else if (t.includes('ui locking')) meta = { Icon: Lock, color: '#ff79c6' };
  else if (t.includes('pull request')) meta = { Icon: GitPullRequest, color: '#f05032' };
  else if (t.includes('qa') || t.includes('testing')) meta = { Icon: ShieldCheck, color: '#50fa7b' };
  else if (t.includes('requirements')) meta = { Icon: TerminalSquare, color: '#8be9fd' };
  else meta = { Icon: Code2, color: 'var(--accent-color)' };

  const { Icon, color } = meta;
  return <Icon className={className} style={{ color }} />;
}
