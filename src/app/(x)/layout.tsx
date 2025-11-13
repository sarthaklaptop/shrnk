import { SidebarDemo } from '@/components/Sidebar';
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {

  // const status = useProtectedRoute();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar - fixed on left */}
        <div className="flex-shrink-0">
          <SidebarDemo />
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}