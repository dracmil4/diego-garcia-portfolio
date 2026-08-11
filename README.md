# Portafolio — Diego Garcia Chungara

Portafolio interactivo con estética de editor de código (IDE). Diseñado para mostrar proyectos, experiencia y formación de forma visual y navegable.

Desktop: interfaz tipo VS Code con sidebar, editor, terminal interactiva y ventanas flotantes.
Móvil: layout nativo con navegación por tarjetas y bottom bar.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** — animaciones y transiciones
- **GSAP** — animación de la secuencia de inicio
- **Lucide React** — iconografía

## Ejecutar localmente

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Estructura del proyecto

```
├── app/                  # Página principal, layout y estilos globales
├── components/           # Componentes de UI
│   ├── BootSequence      # Animación de inicio (desktop y móvil)
│   ├── Editor            # Editor de contenido con tabs
│   ├── Terminal           # Terminal interactiva con comandos reales
│   ├── Sidebar            # Panel lateral con árbol de archivos
│   ├── FloatingWindow     # Ventanas flotantes de proyectos
│   ├── MobileLayout       # Layout completo para móvil
│   ├── StatusBar          # Barra inferior con selector de tema
│   ├── TourOverlay        # Tour guiado interactivo
│   └── TechIcon           # Iconos de tecnologías
├── data/                 # Datos estáticos del portafolio
│   ├── constants.ts       # Links de contacto y redes sociales
│   └── fileSystem.ts      # Contenido del portafolio (perfil, proyectos, educación)
├── types/                # Tipos TypeScript compartidos
└── public/images/        # Imágenes de perfil y capturas de proyectos
```

## Temas disponibles

El portafolio incluye 4 temas visuales seleccionables desde la barra inferior:

- **Dracula** (predeterminado)
- **VS Code Dark**
- **Cyberpunk**
- **GitHub Light**

## Autor

**Diego Garcia Chungara**
Ingeniero de Sistemas · UCB Tarija, Bolivia

- [GitHub](https://github.com/dracmil4)
- [LinkedIn](https://www.linkedin.com/in/diego-garcia-ch/)
- Email: garciadiego56@gmail.com
