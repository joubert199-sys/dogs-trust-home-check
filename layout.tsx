import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dogs Trust Home Check',
  description: 'Dogs Trust dog adoption home check app'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
