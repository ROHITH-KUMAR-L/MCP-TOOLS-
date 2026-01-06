import './globals.css';
import { Inter, Outfit } from 'next/font/google';
import clsx from 'clsx';
import AuthProvider from '@/components/AuthProvider';
import StyledComponentsRegistry from '@/lib/registry';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata = {
  title: 'EduNexus',
  description: 'Multi-user AI-driven productivity and learning platform.',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={clsx(inter.variable, outfit.variable)} suppressHydrationWarning>
        <StyledComponentsRegistry>
          <AuthProvider>
            {children}
          </AuthProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
