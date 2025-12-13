import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { api } from '../services';
import { Loader2, Star, CheckCircle, User, Send, Minus, Plus, AlertTriangle } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { useShop } from '../context/ShopContext';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000') as string;

// Helper to get full image URL
const getImageUrl = (imagePath: string | undefined | null): string => {
  if (!imagePath) return '';
  // If already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // Otherwise, prepend API_URL
  return `${API_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useShop();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Helper function to check if a variant matches a specific attribute
  const variantHasAttribute = (variant: any, attrType: 'color' | 'size' | 'other', value: string, attrName?: string): boolean => {
    if (!variant.attributes || !Array.isArray(variant.attributes)) return false;
    return variant.attributes.some((a: any) => {
      const name = a.name?.toLowerCase() || '';
      if (attrType === 'color') {
        return (name.includes('color') || name.includes('màu')) && a.value === value;
      } else if (attrType === 'size') {
        return (name.includes('size') || name.includes('kích')) && a.value === value;
      } else {
        // For other attributes, match by display name
        return a.name === attrName && a.value === value;
      }
    });
  };

  // Find matching variant based on selected attributes - match ALL selected attributes
  const findMatchingVariant = useCallback(() => {
    if (!product?.variants?.length) return null;
    
    return product.variants.find(v => {
      if (!v.attributes || !Array.isArray(v.attributes)) return false;
      
      // Check color match if color is selected
      const colorMatch = !selectedColor || variantHasAttribute(v, 'color', selectedColor);
      if (!colorMatch) return false;
      
      // Check size match if size is selected
      const sizeMatch = !selectedSize || variantHasAttribute(v, 'size', selectedSize);
      if (!sizeMatch) return false;
      
      // Check all other selected attributes match
      const otherAttrsMatch = Object.entries(selectedAttributes).every(([name, value]) =>
        variantHasAttribute(v, 'other', value, name)
      );
      if (!otherAttrsMatch) return false;
      
      // Count how many of the variant's attributes match our selection
      // This ensures we find the most specific variant
      let matchCount = 0;
      if (selectedColor) matchCount++;
      if (selectedSize) matchCount++;
      matchCount += Object.keys(selectedAttributes).length;
      
      // Variant should have at least as many attributes as we selected
      return v.attributes.length >= matchCount;
    });
  }, [product, selectedColor, selectedSize, selectedAttributes]);

  // Update image when variant selection changes
  useEffect(() => {
    if (!product) return;
    
    const matchingVariant = findMatchingVariant();
    console.log('Selected variant:', matchingVariant); // Debug
    
    if (matchingVariant?.image) {
      // If variant has specific image, show it
      const variantImageUrl = getImageUrl(matchingVariant.image);
      console.log('Setting variant image:', variantImageUrl); // Debug
      setActiveImage(variantImageUrl);
    } else {
      // Fallback to main product image
      setActiveImage(getImageUrl(product.image));
    }
  }, [findMatchingVariant, product]);

  // Helper to get available stock based on ALL selected attributes (exact variant match)
  const getAvailableStock = (): number => {
    if (!product) return 0;
    
    if (product.variants && product.variants.length > 0) {
      const matchingVariant = product.variants.find(v => {
        // Must match ALL selected attributes
        const colorMatch = !selectedColor || variantHasAttribute(v, 'color', selectedColor);
        const sizeMatch = !selectedSize || variantHasAttribute(v, 'size', selectedSize);
        const otherAttrsMatch = Object.entries(selectedAttributes).every(([name, value]) =>
          variantHasAttribute(v, 'other', value, name)
        );
        return colorMatch && sizeMatch && otherAttrsMatch;
      });
      return matchingVariant?.stock ?? 0;
    }
    
    return product.stock_quantity ?? 999;
  };

  // Get stock for a specific color option (considering all OTHER selected attributes)
  const getStockForColor = (color: string): number => {
    if (!product?.variants?.length) return product?.stock_quantity ?? 999;
    
    const matchingVariants = product.variants.filter(v => {
      const colorMatch = variantHasAttribute(v, 'color', color);
      // Consider selected size
      const sizeMatch = !selectedSize || variantHasAttribute(v, 'size', selectedSize);
      // Consider all other selected attributes
      const otherAttrsMatch = Object.entries(selectedAttributes).every(([name, value]) =>
        variantHasAttribute(v, 'other', value, name)
      );
      return colorMatch && sizeMatch && otherAttrsMatch;
    });
    return matchingVariants.reduce((sum, v) => sum + (v.stock ?? 0), 0);
  };

  // Get stock for a specific size option (considering all OTHER selected attributes)
  const getStockForSize = (size: string): number => {
    if (!product?.variants?.length) return product?.stock_quantity ?? 999;
    
    const matchingVariants = product.variants.filter(v => {
      const sizeMatch = variantHasAttribute(v, 'size', size);
      // Consider selected color
      const colorMatch = !selectedColor || variantHasAttribute(v, 'color', selectedColor);
      // Consider all other selected attributes
      const otherAttrsMatch = Object.entries(selectedAttributes).every(([name, value]) =>
        variantHasAttribute(v, 'other', value, name)
      );
      return sizeMatch && colorMatch && otherAttrsMatch;
    });
    return matchingVariants.reduce((sum, v) => sum + (v.stock ?? 0), 0);
  };

  // Get stock for a specific attribute value (considering all OTHER selected attributes)
  const getStockForAttribute = (attrName: string, value: string): number => {
    if (!product?.variants?.length) return product?.stock_quantity ?? 999;
    
    const matchingVariants = product.variants.filter(v => {
      // Must have this specific attribute value
      const attrMatch = variantHasAttribute(v, 'other', value, attrName);
      // Consider selected color
      const colorMatch = !selectedColor || variantHasAttribute(v, 'color', selectedColor);
      // Consider selected size
      const sizeMatch = !selectedSize || variantHasAttribute(v, 'size', selectedSize);
      // Consider all OTHER selected attributes (excluding current one being checked)
      const otherAttrsMatch = Object.entries(selectedAttributes)
        .filter(([name]) => name !== attrName) // Exclude current attribute
        .every(([name, val]) => variantHasAttribute(v, 'other', val, name));
      return attrMatch && colorMatch && sizeMatch && otherAttrsMatch;
    });
    return matchingVariants.reduce((sum, v) => sum + (v.stock ?? 0), 0);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await api.getProductById(parseInt(id));
        if (data) {
          setProduct(data);
          setActiveImage(getImageUrl(data.image)); 
          if (data.colors?.length) setSelectedColor(data.colors[0]);
          if (data.sizes?.length) setSelectedSize(data.sizes[0]);
          setQuantity(1); // Reset quantity when product changes
          setError(null);
          
          // Initialize other attributes with first value
          if (data.attributes) {
            const initialAttrs: Record<string, string> = {};
            Object.entries(data.attributes).forEach(([name, values]) => {
              if (values.length > 0) {
                initialAttrs[name] = values[0];
              }
            });
            setSelectedAttributes(initialAttrs);
          }

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
    
    // Check other required attributes
    if (product.attributes) {
      for (const [attrName, values] of Object.entries(product.attributes)) {
        if (values.length > 0 && !selectedAttributes[attrName]) {
          setError(`Vui lòng chọn ${attrName}`);
          return;
        }
      }
    }

    // Check stock
    const availableStock = getAvailableStock();
    if (quantity > availableStock) {
      setError(`Chỉ còn ${availableStock} sản phẩm trong kho`);
      return;
    }

    setError(null);
    // Add item to cart with selected quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedColor, selectedSize, Object.keys(selectedAttributes).length > 0 ? selectedAttributes : undefined);
    }
    setQuantity(1); // Reset quantity after adding
  };

  // Build images list including variant-specific images (must be before early returns)
  const images = product?.images && product.images.length > 0 ? product.images : (product?.image ? [product.image] : []);
  const allImages = useMemo(() => {
    if (!product) return [];
    const imageSet = new Set<string>();
    
    // Add main product images
    images.forEach(img => {
      if (img) imageSet.add(getImageUrl(img));
    });
    
    // Add variant images to gallery
    if (product.variants) {
      product.variants.forEach(v => {
        if (v.image) {
          imageSet.add(getImageUrl(v.image));
        }
      });
    }
    
    return Array.from(imageSet).filter(img => img); // Filter out empty strings
  }, [product, images]);

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
              {allImages.map((img, idx) => (
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
                    {product.colors.map(color => {
                      const colorStock = getStockForColor(color);
                      const isOutOfStock = colorStock === 0;
                      return (
                        <button
                          key={color}
                          onClick={() => {
                            if (!isOutOfStock) {
                              setSelectedColor(color);
                              setQuantity(1);
                              setError(null);
                            }
                          }}
                          disabled={isOutOfStock}
                          className={`relative px-4 py-2 border rounded-md text-sm font-medium transition-all ${
                            isOutOfStock 
                              ? 'border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed line-through'
                              : selectedColor === color
                                ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                : 'border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {color}
                          {product.variants && product.variants.length > 0 && (
                            <span className={`ml-2 text-xs ${
                              isOutOfStock ? 'text-red-400' : colorStock < 5 ? 'text-amber-500' : 'text-gray-400'
                            }`}>
                              ({isOutOfStock ? 'Hết' : colorStock})
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Kích thước: <span className="text-gray-500 font-normal">{selectedSize}</span></h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => {
                      const sizeStock = getStockForSize(size);
                      const isOutOfStock = sizeStock === 0;
                      return (
                        <button
                          key={size}
                          onClick={() => {
                            if (!isOutOfStock) {
                              setSelectedSize(size);
                              setQuantity(1);
                              setError(null);
                            }
                          }}
                          disabled={isOutOfStock}
                          className={`relative min-w-[3rem] px-3 py-2 border rounded-md text-sm font-medium transition-all ${
                            isOutOfStock
                              ? 'border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed line-through'
                              : selectedSize === size
                                ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                : 'border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {size}
                          {product.variants && product.variants.length > 0 && (
                            <span className={`ml-1 text-xs ${
                              isOutOfStock ? 'text-red-400' : sizeStock < 5 ? 'text-amber-500' : 'text-gray-400'
                            }`}>
                              ({isOutOfStock ? 'Hết' : sizeStock})
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Other attributes (e.g., Binh chủng) */}
              {product.attributes && Object.keys(product.attributes).length > 0 && (
                Object.entries(product.attributes).map(([attrName, values]) => (
                  <div key={attrName}>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">{attrName}: <span className="text-gray-500 font-normal">{selectedAttributes[attrName]}</span></h3>
                    <div className="flex flex-wrap gap-2">
                      {values.map(value => {
                        const attrStock = getStockForAttribute(attrName, value);
                        const isOutOfStock = attrStock === 0;
                        return (
                          <button
                            key={value}
                            onClick={() => {
                              if (!isOutOfStock) {
                                setSelectedAttributes(prev => ({ ...prev, [attrName]: value }));
                                setQuantity(1);
                                setError(null);
                              }
                            }}
                            disabled={isOutOfStock}
                            className={`px-4 py-2 border rounded-md text-sm font-medium transition-all ${
                              isOutOfStock
                                ? 'border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed line-through'
                                : selectedAttributes[attrName] === value
                                  ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            {value}
                            {product.variants && product.variants.length > 0 && (
                              <span className={`ml-2 text-xs ${
                                isOutOfStock ? 'text-red-400' : attrStock < 5 ? 'text-amber-500' : 'text-gray-400'
                              }`}>
                                ({isOutOfStock ? 'Hết' : attrStock})
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {error && (
                <div className="mb-4 text-red-600 text-sm flex items-center bg-red-50 p-3 rounded-lg">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></div>
                    {error}
                </div>
            )}

            <div className="mt-auto">
              {product.in_stock === false || product.stock_quantity === 0 ? (
                <>
                  <button
                    disabled
                    className="w-full sm:w-auto px-10 py-4 bg-gray-300 text-gray-500 text-lg font-bold rounded-xl cursor-not-allowed flex items-center justify-center"
                  >
                    Hết hàng
                  </button>
                  <div className="mt-6 flex items-center text-sm text-red-700 bg-red-50 p-3 rounded-lg inline-flex">
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Sản phẩm tạm hết hàng - Vui lòng quay lại sau</span>
                  </div>
                </>
              ) : (
                <>
                  {/* Quantity Selector */}
                  <div className="mb-6">
                    <label className="text-sm font-medium text-gray-900 mb-2 block">Số lượng:</label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-300 rounded-lg shadow-sm">
                        <button 
                          onClick={() => setQuantity(q => Math.max(1, q - 1))}
                          className="p-3 hover:bg-gray-50 text-gray-600 disabled:opacity-50 transition-colors rounded-l-lg"
                          disabled={quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          max={getAvailableStock()}
                          value={quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            const max = getAvailableStock();
                            setQuantity(Math.min(Math.max(1, val), max));
                          }}
                          className="w-16 text-center font-medium text-gray-900 border-0 focus:ring-0"
                        />
                        <button 
                          onClick={() => setQuantity(q => Math.min(q + 1, getAvailableStock()))}
                          className="p-3 hover:bg-gray-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-lg"
                          disabled={quantity >= getAvailableStock()}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      {getAvailableStock() < 999 && (
                        <span className={`text-sm ${quantity >= getAvailableStock() ? 'text-amber-600' : 'text-gray-500'}`}>
                          {quantity >= getAvailableStock() && <AlertTriangle className="inline h-4 w-4 mr-1" />}
                          Còn {getAvailableStock()} sản phẩm
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCartClick}
                    disabled={getAvailableStock() === 0}
                    className={`w-full sm:w-auto px-10 py-4 text-lg font-bold rounded-xl focus:outline-none focus:ring-4 transition-all shadow-lg flex items-center justify-center transform active:scale-[0.98] ${
                      getAvailableStock() === 0 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-emerald-700 focus:ring-emerald-200 hover:shadow-xl'
                    }`}
                  >
                    {getAvailableStock() === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                  </button>
                  <div className={`mt-6 flex items-center text-sm p-3 rounded-lg inline-flex ${
                    getAvailableStock() === 0 
                      ? 'text-red-700 bg-red-50'
                      : getAvailableStock() < 10 
                        ? 'text-amber-700 bg-amber-50' 
                        : 'text-green-700 bg-green-50'
                  }`}>
                    {getAvailableStock() === 0 ? (
                      <>
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        <span>Biến thể này đã hết hàng - Vui lòng chọn biến thể khác</span>
                      </>
                    ) : getAvailableStock() < 10 ? (
                      <>
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        <span>Chỉ còn {getAvailableStock()} sản phẩm cho biến thể này - Đặt ngay!</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span>Còn {getAvailableStock()} sản phẩm - Giao hàng miễn phí cho đơn từ 1tr</span>
                      </>
                    )}
                  </div>
                </>
              )}
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