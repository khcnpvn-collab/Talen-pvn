
import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import TalentDefinitionModal from './TalentDefinitionModal';
import TalentTicker from './TalentTicker';

const HexagonImage: React.FC<{ src: string; label: string }> = ({ src, label }) => (
  <div className="relative group w-48 h-56 mx-auto">
    <div
      className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
      style={{ 
        backgroundImage: `url(${src})`,
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
      }}
    ></div>
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ 
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
      }}
    >
      <div className="absolute inset-0 bg-black opacity-30 group-hover:opacity-10 transition-opacity duration-300"></div>
      <span className="relative z-10 px-3 py-1 text-xs font-semibold text-white text-center tracking-wide">
        {label}
      </span>
    </div>
  </div>
);

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="min-h-screen flex">
        {/* Left Pane */}
        <div className="hidden lg:flex w-3/5 bg-[#e0e7ee] items-center justify-center p-12 relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 w-1/2 h-full bg-white -skew-x-12 -ml-20"
            style={{ zIndex: 0 }}
          ></div>
          <div className="flex flex-col space-y-8 z-10">
            <div className="flex items-center space-x-8">
              <HexagonImage src="https://50years.pvn.vn/images/exhibition-2.png" label="CÔNG NGHIỆP" />
              <div className="mt-24">
                <HexagonImage src="https://50years.pvn.vn/images/exhibition-1.png" label="NĂNG LƯỢNG" />
              </div>
            </div>
            <div className="flex justify-center -mt-12">
              <HexagonImage src="https://50years.pvn.vn/images/exhibition-3.png" label="DỊCH VỤ CHẤT LƯỢNG CAO" />
            </div>
          </div>
        </div>

        {/* Right Pane */}
        <div className="w-full lg:w-2/5 bg-[#004d25] flex flex-col justify-center p-8 sm:p-12 text-white">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-12">
              <img
                src="https://50years.pvn.vn/images/logo-footer.png"
                alt="PetroVietnam Logo"
                className="h-24 mx-auto mb-4"
              />
              <h1 className="font-serif text-5xl font-bold tracking-wider text-gray-200 mb-3">
                THANH NIÊN
              </h1>
              <h2
                className="font-serif text-6xl font-black text-amber-500 mt-3"
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
              >
                XUẤT SẮC
              </h2>
              <p className="mt-4 text-xl text-gray-400 tracking-widest">
                PETROVIETNAM 2025
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full bg-white/10 border border-white/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full bg-white/10 border border-white/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              
              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="pt-4">
                <TalentTicker />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 focus:ring-offset-gray-800 disabled:bg-amber-800"
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </form>

            <div className="text-center mt-8">
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-sm text-gray-400 hover:text-white hover:underline"
              >
                Tìm hiểu quan niệm về 'Nhân tài' qua các thời kỳ
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && <TalentDefinitionModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default LoginPage;
