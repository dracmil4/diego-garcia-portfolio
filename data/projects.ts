import { FileItem } from '../types';

export interface ProjectDetails {
  title: string;
  role: string;
  stack: string[];
  desc: string;
  githubUrl: string;
  images: string[];
  highlights: string[];
}

export interface ProjectDetailsWithStatus extends ProjectDetails {
  status?: string;
}

export const PROJECT_DEFAULTS: Record<string, ProjectDetails> = {
  cbn_gestion_eventos: {
    title: 'CBN — Sistema de Gestión de Eventos',
    role: 'Software Developer',
    stack: ['Node.js', 'TypeScript', 'Clean Architecture', 'Prisma ORM', 'Flutter', 'BLoC'],
    desc: 'Backend robusto bajo Clean Architecture con Node.js y Prisma ORM. App móvil en Flutter (BLoC) con enfoque Offline-First.',
    githubUrl: 'https://github.com/diego-garcia-chungara',
    images: ['/images/proyectos/cbn-admin.png', '/images/proyectos/cbn-mobile.png'],
    highlights: ['Panel de administración web', 'App móvil Flutter offline-first', 'Migraciones con Prisma'],
  },
  ucb_sistema_becas: {
    title: 'UCB — Sistema de Becas Universitarias',
    role: 'QA Junior / Colaborador Técnico',
    stack: ['QA Testing', 'Clean Code', 'Git / Pull Requests', 'Requirements Engineering'],
    desc: 'Definición de requerimientos, pruebas funcionales y revisión técnica de código del equipo.',
    githubUrl: 'https://github.com/diego-garcia-chungara',
    images: ['/images/proyectos/ucb-prs.png', '/images/proyectos/ucb-testing.png'],
    highlights: ['Revisión de Pull Requests', 'Matriz de trazabilidad', 'Flujos de aprobación de becas'],
  },
  ucb_sistema_certificados: {
    title: 'UCB — Sistema de Certificados Universitarios',
    role: 'Proyecto Universitario',
    stack: ['TypeScript', 'Node.js', 'PostgreSQL', 'Digital Validation'],
    desc: 'Sistema de generación y validación digital de certificados académicos. Panel administrativo y certificado final.',
    githubUrl: 'https://github.com/diego-garcia-chungara',
    images: ['/images/proyectos/ucb-cert-panel.png', '/images/proyectos/ucb-cert-result.png'],
    highlights: ['Panel de generación de certificados', 'Validación digital integrada', 'Trazabilidad en PostgreSQL'],
  },
  andean_ux_hobby_match: {
    title: 'Hobby Match — App Móvil',
    role: 'Software Developer',
    stack: ['React Native', 'TypeScript', 'AsyncStorage', 'UI Locking'],
    desc: 'App multiplataforma para conectar personas por intereses, con UI locking y persistencia local eficiente.',
    githubUrl: 'https://github.com/diego-garcia-chungara',
    images: ['/images/proyectos/hobby-match-1.png', '/images/proyectos/hobby-match-2.png', '/images/proyectos/hobby-match-3.png'],
    highlights: ['Listas optimizadas con FlatList', 'Control de carga con UI locking', 'Caché local AsyncStorage'],
  },
};

export const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  'Production Ready': { label: 'Production', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  'Deployed':         { label: 'Deployed',   color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  'Production':       { label: 'Production', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  'Academic Project': { label: 'Academic',   color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
};

export function getProjectDetails(
  id: string,
  fallbackTitle: string,
  files: FileItem[],
): ProjectDetailsWithStatus {
  const defaults = PROJECT_DEFAULTS[id] ?? {
    title: fallbackTitle,
    role: 'Software Engineer',
    stack: ['TypeScript', 'React', 'Node.js'],
    desc: 'Proyecto desarrollado bajo estándares de ingeniería de software.',
    githubUrl: 'https://github.com/diego-garcia-chungara',
    images: [],
    highlights: [],
  };

  const jsonFile = files
    .flatMap(folder => folder.children ?? [])
    .find(file => file.name.replace(/\.[^.]+$/, '') === id);

  if (jsonFile?.content) {
    try {
      const parsed = JSON.parse(jsonFile.content);
      return {
        title:     parsed.projectName || defaults.title,
        role:      parsed.role        || defaults.role,
        stack:     parsed.techStack   || defaults.stack,
        desc:      parsed.description || defaults.desc,
        githubUrl: parsed.githubUrl   || defaults.githubUrl,
        images:    parsed.images      || defaults.images,
        highlights: parsed.highlights || defaults.highlights,
        status:    parsed.status,
      };
    } catch {
      return defaults;
    }
  }
  return defaults;
}