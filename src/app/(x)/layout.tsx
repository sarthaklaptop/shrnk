import { SidebarDemo } from '@/components/Sidebar';
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {

  // const status = useProtectedRoute();


  return (
    <div className="flex flex-col min-h-screen h-full w-full">
      <div className="flex flex-1 ">
        <SidebarDemo/>
      </div>
    </div>
  );
}