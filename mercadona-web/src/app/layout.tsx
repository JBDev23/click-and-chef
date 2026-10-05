import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mercadona Hackathon',
  description: 'Web app para el hackathon de Mercadona.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-white font-sans text-home-ink">{children}</body>
    </html>
  );
}
