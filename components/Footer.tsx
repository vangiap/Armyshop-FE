import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { Facebook, MessageCircle, Instagram, Youtube, ShoppingBag } from 'lucide-react';

const Footer: React.FC = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <h4 className="text-xl font-extrabold text-primary mb-6 flex items-center">
              {settings.site_logo ? (
                <img src={settings.site_logo} alt={settings.site_name} className="h-8 mr-2" />
              ) : (
                <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center mr-2">
                  {settings.site_name.charAt(0)}
                </div>
              )}
              {settings.site_name}
            </h4>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              {settings.site_description}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {settings.social_facebook && (
                <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" 
                   className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-500 hover:text-white transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.social_zalo && (
                <a href={settings.social_zalo} target="_blank" rel="noopener noreferrer"
                   className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-400 hover:text-white transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
              {settings.social_tiktok && (
                <a href={settings.social_tiktok} target="_blank" rel="noopener noreferrer"
                   className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              )}
              {settings.social_instagram && (
                <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer"
                   className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.social_youtube && (
                <a href={settings.social_youtube} target="_blank" rel="noopener noreferrer"
                   className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-red-500 hover:text-white transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {settings.social_shopee && (
                <a href={settings.social_shopee} target="_blank" rel="noopener noreferrer"
                   className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-orange-500 hover:text-white transition-colors">
                  <ShoppingBag className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase text-sm tracking-wider">Hỗ trợ khách hàng</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link to="/about" className="hover:text-primary transition-colors">Trung tâm trợ giúp</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">Hướng dẫn mua hàng</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">Chính sách đổi trả</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase text-sm tracking-wider">Về chúng tôi</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link to="/about" className="hover:text-primary transition-colors">Giới thiệu {settings.site_name}</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Liên hệ</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">Điều khoản sử dụng</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase text-sm tracking-wider">Liên hệ</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              {settings.contact_address && (
                <li className="flex items-start">
                  <span className="font-medium text-gray-900 mr-2">Địa chỉ:</span>
                  {settings.contact_address}
                </li>
              )}
              {settings.contact_hotline && (
                <li className="flex items-start">
                  <span className="font-medium text-gray-900 mr-2">Hotline:</span>
                  <a href={`tel:${settings.contact_hotline.replace(/\s/g, '')}`} className="hover:text-primary">
                    {settings.contact_hotline}
                  </a>
                </li>
              )}
              {settings.contact_phone && (
                <li className="flex items-start">
                  <span className="font-medium text-gray-900 mr-2">Điện thoại:</span>
                  <a href={`tel:${settings.contact_phone.replace(/\s/g, '')}`} className="hover:text-primary">
                    {settings.contact_phone}
                  </a>
                </li>
              )}
              {settings.contact_email && (
                <li className="flex items-start">
                  <span className="font-medium text-gray-900 mr-2">Email:</span>
                  <a href={`mailto:${settings.contact_email}`} className="hover:text-primary">
                    {settings.contact_email}
                  </a>
                </li>
              )}
              {settings.contact_working_hours && (
                <li className="flex items-start">
                  <span className="font-medium text-gray-900 mr-2">Giờ làm việc:</span>
                  {settings.contact_working_hours}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} {settings.site_name}. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/about" className="hover:text-gray-600">Chính sách bảo mật</Link>
            <Link to="/about" className="hover:text-gray-600">Điều khoản dịch vụ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;