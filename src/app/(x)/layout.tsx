import { SidebarDemo } from '@/components/Sidebar';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen h-full w-full">
      <div className="flex flex-1">
        <SidebarDemo />
      </div>
    </div>
  );
}