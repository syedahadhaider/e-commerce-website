import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'FORM / AFTER — Uniforms for the in-between',
  description:
    'Independent streetwear. Explore eight considered pieces, heavyweight fabrics and easy proportions. A fictional premium store with a complete demo shopping experience.',
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
