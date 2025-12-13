import { Truck, RefreshCw, ShieldCheck, Headphones } from 'lucide-react';

const ServiceFeatures = () => {
  const features = [
    { icon: <Truck className="w-8 h-8 text-primary" />, title: "Miễn phí vận chuyển", desc: "Cho đơn hàng trên 1 triệu đồng" },
    { icon: <RefreshCw className="w-8 h-8 text-primary" />, title: "Đổi trả dễ dàng", desc: "Trong vòng 7 ngày" },
    { icon: <ShieldCheck className="w-8 h-8 text-primary" />, title: "Thanh toán an toàn", desc: "Bảo mật thông tin tuyệt đối" },
    { icon: <Headphones className="w-8 h-8 text-primary" />, title: "Hỗ trợ 24/7", desc: "Hotline hỗ trợ khách hàng" },
  ];

  return (
    <div className="bg-white py-10 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center p-4 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 mr-4 bg-white p-3 rounded-full shadow-sm">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceFeatures;