import Header from '@components/Header';
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Floz',
  description: 'FLoz',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='h-screen flex flex-col'>
      <Header />
      <div className='grow overflow-auto'>
        {children}
      </div>
    </div>
  );
}
