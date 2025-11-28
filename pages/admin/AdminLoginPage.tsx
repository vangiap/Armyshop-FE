
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded credentials for demo
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('admin_token', 'fake-jwt-token');
      navigate('/admin');
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Đăng nhập Quản trị</h1>
          <p className="text-gray-500 mt-2">Vui lòng đăng nhập để tiếp tục</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-10 border border-gray-300 rounded-lg py-2.5 focus:ring-primary focus:border-primary"
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 border border-gray-300 rounded-lg py-2.5 focus:ring-primary focus:border-primary"
                placeholder="••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition-colors shadow-md"
          >
            Đăng nhập
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-400">
            <p>Demo: admin / admin</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
