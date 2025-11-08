import React, { useState } from 'react';
import Header from './Header';
import PortalGrid from './PortalGrid';
import ProblemStatementModal from './ProblemStatementModal';

interface MainPortalProps {
  onLogout: () => void;
}

const MainPortal: React.FC<MainPortalProps> = ({ onLogout }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  return (
    <div className="min-h-screen bg-white">
      <Header onLogout={onLogout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PortalGrid openProblemStatementModal={openModal} />
      </main>
      {isModalOpen && <ProblemStatementModal onClose={closeModal} />}
    </div>
  );
};

export default MainPortal;