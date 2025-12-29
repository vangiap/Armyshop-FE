import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, CheckCircle, MapPin, User, Phone, AlertCircle, Smartphone, Loader2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { api } from '../services';

const CheckoutPage: React.FC = () => {
  const { cartItems, clearCart } = useShop();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    email: '',
    note: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer'>('cod');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState<string>('');

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal > 1000000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const validateForm = () => {
      const newErrors: {[key: string]: string} = {};
      if (!formData.name.trim()) newErrors.name = "Vui lòng nhập họ tên";
      if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
      else if (!/^\d{10,11}$/.test(formData.phone)) newErrors.phone = "Số điện thoại không hợp lệ";
      
      if (!formData.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ nhận hàng";
      if (!formData.city.trim()) newErrors.city = "Vui lòng nhập tỉnh/thành phố";
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
        const firstErrorField = document.querySelector('[aria-invalid="true"]');
        if (firstErrorField) (firstErrorField as HTMLElement).focus();
        return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      // Prepare order data
      const orderData = {
        customer_name: formData.name,
        customer_email: formData.email || `${formData.phone}@guest.armyshop.com`,
        customer_phone: formData.phone,
        shipping_address: {
          street: formData.address,
          city: formData.city,
          district: formData.district || undefined,
        },
        items: cartItems.map(item => ({
          product_id: item.id, // Always send product_id
          variant_id: item.variant_id || undefined, // Send variant_id if available
          quantity: item.quantity,
          color: item.selectedColor || undefined,
          size: item.selectedSize || undefined,
          selected_attributes: item.selectedAttributes || undefined,
        })),
        note: formData.note || undefined,
        payment_method: paymentMethod,
      };

      // Call API to create order
      const result = await api.createOrder(orderData);
      
      setOrderNumber(result.order_number);
      setIsSuccess(true);
      clearCart();
    } catch (error: any) {
      console.error('Checkout error:', error);
      setApiError(error.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 animate-bounce-in">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Đặt hàng thành công!</h2>
        <p className="text-gray-600 mb-8">
          Cảm ơn bạn đã mua sắm tại ArmyShop. Mã đơn hàng của bạn là <span className="font-mono font-bold text-gray-900">#{orderNumber}</span>.
          {paymentMethod === 'bank_transfer' 
            ? " Chúng tôi sẽ kiểm tra giao dịch và liên hệ xác nhận sớm nhất." 
            : " Chúng tôi sẽ liên hệ với bạn sớm để xác nhận đơn hàng."}
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Giỏ hàng trống</h2>
        <p className="text-gray-600 mb-8">Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
        <button
          onClick={() => navigate('/')}
          className="text-primary hover:underline flex items-center justify-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center text-gray-500 hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Tiếp tục mua sắm
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              Thông tin giao hàng
            </h2>
            
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 border rounded-lg focus:ring-primary focus:border-primary sm:text-sm py-2.5 ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                      placeholder="Nguyễn Văn A"
                      aria-invalid={!!errors.name}
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-xs text-red-500 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 border rounded-lg focus:ring-primary focus:border-primary sm:text-sm py-2.5 ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                      placeholder="0912 xxx xxx"
                      aria-invalid={!!errors.phone}
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-xs text-red-500 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email (Tùy chọn)</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full border-gray-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm py-2.5 px-3 border"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ nhận hàng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`block w-full border rounded-lg focus:ring-primary focus:border-primary sm:text-sm py-2.5 px-3 ${errors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                  placeholder="Số nhà, đường, phường/xã..."
                  aria-invalid={!!errors.address}
                />
                 {errors.address && <p className="mt-1 text-xs text-red-500 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      Tỉnh/Thành phố <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`block w-full border rounded-lg focus:ring-primary focus:border-primary sm:text-sm py-2.5 px-3 ${errors.city ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                    placeholder="VD: Hà Nội"
                    aria-invalid={!!errors.city}
                  />
                  {errors.city && <p className="mt-1 text-xs text-red-500 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{errors.city}</p>}
                </div>
                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="block w-full border-gray-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm py-2.5 px-3 border"
                    placeholder="VD: Cầu Giấy"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea
                  id="note"
                  name="note"
                  rows={3}
                  value={formData.note}
                  onChange={handleInputChange}
                  className="block w-full border-gray-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm px-3 py-2 border"
                  placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                />
              </div>
            </div>

            {apiError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{apiError}</p>
              </div>
            )}

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-primary" />
              Phương thức thanh toán
            </h2>
            
            <div className="space-y-3">
              <div 
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-green-50' : 'border-gray-200'}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <input 
                  id="cod" 
                  name="paymentMethod" 
                  type="radio" 
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="focus:ring-primary h-4 w-4 text-primary border-gray-300" 
                />
                <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-900 cursor-pointer flex-1">
                  Thanh toán khi nhận hàng (COD)
                </label>
                <Truck className="ml-auto h-5 w-5 text-gray-500" />
              </div>

              <div 
                className={`flex flex-col p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'bank_transfer' ? 'border-primary bg-green-50' : 'border-gray-200'}`}
                onClick={() => setPaymentMethod('bank_transfer')}
              >
                <div className="flex items-center w-full">
                    <input 
                    id="banking" 
                    name="paymentMethod" 
                    type="radio" 
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="focus:ring-primary h-4 w-4 text-primary border-gray-300" 
                    />
                    <label htmlFor="banking" className="ml-3 block text-sm font-medium text-gray-900 cursor-pointer flex-1">
                    Chuyển khoản ngân hàng (QR Code)
                    </label>
                    <Smartphone className="ml-auto h-5 w-5 text-gray-500" />
                </div>
                
                {/* QR Section displays when selected */}
                {paymentMethod === 'bank_transfer' && (
                    <div className="mt-4 pl-7 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                            <p className="text-sm text-gray-600 mb-2">Quét mã QR để thanh toán nhanh:</p>
                            <div className="inline-block p-2 bg-white rounded shadow-sm border border-gray-100">
                                {/* Using a placeholder QR service for demo */}
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ArmyShop_ORDER_${total}`} 
                                    alt="Payment QR Code" 
                                    className="w-32 h-32 md:w-40 md:h-40 mx-auto"
                                />
                            </div>
                            <div className="mt-3 text-sm">
                                <p className="font-bold text-gray-800">VIETCOMBANK</p>
                                <p className="font-mono text-gray-600">1900 888 888</p>
                                <p className="text-xs text-gray-500 mt-1">Nội dung: <span className="font-bold text-primary">MUA HANG SDT {formData.phone || '...'}</span></p>
                            </div>
                        </div>
                    </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Đơn hàng của bạn</h2>
            
            <ul className="divide-y divide-gray-200 mb-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item, idx) => (
                <li key={`${item.id}-${idx}`} className="py-4 flex">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover object-center" />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-sm font-medium text-gray-900">
                        <h3 className="line-clamp-2">{item.title}</h3>
                        <p className="ml-4">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {item.selectedColor && <p className="text-xs text-gray-500 bg-gray-100 px-1.5 rounded">Màu: {item.selectedColor}</p>}
                        {item.selectedSize && <p className="text-xs text-gray-500 bg-gray-100 px-1.5 rounded">Size: {item.selectedSize}</p>}
                        {item.selectedAttributes && Object.entries(item.selectedAttributes).map(([name, value]) => (
                          <p key={name} className="text-xs text-gray-500 bg-gray-100 px-1.5 rounded">{name}: {value}</p>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <p className="text-gray-500">SL: {item.quantity}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <p>Tạm tính</p>
                <p>{formatCurrency(subtotal)}</p>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <p>Phí vận chuyển</p>
                <p>{shippingFee === 0 ? <span className="text-green-600 font-medium">Miễn phí</span> : formatCurrency(shippingFee)}</p>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
                <p>Tổng cộng</p>
                <p className="text-xl text-primary">{formatCurrency(total)}</p>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full mt-6 bg-primary border border-transparent rounded-lg shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                paymentMethod === 'bank_transfer' ? 'Tôi đã chuyển khoản' : `Đặt hàng (${formatCurrency(total)})`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;