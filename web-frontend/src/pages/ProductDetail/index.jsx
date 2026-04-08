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
  const [quantity] = useState(1); // ✅ bỏ setQuantity để hết warning

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productApi.getDetail(id);
        const data = res.data;

        setProduct(data);

        // ✅ tránh crash nếu variants rỗng
        if (data?.variants?.length > 0) {
          setSelectedColor(data.variants[0].color);
        }
      } catch (error) {
        console.error(error); // ✅ fix eslint
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <div>Đang tải "siêu phẩm"...</div>;

  return (
    <div className="product-detail-container">
      
      {/* Cột trái */}
      <div className="product-images">
        <img src={product.image_main} alt={product.name} className="main-image" />

        <div className="thumbnail-list">
          {product.images?.map(img => (
            <img src={img.url} key={img.id} alt="" />
          ))}
        </div>
      </div>

      {/* Cột phải */}
      <div className="product-info">
        <p className="brand-name">{product.brand_name}</p>
        <h1>{product.name}</h1>
        <h2 className="price">{product.price?.toLocaleString()}đ</h2>

        {/* Color */}
        <ColorSelector 
          variants={product.variants} 
          selectedColor={selectedColor}
          onChange={(color) => {
            setSelectedColor(color);
            setSelectedSize(null);
          }}
        />

        {/* Size */}
        <SizePicker 
          variants={product.variants}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          onSelect={setSelectedSize}
        />

        {/* Action */}
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

export default ProductDetail; // ✅ bắt buộc có