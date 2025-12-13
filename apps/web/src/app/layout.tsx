import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MiniGénie - Dashboard Parent',
  description: 'Suivez la progression de votre enfant avec MiniGénie',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}

