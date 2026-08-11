import './globals.css';

export const metadata = {
  title: 'Diego Garcia Chungara | Ingeniero de Sistemas',
  description: 'Portafolio interactivo de Diego Garcia Chungara — Ingeniero de Sistemas, desarrollador web y móvil. UCB Tarija, Bolivia.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
