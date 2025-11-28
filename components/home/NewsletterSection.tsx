import { Mail, ArrowRight } from 'lucide-react';

const NewsletterSection = () => (
  <div className="bg-primary py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 border border-white/20">
        <div className="text-white lg:w-1/2">
          <div className="flex items-center mb-4">
             <div className="p-3 bg-white/20 rounded-full mr-4">
                <Mail className="w-6 h-6 text-white" />
             </div>
             <h2 className="text-3xl font-bold">Đăng ký nhận tin</h2>
          </div>
          <p className="text-emerald-100 text-lg">
            Nhận thông báo về sản phẩm mới, khuyến mãi độc quyền và voucher giảm giá 10% cho đơn hàng đầu tiên.
          </p>
        </div>
        <div className="w-full lg:w-1/2">
          <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Nhập địa chỉ email của bạn" 
              className="flex-1 px-6 py-4 rounded-full border-0 focus:ring-2 focus:ring-yellow-400 text-gray-900 placeholder-gray-500 shadow-lg"
            />
            <button className="px-8 py-4 bg-yellow-400 text-yellow-900 font-bold rounded-full hover:bg-yellow-300 transition-colors shadow-lg flex items-center justify-center whitespace-nowrap">
              Đăng ký <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
);

export default NewsletterSection;