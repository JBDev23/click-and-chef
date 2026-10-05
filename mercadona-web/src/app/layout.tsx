import type { Metadata } from 'next';
import { AppProviders } from '@/lib/providers';
import { CartDrawer } from '@/features/cart/components/CartDrawer';
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
    <html lang="es" className="min-h-full antialiased">
      <body className="min-h-full bg-white font-sans text-home-ink">
        <AppProviders>
          {children}
          <CartDrawer />
        </AppProviders>
      </body>
    </html>
  );
}
