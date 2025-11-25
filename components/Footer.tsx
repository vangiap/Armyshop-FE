import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <h4 className="text-xl font-extrabold text-primary mb-6 flex items-center">
              <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center mr-2">V</div>
              VietShop
            </h4>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Nền tảng mua sắm trực tuyến hàng đầu với sứ mệnh mang lại trải nghiệm mua sắm tuyệt vời nhất cho người Việt.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase text-sm tracking-wider">Hỗ trợ khách hàng</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a href="#" className="hover:text-primary transition-colors">Trung tâm trợ giúp</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Hướng dẫn mua hàng</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Chính sách đổi trả</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase text-sm tracking-wider">Về chúng tôi</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a href="#" className="hover:text-primary transition-colors">Giới thiệu VietShop</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Tuyển dụng</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Điều khoản sử dụng</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase text-sm tracking-wider">Liên hệ</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="font-medium text-gray-900 mr-2">Địa chỉ:</span>
                123 Đường ABC, Quận 1, TP.HCM
              </li>
              <li className="flex items-start">
                <span className="font-medium text-gray-900 mr-2">Hotline:</span>
                1900 1234
              </li>
              <li className="flex items-start">
                <span className="font-medium text-gray-900 mr-2">Email:</span>
                hotro@vietshop.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} VietShop. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-600">Privacy Policy</a>
            <a href="#" className="hover:text-gray-600">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;