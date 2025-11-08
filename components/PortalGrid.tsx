

import React from 'react';
import PortalItem from './PortalItem';
import { 
    NotebookIcon, CloudIcon, SparkleIcon, DocumentIcon 
} from './icons/Icons';

interface PortalGridProps {
    openProblemStatementModal: () => void;
}

// FIX: Add explicit type definition for portal items to ensure type safety, fixing an issue where `action.type` was inferred as `string` instead of a literal type.
interface PortalItemType {
    id: number;
    title: string;
    icon: React.ReactNode;
    action?: { type: 'link'; href: string } | { type: 'modal' };
}

const portalItems: PortalItemType[] = [
    { 
      id: 9, 
      title: 'Notebook LLM Public', 
      icon: <NotebookIcon />,
      action: { type: 'link', href: 'https://colab.research.google.com/' }
    },
    { 
      id: 10, 
      title: 'ChatGPTs', 
      icon: <CloudIcon />,
      action: { type: 'link', href: 'https://chat.openai.com/' }
    },
    { 
      id: 11, 
      title: 'Hướng dẫn nhập Problem/Statement', 
      icon: <SparkleIcon />,
      action: { type: 'modal' }
    },
    { id: 12, title: 'Văn bản và tài liệu', icon: <DocumentIcon /> },
];

const PortalGrid: React.FC<PortalGridProps> = ({ openProblemStatementModal }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
            {portalItems.map(item => (
                <PortalItem 
                    key={item.id} 
                    title={item.title} 
                    icon={item.icon}
                    action={item.action}
                    openProblemStatementModal={openProblemStatementModal}
                />
            ))}
        </div>
    );
};

export default PortalGrid;