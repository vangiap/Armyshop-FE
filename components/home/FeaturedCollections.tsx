
import React, { useEffect, useState, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Collection } from '../../types';
import { api } from '../../services';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000') as string;

// Helper to get full image URL
const getImageUrl = (path: string | null): string | null => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/')) return `${API_URL}${path}`;
  return path;
};

// Placeholder image
const placeholderImage = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80';

// Flattened image structure for lightbox navigation

const FeaturedCollections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentCollectionIndex, setCurrentCollectionIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await api.getCollections();
        setCollections(data);
      } catch (error) {
        console.error("Failed to fetch collections", error);
      }
    };
    fetchCollections();
  }, []);

  // Get current collection's images
  const currentCollection = collections[currentCollectionIndex];
  const currentImages = useMemo(() => {
    if (!currentCollection) return [];
    // If collection has images array, use it; otherwise fallback to single image
    if (currentCollection.images && currentCollection.images.length > 0) {
      return currentCollection.images;
    }
    if (currentCollection.image) {
      return [{ id: 0, url: currentCollection.image, alt: currentCollection.title }];
    }
    return [];
  }, [currentCollection]);

  const openLightbox = (collectionIndex: number) => {
    setCurrentCollectionIndex(collectionIndex);
    setCurrentImageIndex(0);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const goToPrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else if (collections.length > 1) {
      // Go to previous collection, last image
      const prevColIndex = currentCollectionIndex === 0 ? collections.length - 1 : currentCollectionIndex - 1;
      setCurrentCollectionIndex(prevColIndex);
      const prevCol = collections[prevColIndex];
      const prevImages = prevCol.images?.length ? prevCol.images.length - 1 : 0;
      setCurrentImageIndex(prevImages);
    }
  };

  const goToNextImage = () => {
    if (currentImageIndex < currentImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else if (collections.length > 1) {
      // Go to next collection, first image
      const nextColIndex = currentCollectionIndex === collections.length - 1 ? 0 : currentCollectionIndex + 1;
      setCurrentCollectionIndex(nextColIndex);
      setCurrentImageIndex(0);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrevImage();
      if (e.key === 'ArrowRight') goToNextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, currentImageIndex, currentCollectionIndex, currentImages.length, collections.length]);

  if (collections.length === 0) return null;

  const currentImg = currentImages[currentImageIndex];

  return (
    <>
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Bộ Sưu Tập Nổi Bật</h2>
            <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
            <p className="mt-4 text-gray-500">Khám phá những khoảnh khắc đẹp được tuyển chọn</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collections.map((col, index) => {
              const imageCount = col.images?.length || (col.image ? 1 : 0);
              return (
                <div 
                  key={col.id} 
                  onClick={() => openLightbox(index)}
                  className={`relative rounded-2xl overflow-hidden group shadow-md cursor-pointer ${index === 0 ? 'md:col-span-2 md:row-span-2 h-80 md:h-[500px]' : 'h-60 md:h-[240px]'}`}
                >
                  <img 
                    src={getImageUrl(col.image) || placeholderImage} 
                    alt={col.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex flex-col justify-end p-6 md:p-8">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                      {col.title}
                    </h3>
                    {col.subtitle && (
                      <p className="text-white/80 text-sm">{col.subtitle}</p>
                    )}
                    {imageCount > 1 && (
                      <p className="text-white/60 text-xs mt-1">{imageCount} ảnh</p>
                    )}
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      Xem ảnh
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && currentCollection && currentImg && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button 
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 z-50"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation arrows */}
          <button 
            onClick={(e) => { e.stopPropagation(); goToPrevImage(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); goToNextImage(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Main image */}
          <div 
            className="max-w-5xl max-h-[85vh] px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={getImageUrl(currentImg.url) || placeholderImage}
              alt={currentImg.alt || currentCollection.title}
              className="max-w-full max-h-[70vh] object-contain mx-auto rounded-lg"
            />
            <div className="text-center mt-4">
              <h3 className="text-xl font-bold text-white">{currentCollection.title}</h3>
              {currentCollection.subtitle && (
                <p className="text-white/70 mt-1">{currentCollection.subtitle}</p>
              )}
              <p className="text-white/50 text-sm mt-2">
                Ảnh {currentImageIndex + 1} / {currentImages.length} trong bộ sưu tập
              </p>
            </div>

            {/* Thumbnail navigation */}
            {currentImages.length > 1 && (
              <div className="flex justify-center gap-2 mt-4 overflow-x-auto pb-2">
                {currentImages.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex ? 'border-white scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={getImageUrl(img.url) || placeholderImage}
                      alt={img.alt || `Ảnh ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FeaturedCollections;
