import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const CustomerLayout = () => {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Lưu từ khóa tìm kiếm
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadInitialData = () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) setUser(storedUser);
    };

    loadInitialData();

    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, [location]);

  // Hàm xử lý tìm kiếm khi nhấn Enter hoặc bấm nút
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Chuyển hướng về trang chủ kèm theo tham số tìm kiếm trên URL
      navigate(`/?search=${searchTerm.trim()}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <div>
      <nav style={styles.header}>
        <div style={styles.container}>
          {/* Cụm Logo và Thanh tìm kiếm */}
          <div style={styles.leftSection}>
            <Link to="/" style={styles.logo}>👟 SHOES STORE</Link>
            
            <form onSubmit={handleSearch} style={styles.searchBar}>
              <input 
                type="text" 
                placeholder="Tìm giày Nike, Adidas..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
              <button type="submit" style={styles.searchBtn}>🔍</button>
            </form>
          </div>
          
          <div style={styles.menu}>
            
            {user && (
              <>
                <Link to="/purchase-history" style={styles.navItem}>
                  📜 Lịch sử mua
                </Link>
                <Link to="/profile" style={styles.navItem}>
                  👤 Tài khoản
                </Link>
              </>
            )}
            
            <Link to="/cart" style={styles.cartWrapper}>
              <span style={{ fontSize: '22px' }}>🛒</span>
              {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
            </Link>

            <div style={styles.authSection}>
              {user ? (
                <>
                  <span style={styles.welcomeText}>Chào, <strong>{user.fullname}</strong></span>
                  <button onClick={handleLogout} style={styles.logoutBtn}>Đăng xuất</button>
                </>
              ) : (
                <Link to="/login" style={styles.loginLink}>Đăng nhập</Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <main style={{ minHeight: '80vh' }}>
        <Outlet />
      </main>
    </div>
  );
};

const styles = {
  header: { background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 },
  container: { maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px' },
  leftSection: { display: 'flex', alignItems: 'center', gap: '30px', flex: 1 },
  logo: { fontSize: '20px', fontWeight: 'bold', textDecoration: 'none', color: '#333', whiteSpace: 'nowrap' },
  
  // Style Thanh tìm kiếm
  searchBar: { display: 'flex', alignItems: 'center', background: '#f1f2f6', borderRadius: '20px', padding: '5px 15px', width: '300px' },
  searchInput: { border: 'none', background: 'transparent', outline: 'none', padding: '8px', fontSize: '14px', width: '100%' },
  searchBtn: { border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px' },

  menu: { display: 'flex', gap: '20px', alignItems: 'center' },
  navItem: { textDecoration: 'none', color: '#555', fontWeight: '500', fontSize: '14px' },
  cartWrapper: { position: 'relative', textDecoration: 'none', cursor: 'pointer' },
  cartBadge: { position: 'absolute', top: '-8px', right: '-10px', background: '#e74c3c', color: '#fff', fontSize: '10px', minWidth: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 'bold' },
  authSection: { display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '1px solid #eee', paddingLeft: '15px' },
  welcomeText: { fontSize: '13px', color: '#333' },
  logoutBtn: { background: 'none', border: '1px solid #e74c3c', color: '#e74c3c', padding: '4px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' },
  loginLink: { textDecoration: 'none', color: '#2d3436', fontWeight: 'bold', fontSize: '14px' }
};

export default CustomerLayout;