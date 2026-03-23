import React from 'react';
import { ShoppingCart } from 'lucide-react'; // Nhớ cài lucide-react nếu chưa cài nhé

const Home = () => {
  // Dữ liệu giả để test giao diện
  const featuredProducts = [
    { id: 1, name: "Air Jordan 1 Low", price: "3.500.000", image: "https://images.nike.com/is/image/DotCom/dc5656_100_A_PREM?wid=640&f=jpg" },
    { id: 2, name: "Adidas Forum Low", price: "2.800.000", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/09c319af631145328906ad43009a695e_9366/Giay_Forum_Low_trang_FY7756_01_standard.jpg" },
  ];

  return (
    <div className="home-container">
      {/* HERO SECTION */}
      <section className="hero-banner">
        <div className="banner-content">
          <h1>Move <br/> Your Way</h1>
          <p>Khám phá bộ sưu tập Sneaker 2026 với công nghệ đệm khí mới nhất. Nâng tầm bước chân của bạn.</p>
          <button className="btn-primary">Mua ngay</button>
        </div>
        
        <div className="hero-image-container">
          <img src="https://purepng.com/public/uploads/large/purepng.com-running-shoessneakersrunningshoes-1701528148386sqp0u.png" alt="Hero Shoe" />
        </div>
      </section>

      {/* PRODUCT GRID SECTION */}
      <section className="product-section">
        <h2 className="section-title">Sản phẩm mới nhất</h2>
        
        <div className="product-grid">
          {featuredProducts.map(product => (
            <div key={product.id} className="product-card">
               <div className="product-image-wrapper">
                  <img src={product.image} alt={product.name} />
                  
                  {/* Nút hiện ra khi Hover */}
                  <div className="product-card-overlay">
                    <button className="quick-add-btn">
                      <ShoppingCart size={18} />
                      Thêm nhanh
                    </button>
                  </div>
               </div>
               
               <div className="product-info">
                 <h3 className="product-name">{product.name}</h3>
                 <p className="product-price">{product.price}đ</p>
               </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;