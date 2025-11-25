import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { api } from '../services/fakeApi';
import { Loader2, Star, CheckCircle, User, Send } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { useShop } from '../context/ShopContext';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useShop();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await api.getProductById(parseInt(id));
        if (data) {
          setProduct(data);
          setActiveImage(data.image); 
          if (data.colors?.length) setSelectedColor(data.colors[0]);
          if (data.sizes?.length) setSelectedSize(data.sizes[0]);

          const related = await api.getRelatedProducts(data.category, data.id);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCartClick = () => {
    if (!product) return;
    
    if (product.colors && product.colors.length > 0 && !selectedColor) {
        setError('Vui lòng chọn màu sắc');
        return;
    }
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
        setError('Vui lòng chọn kích thước');
        return;
    }

    setError(null);
    addToCart(product, selectedColor, selectedSize);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[calc(100vh-64px)]">
      <Loader2 className="h-12 w-12 text-primary animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-gray-900">Không tìm thấy sản phẩm</h2>
      <button onClick={() => navigate('/')} className="mt-4 text-primary hover:underline">Quay lại trang chủ</button>
    </div>
  );

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: product.category.replace(/-/g, ' '), path: '/' },
        { label: product.title }
      ]} />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
          
          {/* Gallery Section */}
          <div className="p-8 bg-gray-50 flex flex-col items-center">
            <div className="w-full aspect-square bg-white rounded-xl overflow-hidden mb-4 shadow-sm relative group">
              <img 
                src={activeImage} 
                alt={product.title} 
                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto w-full pb-2 scrollbar-hide">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === img ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Info Section */}
          <div className="p-8 flex flex-col justify-center">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
              {product.category.replace(/-/g, ' ')}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
            
            <div className="flex items-center mb-6">
               <div className="flex text-yellow-400">
                 {[...Array(5)].map((_, i) => (
                   <Star key={i} className={`h-5 w-5 ${i < Math.round(product.rating.rate) ? 'fill-current' : 'text-gray-300'}`} />
                 ))}
               </div>
               <span className="ml-2 text-sm text-gray-600">
                 {product.rating.rate} ({product.rating.count} đánh giá)
               </span>
            </div>

            <p className="text-4xl font-bold text-gray-900 mb-6">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
            </p>

            <div className="prose prose-sm text-gray-500 mb-8">
              <p>{product.description}</p>
            </div>

            {/* Attributes Selection */}
            <div className="space-y-6 mb-8">
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Màu sắc: <span className="text-gray-500 font-normal">{selectedColor}</span></h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border rounded-md text-sm font-medium transition-all ${
                          selectedColor === color
                            ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Kích thước: <span className="text-gray-500 font-normal">{selectedSize}</span></h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[3rem] px-3 py-2 border rounded-md text-sm font-medium transition-all ${
                          selectedSize === size
                            ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {error && (
                <div className="mb-4 text-red-600 text-sm flex items-center bg-red-50 p-3 rounded-lg">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></div>
                    {error}
                </div>
            )}

            <div className="mt-auto">
              <button
                onClick={handleAddToCartClick}
                className="w-full sm:w-auto px-10 py-4 bg-primary text-white text-lg font-bold rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-all shadow-lg hover:shadow-xl flex items-center justify-center transform active:scale-[0.98]"
              >
                Thêm vào giỏ hàng
              </button>
              <div className="mt-6 flex items-center text-sm text-green-700 bg-green-50 p-3 rounded-lg inline-flex">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Còn hàng - Giao hàng miễn phí cho đơn từ 1tr</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Đánh giá & Bình luận</h2>
        
        {/* Fake Review Input */}
        <div className="mb-8 bg-gray-50 p-6 rounded-xl">
           <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                 <User className="w-6 h-6 text-gray-500"/>
              </div>
              <div className="flex-1">
                 <textarea 
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-primary focus:border-primary" 
                    rows={2} 
                    placeholder="Viết đánh giá của bạn..." 
                 ></textarea>
                 <div className="flex justify-between items-center mt-2">
                    <div className="flex text-gray-300 hover:text-yellow-400 cursor-pointer transition-colors">
                        {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5" />)}
                    </div>
                    <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-emerald-700 flex items-center">
                       Gửi đánh giá <Send className="w-3 h-3 ml-2"/>
                    </button>
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map(review => (
                 <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                    <div className="flex items-center mb-2">
                       <span className="font-bold text-gray-900 mr-2">{review.user}</span>
                       <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <div className="flex text-yellow-400 mb-2">
                       {[...Array(5)].map((_, i) => (
                           <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                       ))}
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                 </div>
              ))
           ) : (
             <p className="text-gray-500 italic text-center">Chưa có đánh giá nào cho sản phẩm này.</p>
           )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(related => (
              <ProductCard
                key={related.id}
                product={related}
                onAddToCart={(p) => {
                    const defaultColor = p.colors?.[0];
                    const defaultSize = p.sizes?.[0];
                    addToCart(p, defaultColor, defaultSize);
                }}
                onClick={(id) => navigate(`/product/${id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;