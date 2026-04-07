import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, User, History } from 'lucide-react'; // Sử dụng icon cho xịn

const Header = () => {
  return (
    <nav className="header">
      <div className="logo">
        <Link to="/">👟 SHOE STORE</Link>
      </div>
      
      <ul className="nav-links">
        <li><Link to="/shop">Cửa hàng</Link></li>
        <li><Link to="/brands">Thương hiệu</Link></li>
        <li><Link to="/sale">Giảm giá</Link></li>
      </ul>

      <div className="header-actions">
        <div className="search-box">
          <input type="text" placeholder="Tìm kiếm giày..." />
          <Search size={20} />
        </div>
        <Link to="/cart" className="cart-icon">
          <ShoppingCart />
          <span className="cart-count">0</span>
        </Link>
        <Link to="/purchase-history" className="history-icon" title="Lịch sử mua hàng">
          <History size={20} />
        </Link>
        <Link to="/profile"><User /></Link>
      </div>
    </nav>
  );
};

export default Header;