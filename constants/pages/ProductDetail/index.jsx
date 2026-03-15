// src/pages/ProductDetail/index.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import productApi from '../../api/productApi';
import { useCart } from '../../contexts/CartContext';
import SizePicker from '../../components/features/product-detail/SizePicker';
import ColorSelector from '../../components/features/product-detail/ColorSelector';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Lấy dữ liệu từ MySQL thông qua API
  useEffect(() => {
    const fetchProduct = async () => {
      const res = await productApi.getDetail(id);
      setProduct(res.data);
      // Mặc định chọn màu đầu tiên
      setSelectedColor(res.data.variants[0].color);
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div>Đang tải "siêu phẩm"...</div>;

  return (
    <div className="product-detail-container">
      {/* Cột trái: Gallery Ảnh */}
      <div className="product-images">
        <img src={product.image_main} alt={product.name} className="main-image" />
        <div className="thumbnail-list">
          {product.images.map(img => <img src={img.url} key={img.id} />)}
        </div>
      </div>

      {/* Cột phải: Thông tin mua hàng */}
      <div className="product-info">
        <p className="brand-name">{product.brand_name}</p>
        <h1>{product.name}</h1>
        <h2 className="price">{product.price.toLocaleString()}đ</h2>

        {/* 1. Chọn Màu sắc */}
        <ColorSelector 
          variants={product.variants} 
          selectedColor={selectedColor}
          onChange={(color) => {
            setSelectedColor(color);
            setSelectedSize(null); // Reset size khi đổi màu
          }}
        />

        {/* 2. Chọn Size (Chỉ hiện size của màu đã chọn) */}
        <SizePicker 
          variants={product.variants}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          onSelect={setSelectedSize}
        />

        {/* 3. Nút hành động */}
        <div className="actions">
          <button 
            disabled={!selectedSize}
            onClick={() => addToCart(product, selectedColor, selectedSize, quantity)}
            className="btn-add-to-cart"
          >
            {selectedSize ? 'THÊM VÀO GIỎ HÀNG' : 'VUI LÒNG CHỌN SIZE'}
          </button>
        </div>
      </div>
    </div>
  );
};