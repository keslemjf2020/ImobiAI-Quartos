
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'new-contract', label: 'Novo Contrato', icon: '📝' },
    { id: 'payments', label: 'Pagamentos', icon: '💰' },
    { id: 'inspection', label: 'Vistorias', icon: '📋' },
    { id: 'ai-chat', label: 'Assistente IA', icon: '🤖' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col no-print">
        <div className="p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-indigo-400">🏠</span> ImobiAI
          </h1>
          <p className="text-xs text-indigo-300 mt-1 uppercase tracking-wider font-semibold">Gestão de Quartos</p>
        </div>
        
        <nav className="flex-1 mt-4 px-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id 
                ? 'bg-indigo-700 text-white shadow-lg' 
                : 'text-indigo-100 hover:bg-indigo-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 bg-indigo-950 text-xs text-center border-t border-indigo-800">
          <p>© 2024 ImobiManager AI</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
