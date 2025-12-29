# Image URL Fix for Production API

## Problem
Khi sử dụng `VITE_API_URL=https://shopadmin.mitechcenter.vn`, hình ảnh không tải được vì các component đang sử dụng đường dẫn相对 (relative paths) từ API mà không xử lý để thành full URL.

## Root Cause
1. API trả về image paths dạng `/storage/products/image.jpg`
2. Component hiển thị trực tiếp `src={product.image}` mà không ghép với API_URL
3. Một số component có `getImageUrl` function riêng, nhưng không đồng bộ

## Solution
Tạo centralized utility function và cập nhật các component:

### 1. Created `utils/imageUrl.ts`
```typescript
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8001') as string;

export const getImageUrl = (path: string | null): string | null => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/')) return `${API_URL}${path}`;
  return path;
};
```

### 2. Updated Components
- ✅ `ProductCard.tsx` - Sử dụng `getImageUrl(product.image)`
- ✅ `AdminBlogsPage.tsx` - Sử dụng `getImageUrl(p.image)`
- ✅ `BlogCard.tsx` - Sử dụng `getImageUrl(post.image)`
- ✅ `FeaturedCollections.tsx` - Refactor để dùng utility thay vì local function

### 3. Configuration
- ✅ Updated `.env` để sử dụng production API: `VITE_API_URL=https://shopadmin.mitechcenter.vn`

## How It Works
- Relative paths (`/storage/products/xyz.jpg`) → `https://shopadmin.mitechcenter.vn/storage/products/xyz.jpg`
- Absolute URLs (`https://example.com/image.jpg`) → giữ nguyên
- Null/undefined → null

## Testing
- ✅ TypeScript compilation passes
- ✅ Build successful: `npm run build`
- ✅ Image URLs now properly formatted for production API

## Next Steps
Cần update thêm các components khác nếu có:
- `CartSidebar.tsx`
- `CheckoutPage.tsx`
- `ProductDetailPage.tsx`
- `BlogPostPage.tsx`
- Các components khác sử dụng image paths
