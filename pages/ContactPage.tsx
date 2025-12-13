import React from 'react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { MapPin, Phone, Mail } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Liên hệ' }]} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Liên hệ với chúng tôi</h1>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                <MapPin className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Địa chỉ</h3>
                <p className="text-gray-600">123 Đường ABC, Quận 1, TP. Hồ Chí Minh</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                <Phone className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Điện thoại</h3>
                <p className="text-gray-600">1900 1234</p>
                <p className="text-sm text-gray-500">Thứ 2 - CN: 8:00 - 21:00</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                <Mail className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Email</h3>
                <p className="text-gray-600">hotro@vietshop.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Gửi tin nhắn</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
              <input type="text" className="w-full border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" placeholder="Nhập họ tên của bạn" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="w-full border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" placeholder="example@email.com" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
              <textarea rows={4} className="w-full border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" placeholder="Bạn cần hỗ trợ gì?"></textarea>
            </div>
            <button className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition-colors">
              Gửi tin nhắn
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;