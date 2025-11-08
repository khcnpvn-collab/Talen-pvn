
import React from 'react';
import { Session } from '@supabase/supabase-js';

interface HeaderProps {
  session: Session;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ session, onLogout }) => {
  return (
    <header className="bg-white shadow-md">
      <div>
        <img src="https://pvn.vn/DataStore/2025/image/Banner/WEB_PVN_BANNER.png" alt="PVN Banner" className="w-full object-cover" />
      </div>
      <div className="bg-[#168a40]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="w-full max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full bg-gray-200 text-gray-900 placeholder-gray-500 rounded-md py-2 pl-10 pr-3 leading-5 border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#168a40] focus:ring-white"
                  placeholder="Tìm kiếm ứng dụng"
                  type="search"
                />
              </div>
            </div>
            <div className="flex items-center ml-6">
               <div className="flex items-center">
                  <span className="mr-4 text-white font-medium truncate" title={session.user.email}>{session.user.email}</span>
                  <img className="h-10 w-10 rounded-full" src={`https://i.pravatar.cc/150?u=${session.user.id}`} alt="User avatar" />
               </div>
              <button
                onClick={onLogout}
                className="ml-6 inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[#168a40] bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#168a40] focus:ring-white"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
