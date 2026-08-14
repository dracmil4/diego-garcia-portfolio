import { FileItem } from '../types';
import { SOCIAL_LINKS } from './constants';

export const initialFileSystem: FileItem[] = [
  {
    id: 'sobre-mi',
    name: 'sobre-mi',
    type: 'folder',
    path: '/sobre-mi',
    children: [
      {
        id: 'perfil.md',
        name: 'perfil.md',
        type: 'file',
        extension: 'md',
        path: '/sobre-mi/perfil.md',
        content: `# Diego Garcia Chungara
> Ingeniero de Sistemas · Tarija, Bolivia 🇧🇴

![Diego Garcia Chungara](/images/foto-perfil.png)

## Sobre mí

Soy ingeniero de sistemas recién titulado de la UCB Tarija. Me dedico a crear software que resuelve problemas reales: sistemas que la gente pueda usar sin frustrarse, y que los equipos técnicos puedan mejorar sin dolores de cabeza.

Tengo experiencia en proyectos reales — tanto construyendo sistemas desde cero como asegurando que el trabajo del equipo tenga la calidad necesaria antes de salir al aire.

Busco seguir creciendo en un equipo donde pueda aportar, aprender y entregar resultados concretos.

## Lo que hago

- **Aplicaciones web y móviles**: Creo interfaces y apps para Android e iOS usando React, React Native y Flutter
- **Sistemas backend**: Desarrollo el "motor" de las aplicaciones — la lógica, la base de datos, los servicios que hacen que todo funcione por detrás
- **Control de calidad**: Verifico que el software funcione bien antes de llegar al usuario final — pruebas, revisión de código y documentación de errores
- **Bases de datos**: Diseño y optimizo el almacenamiento de información para que los sistemas sean rápidos y confiables

## Cómo trabajo

Soy ordenado con el código: lo escribo de forma que otro desarrollador pueda entenderlo y modificarlo sin necesitar que yo esté presente. Eso se traduce en menos bugs, menos tiempo perdido y proyectos que se pueden escalar sin reescribir todo desde cero.

Me comunico bien con personas técnicas y no técnicas — puedo explicar qué está pasando en un sistema sin necesitar jerga de programación.
`
      }
    ]
  },
  {
    id: 'proyectos',
    name: 'proyectos',
    type: 'folder',
    path: '/proyectos',
    children: [
      {
        id: 'cbn_gestion_eventos.json',
        name: 'cbn_gestion_eventos.json',
        type: 'file',
        extension: 'json',
        path: '/proyectos/cbn_gestion_eventos.json',
        content: `{
  "projectName": "CBN — Sistema de Gestión de Eventos",
  "role": "Desarrollador de Software",
  "status": "Production Ready",
  "githubUrl": "https://github.com/diego-garcia-chungara",
  "techStack": [
    "Node.js",
    "TypeScript",
    "Clean Architecture",
    "Prisma ORM",
    "Flutter",
    "BLoC"
  ],
  "images": [
    "/images/proyectos/cbn-admin.png",
    "/images/proyectos/cbn-mobile.png"
  ],
  "description": "Desarrollé el sistema completo para que CBN gestione sus eventos: un panel web para los administradores y una app móvil para los asistentes. La app funciona incluso sin conexión a internet, sincronizando la información cuando vuelve la señal.",
  "highlights": [
    "Panel web para que los administradores creen y gestionen eventos",
    "App para Android e iOS que funciona sin conexión a internet",
    "Base de datos organizada con historial completo de cambios"
  ]
}`
      },
      {
        id: 'ucb_sistema_becas.json',
        name: 'ucb_sistema_becas.json',
        type: 'file',
        extension: 'json',
        path: '/proyectos/ucb_sistema_becas.json',
        content: `{
  "projectName": "UCB — Sistema de Becas Universitarias",
  "role": "QA Junior / Colaborador Técnico",
  "status": "Deployed",
  "githubUrl": "https://github.com/diego-garcia-chungara",
  "techStack": [
    "QA Testing",
    "Clean Code",
    "Git / Pull Requests",
    "Requirements Engineering"
  ],
  "images": [
    "/images/proyectos/ucb-prs.png",
    "/images/proyectos/ucb-testing.png"
  ],
  "description": "Participé en el aseguramiento de calidad del sistema que gestiona las becas de la UCB. Mi trabajo fue asegurar que los flujos funcionaran correctamente antes de llegar a los estudiantes: desde la solicitud de la beca hasta su aprobación y asignación.",
  "highlights": [
    "Revisión del código del equipo para detectar errores antes de publicar",
    "Pruebas funcionales de los flujos de solicitud y aprobación de becas",
    "Documentación de requerimientos y casos de prueba"
  ]
}`
      },
      {
        id: 'ucb_sistema_certificados.json',
        name: 'ucb_sistema_certificados.json',
        type: 'file',
        extension: 'json',
        path: '/proyectos/ucb_sistema_certificados.json',
        content: `{
  "projectName": "UCB — Sistema de Certificados Universitarios",
  "role": "Proyecto Universitario",
  "status": "Academic Project",
  "githubUrl": "https://github.com/diego-garcia-chungara",
  "techStack": [
    "TypeScript",
    "Node.js",
    "PostgreSQL",
    "Digital Validation"
  ],
  "images": [
    "/images/proyectos/ucb-cert-panel.png",
    "/images/proyectos/ucb-cert-result.png"
  ],
  "description": "Sistema universitario para generar y validar certificados académicos de forma digital. Permite que los administradores generen certificados y que cualquier persona pueda verificar su autenticidad con un código único.",
  "highlights": [
    "Panel para que administradores generen certificados con datos reales",
    "Cada certificado tiene un código de verificación único",
    "Registro completo y trazable de todos los certificados emitidos"
  ]
}`
      },
      {
        id: 'andean_ux_hobby_match.json',
        name: 'andean_ux_hobby_match.json',
        type: 'file',
        extension: 'json',
        path: '/proyectos/andean_ux_hobby_match.json',
        content: `{
  "projectName": "Hobby Match — App Móvil",
  "role": "Desarrollador de Software",
  "status": "Production",
  "githubUrl": "https://github.com/diego-garcia-chungara",
  "techStack": [
    "React Native",
    "TypeScript",
    "AsyncStorage",
    "UI Locking"
  ],
  "images": [
    "/images/proyectos/hobby-match-1.png",
    "/images/proyectos/hobby-match-2.png",
    "/images/proyectos/hobby-match-3.png"
  ],
  "description": "App móvil para conectar personas según sus intereses y hobbies. Funciona en Android e iOS con un solo código. Me enfoqué especialmente en que la experiencia fuera fluida — sin pantallas que se congelen ni tiempos de carga frustrantes.",
  "highlights": [
    "La app funciona en Android e iOS desde el mismo proyecto",
    "Navegación fluida sin bloqueos, incluso con muchos usuarios en pantalla",
    "Guarda sesión y datos localmente para no perder información al cerrar"
  ]
}`
      }
    ]
  },
  {
    id: 'educacion',
    name: 'educacion',
    type: 'folder',
    path: '/educacion',
    children: [
      {
        id: 'universidad.md',
        name: 'universidad.md',
        type: 'file',
        extension: 'md',
        path: '/educacion/universidad.md',
        content: `# Universidad Católica Boliviana "San Pablo"

## Licenciatura en Ingeniería de Sistemas

*Defensa de Grado — Ingeniería de Sistemas, UCB*

- **Institución**: Universidad Católica Boliviana "San Pablo" (UCB)
- **Campus**: Tarija, Bolivia
- **Titulación**: Licenciatura en Ingeniería de Sistemas
- **Estado**: Titulado — trámite de diploma en proceso
- **Énfasis durante la carrera**: Desarrollo de software, bases de datos, redes y calidad del software

## Participación destacada

- Proyectos integradores desarrollados en equipo, con roles definidos y entregables reales
- Apoyo técnico al equipo en revisión de código: identificar errores antes de publicar cambios
- Participación activa en la comunidad estudiantil de tecnología de la universidad
`
      },
      {
        id: 'arquitectura_sistemas.json',
        name: 'arquitectura_sistemas.json',
        type: 'file',
        extension: 'json',
        path: '/educacion/arquitectura_sistemas.json',
        content: `{
  "course": "Mastering Software Architecture Patterns and System Design",
  "platform": "Udemy (En Curso - 2026)",
  "focus": "Enterprise Systems & Scalable Architecture",
  "core_patterns": [
    "Clean Architecture",
    "Hexagonal & Onion Architecture",
    "Microservices & Event-Driven Systems"
  ],
  "system_design_skills": [
    "API Gateways & BFF (Backend For Frontend) Patterns",
    "CQRS & Event Sourcing core principles",
    "Fault Tolerance & Resilience (Circuit Breakers, Retries)",
    "Distributed Systems Scalability & Trade-offs analysis"
  ]
}`
      },
      {
        id: 'certificaciones.json',
        name: 'certificaciones.json',
        type: 'file',
        extension: 'json',
        path: '/educacion/certificaciones.json',
        content: `{
  "certifications": [
    {
      "title": "Análisis de Datos con Power BI y R Studio",
      "institution": "UCB",
      "year": "2024",
      "description": "Visualización e interpretación de datos para toma de decisiones"
    },
    {
      "title": "CCNA 1 — Fundamentos de Redes",
      "institution": "UCB",
      "year": "2024",
      "description": "Configuración y administración básica de redes de computadoras"
    },
    {
      "title": "Programación Profesional en Python",
      "year": "2023 — 2024",
      "description": "Automatización, scripting y desarrollo de herramientas con Python"
    },
    {
      "title": "Gestión de Aduanas y Comercio Exterior",
      "year": "2023",
      "description": "Procesos aduaneros, ley general de aduanas y comercio internacional"
    }
  ]
}`
      }
    ]
  },
  {
    id: 'contacto',
    name: 'contacto',
    type: 'folder',
    path: '/contacto',
    children: [
      {
        id: 'redes.socials',
        name: 'redes.socials',
        type: 'file',
        extension: 'socials',
        path: '/contacto/redes.socials',
        content: `# Hablemos

Si llegaste hasta aquí, me alegra. Estoy disponible para una llamada, una entrevista o simplemente para responder preguntas sobre mi experiencia.

Estoy abierto a oportunidades de trabajo remoto, híbrido o presencial en Bolivia. También disponible para trabajo internacional de forma remota.

[Email](mailto:${SOCIAL_LINKS.email}): ${SOCIAL_LINKS.email}
[LinkedIn](${SOCIAL_LINKS.linkedin}): linkedin.com/in/diego-garcia-ch
[GitHub](${SOCIAL_LINKS.github}): github.com/dracmil4
[WhatsApp](${SOCIAL_LINKS.whatsapp}): +591 60265541
[Ubicación]: Tarija, Bolivia 🇧🇴
`
      }
    ]
  }
];
