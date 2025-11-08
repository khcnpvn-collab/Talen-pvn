
import React, { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';
import Header from './Header';
import PortalGrid from './PortalGrid';
import ProblemStatementModal from './ProblemStatementModal';
import DocumentsPage from './DocumentsPage';
import AdminPage from './AdminPage';

type Page = 'grid' | 'documents' | 'admin';

interface MainPortalProps {
  session: Session;
}

const MainPortal: React.FC<MainPortalProps> = ({ session }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<Page>('grid');

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'documents':
        return <DocumentsPage session={session} onBack={() => navigateTo('grid')} />;
      case 'admin':
        return <AdminPage onBack={() => navigateTo('grid')} />;
      case 'grid':
      default:
        return <PortalGrid session={session} openProblemStatementModal={openModal} onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header session={session} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {renderContent()}
      </main>
      {isModalOpen && <ProblemStatementModal session={session} onClose={closeModal} />}
    </div>
  );
};

export default MainPortal;