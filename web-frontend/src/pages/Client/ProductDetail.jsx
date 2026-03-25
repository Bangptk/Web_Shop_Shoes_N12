import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Dùng để chuyển trang khi Mua ngay
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const sizes = [38, 39, 40, 41, 42, 43]; 

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error("Lỗi lấy chi tiết sản phẩm:", err));
  }, [id]);

  // HÀM QUAN TRỌNG: Thêm vào giỏ hàng kèm Size
  const handleAddToCart = (isBuyNow = false) => {
    if (!selectedSize) {
      alert("Vui lòng chọn Size giày trước khi tiếp tục!");
      return;
    }

    // 1. Lấy giỏ hàng hiện tại từ localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // 2. Tạo đối tượng sản phẩm mới có kèm Size đã chọn
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      size: selectedSize, // Lưu số size (VD: 42) vào đây
      quantity: 1
    };

    // 3. Kiểm tra xem đã có cùng sản phẩm + cùng size này trong giỏ chưa
    const existingIndex = cart.findIndex(item => item.id === product.id && item.size === selectedSize);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push(cartItem);
    }

    // 4. Lưu lại vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // 5. Kích hoạt sự kiện để Header cập nhật số lượng
    window.dispatchEvent(new Event('storage'));

    if (isBuyNow) {
      // Nếu là Mua ngay thì nhảy thẳng tới trang giỏ hàng
      navigate('/cart');
    } else {
      alert(`Đã thêm ${product.name} - Size ${selectedSize} vào giỏ hàng thành công!`);
    }
  };

  if (!product) return <div style={{ textAlign: 'center', padding: '100px' }}>Đang tải sản phẩm...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.flexBox}>
        {/* Bên trái: Hình ảnh */}
        <div style={styles.imageSection}>
          <img 
            src={product.image_url ? `http://localhost:5000${product.image_url}` : 'https://via.placeholder.com/500'} 
            style={styles.mainImage} 
            alt={product.name} 
          />
        </div>

        {/* Bên phải: Thông tin */}
        <div style={styles.infoSection}>
          <p style={styles.category}>{product.category_name || 'SNEAKERS'}</p>
          <h1 style={styles.title}>{product.name}</h1>
          <p style={styles.price}>{Number(product.price).toLocaleString()}đ</p>
          
          <div style={styles.divider}></div>

          <p style={styles.description}>{product.description || "Sản phẩm chất lượng cao, thiết kế thời trang phù hợp mọi hoạt động."}</p>

          {/* Chọn Size */}
          <div style={{ marginTop: '30px' }}>
            <h4 style={{ marginBottom: '15px' }}>Chọn Size (EU):</h4>
            <div style={styles.sizeGrid}>
              {sizes.map(size => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    ...styles.sizeBtn,
                    background: selectedSize === size ? '#2d3436' : '#fff',
                    color: selectedSize === size ? '#fff' : '#2d3436',
                    borderColor: selectedSize === size ? '#2d3436' : '#dfe6e9'
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Nút hành động */}
          <div style={styles.actionBox}>
            <button 
              style={styles.addCartBtn} 
              onClick={() => handleAddToCart(false)}
            >
              THÊM VÀO GIỎ
            </button>
            <button 
              style={styles.buyNowBtn} 
              onClick={() => handleAddToCart(true)}
            >
              MUA NGAY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1100px', margin: '50px auto', padding: '0 20px', minHeight: '80vh' },
  flexBox: { display: 'flex', gap: '50px', flexWrap: 'wrap' },
  imageSection: { flex: 1, minWidth: '350px' },
  mainImage: { width: '100%', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', objectFit: 'cover' },
  infoSection: { flex: 1, minWidth: '350px' },
  category: { color: '#aaa', textTransform: 'uppercase', fontSize: '14px', fontWeight: 'bold' },
  title: { fontSize: '32px', margin: '10px 0', color: '#2d3436', fontWeight: 'bold' },
  price: { fontSize: '28px', color: '#e67e22', fontWeight: 'bold' },
  divider: { height: '1px', background: '#eee', margin: '20px 0' },
  description: { lineHeight: '1.6', color: '#636e72' },
  sizeGrid: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  sizeBtn: { 
    width: '50px', height: '50px', border: '1px solid', borderRadius: '8px', 
    cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' 
  },
  actionBox: { display: 'flex', gap: '15px', marginTop: '40px' },
  addCartBtn: { flex: 1, padding: '18px', background: '#fff', border: '2px solid #2d3436', fontWeight: 'bold', borderRadius: '10px', cursor: 'pointer', transition: '0.3s' },
  buyNowBtn: { flex: 1, padding: '18px', background: '#2d3436', color: '#fff', border: 'none', fontWeight: 'bold', borderRadius: '10px', cursor: 'pointer', transition: '0.3s' }
};

export default ProductDetail;