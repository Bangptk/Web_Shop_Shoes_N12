import React from 'react';
import { ShoppingCart, Eye } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        {/* Nhãn giảm giá hoặc New */}
        {product.isNew && <span className="badge new">New</span>}
        {product.discount && <span className="badge discount">-{product.discount}%</span>}
        
        <img src={product.image} alt={product.name} />
        
        {/* Lớp phủ khi Hover (Overlay) */}
        <div className="product-card-overlay">
          <button className="icon-btn" title="Xem chi tiết">
            <Eye size={20} />
          </button>
          <button className="quick-add-btn">
            <ShoppingCart size={18} />
            Thêm nhanh
          </button>
        </div>
      </div>

      <div className="product-card-info">
        <p className="product-category">{product.category || "Sneaker"}</p>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price-row">
          <span className="current-price">{product.price.toLocaleString()}đ</span>
          {product.oldPrice && <span className="old-price">{product.oldPrice.toLocaleString()}đ</span>}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;