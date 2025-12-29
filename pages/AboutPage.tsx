import React from 'react';
import Breadcrumbs from '../components/common/Breadcrumbs';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Giới thiệu' }]} />
      <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Về ArmyShop</h1>
        <div className="prose prose-lg text-gray-600">
          <p className="mb-4">
            Chào mừng bạn đến với <strong>ArmyShop</strong> - điểm đến tin cậy cho những tín đồ thời trang và công nghệ. Được thành lập vào năm 2023, chúng tôi cam kết mang đến những sản phẩm chất lượng cao với mức giá hợp lý nhất cho người tiêu dùng Việt Nam.
          </p>
          <p className="mb-4">
            Sứ mệnh của chúng tôi là đơn giản hóa trải nghiệm mua sắm trực tuyến, xóa bỏ mọi rào cản về khoảng cách và lo ngại về chất lượng.
          </p>
          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Tại sao chọn chúng tôi?</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Sản phẩm chính hãng 100%.</li>
            <li>Chính sách đổi trả minh bạch trong 7 ngày.</li>
            <li>Giao hàng hỏa tốc nội thành.</li>
            <li>Đội ngũ tư vấn nhiệt tình, chuyên nghiệp.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;