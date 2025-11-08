
import React from 'react';

interface PortalItemProps {
    title: string;
    icon: React.ReactNode;
    action?: { type: 'link'; href: string } | { type: 'modal' };
    openProblemStatementModal: () => void;
}

const PortalItem: React.FC<PortalItemProps> = ({ title, icon, action, openProblemStatementModal }) => {
    
    const handleClick = () => {
        if (action?.type === 'modal') {
            openProblemStatementModal();
        }
    };

    const content = (
        <div className="group flex flex-col items-center text-center space-y-4 cursor-pointer">
            <div className="w-24 h-24 flex items-center justify-center rounded-lg border-2 border-[#168a40] transition-all duration-300 group-hover:bg-[#168a40]/10 group-hover:scale-105">
                <div className="w-14 h-14 text-[#168a40] transition-all duration-300 group-hover:text-[#168a40]">
                    {icon}
                </div>
            </div>
            <h3 className="text-base font-medium text-gray-800 h-12 flex items-center justify-center">{title}</h3>
        </div>
    );

    if (action?.type === 'link') {
        return (
            <a href={action.href} target="_blank" rel="noopener noreferrer" className="no-underline">
                {content}
            </a>
        );
    }

    return <div onClick={handleClick}>{content}</div>;
};

export default PortalItem;