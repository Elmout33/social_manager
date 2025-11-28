import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <main className="flex-1 p-6 md:p-10 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
