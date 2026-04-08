import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PurchaseHistory = () => {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- STATE CHO DẠNG "XỔ XUỐNG" ---
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // 1. LẤY DANH SÁCH ĐƠN HÀNG (ĐÃ FIX LỖI THIẾU TOKEN)
  useEffect(() => {
    if (user?.id) {
      const token = localStorage.getItem('token'); // Lấy token

      axios.get(`http://localhost:5000/api/orders/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` } // Gắn token vào để Backend cho phép
      })
        .then(res => {
          // Bọc an toàn để tránh lỗi map
          const dataList = Array.isArray(res.data.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
          
          // Lọc lấy những đơn đã hoàn thành
          const completed = dataList.filter(order => order.status === 'delivered');
          setCompletedOrders(completed);
          setLoading(false);
        })
        .catch(err => {
          console.error("Lỗi lấy danh sách đơn hàng:", err);
          setLoading(false);
        });
    }
  }, [user?.id]);

  // 2. HÀM MỞ/ĐÓNG CHI TIẾT SẢN PHẨM
  const toggleDetails = async (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      setOrderDetails([]);
      return;
    }

    setExpandedOrderId(orderId);
    setLoadingDetails(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/orders/${orderId}/details`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const detailsData = res.data.data || res.data;
      setOrderDetails(Array.isArray(detailsData) ? detailsData : []);
    } catch (error) {
      console.error("Lỗi lấy chi tiết đơn hàng:", error);
      alert("Không thể tải chi tiết đơn hàng này!");
    } finally {
      setLoadingDetails(false);
    }
  };

  // 3. HÀM MUA LẠI: CHUYỂN THẲNG SANG TRANG CHECKOUT
  const handleBuyAgain = (item) => {
    // Đóng gói dữ liệu giống hệt với định dạng giỏ hàng mà Checkout đang dùng
    const buyNowItem = {
      id: item.product_id,
      name: item.product_name,
      price: item.price,
      size: item.size,
      quantity: 1, // Mặc định mua lại 1 đôi
      image: item.image_url
    };

    // Chuyển hướng sang trang checkout và truyền dữ liệu mua ngay qua state
    navigate('/checkout', { state: { buyNowItem } });
  };

  if (loading) {
    return <div style={styles.container}><p style={{ textAlign: 'center' }}>Đang tải lịch sử...</p></div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>📜 LỊCH SỬ MUA HÀNG</h2>
      
      <div style={styles.flexLayout}>
        <div style={styles.listSection}>
          {completedOrders.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
                Bạn chưa có đơn hàng hoàn thành nào.
              </p>
              <button onClick={() => navigate('/')} style={styles.shopBtn}>
                🛍️ Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            completedOrders.map(order => (
              <div 
                key={order.id} 
                style={{
                  ...styles.orderCard,
                  borderColor: expandedOrderId === order.id ? '#27ae60' : '#e2e8f0', // Đổi viền xanh khi mở
                  boxShadow: expandedOrderId === order.id ? '0 10px 25px -5px rgba(39, 174, 96, 0.15)' : '0 4px 12px rgba(0,0,0,0.05)'
                }}
              >
                {/* Header đơn hàng */}
                <div style={styles.cardHeader}>
                  <span style={styles.orderIdText}>Mã đơn: #{order.id}</span>
                  <span style={styles.statusBadge}>✅ Hoàn thành</span>
                </div>

                {/* Nội dung đơn hàng */}
                <div style={styles.cardBody}>
                  <div style={styles.infoRow}>
                    <span style={styles.label}>📅 Ngày đặt:</span>
                    <span style={styles.value}>
                      {new Date(order.order_date).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.label}>💰 Tổng tiền:</span>
                    <span style={styles.totalValue}>
                      {Number(order.total_money).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.label}>📍 Địa chỉ:</span>
                    <span style={styles.value}>
                      {order.shipping_address?.replace(/(\d)\s+([A-ZÀ-Ỹ])/u, '$1, $2')}
                    </span>
                  </div>
                </div>

                {/* --- KHU VỰC CHI TIẾT SẢN PHẨM --- */}
                {expandedOrderId === order.id && (
                  <div style={styles.expandedContent}>
                    <h4 style={styles.expandedTitle}>Sản phẩm đã mua:</h4>
                    
                    {loadingDetails ? (
                      <p style={styles.loadingText}>Đang tải sản phẩm...</p>
                    ) : (
                      <div style={styles.productList}>
                        {orderDetails.length > 0 ? (
                          orderDetails.map((item, idx) => (
                            <div key={idx} style={styles.productItem}>
                              <img 
                                src={item.image_url ? `http://localhost:5000${item.image_url}` : 'https://via.placeholder.com/60'} 
                                alt="Giày" 
                                style={styles.productImg} 
                              />
                              <div style={styles.productInfo}>
                                <p style={styles.productName}>{item.product_name || 'Tên sản phẩm'}</p>
                                <p style={styles.productMeta}>Size: {item.size} | SL: {item.quantity}</p>
                                <p style={styles.productPrice}>{Number(item.price).toLocaleString('vi-VN')}đ</p>
                              </div>

                              {/* NÚT MUA LẠI BÊN PHẢI SẢN PHẨM */}
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation(); // Ngăn việc click nút làm đóng thẻ
                                  handleBuyAgain(item);
                                }}
                                style={styles.repurchaseBtn}
                              >
                                🛒 Mua lại
                              </button>
                            </div>
                          ))
                        ) : (
                          <p style={{ color: '#e53e3e', fontSize: '14px', fontStyle: 'italic' }}>Không có chi tiết sản phẩm.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* THANH BẤM ĐỂ MỞ/ĐÓNG TẠI ĐÁY THẺ */}
                <div 
                  onClick={() => toggleDetails(order.id)} 
                  style={styles.toggleBar}
                >
                  {expandedOrderId === order.id ? 'Thu gọn ▲' : 'Xem chi tiết sản phẩm ▼'}
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  container: { padding: '40px 20px', backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: '"Inter", sans-serif' },
  header: { textAlign: 'center', marginBottom: '40px', color: '#1a202c', fontSize: '32px', fontWeight: '700' },
  flexLayout: { display: 'flex', justifyContent: 'center', width: '100%' },
  listSection: { width: '100%', maxWidth: '850px', display: 'flex', flexDirection: 'column', gap: '20px' },
  
  orderCard: { backgroundColor: '#fff', borderRadius: '15px', padding: '25px 25px 0 25px', transition: 'all 0.3s ease', overflow: 'hidden', border: '2px solid #e2e8f0' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' },
  orderIdText: { fontSize: '18px', fontWeight: 'bold', color: '#2d3748' },
  statusBadge: { padding: '5px 12px', backgroundColor: '#eafaf1', color: '#27ae60', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' },
  
  cardBody: { display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '20px' },
  infoRow: { display: 'flex', justifyContent: 'space-between', fontSize: '15px' },
  label: { color: '#718096' },
  value: { color: '#2d3748', fontWeight: '500', textAlign: 'right' },
  totalValue: { color: '#e67e22', fontWeight: 'bold', fontSize: '17px' },
  
  emptyState: { textAlign: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
  shopBtn: { padding: '12px 25px', backgroundColor: '#2d3748', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },

  // --- DÀNH RIÊNG CHO XỔ XUỐNG VÀ NÚT MUA LẠI ---
  expandedContent: { borderTop: '1px dashed #cbd5e0', paddingTop: '20px', paddingBottom: '20px', animation: 'fadeIn 0.3s ease-in-out' },
  expandedTitle: { margin: '0 0 15px 0', color: '#27ae60', fontSize: '15px', fontWeight: 'bold' }, // Màu xanh cho Lịch sử
  loadingText: { color: '#a0aec0', fontStyle: 'italic', fontSize: '14px' },
  productList: { display: 'flex', flexDirection: 'column', gap: '15px' },
  productItem: { display: 'flex', gap: '15px', alignItems: 'center', backgroundColor: '#f8fffb', padding: '12px', borderRadius: '10px', border: '1px solid #eafaf1' }, // Đổi màu nền xíu cho khác Tiến độ
  productImg: { width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' },
  productInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' },
  productName: { margin: 0, fontWeight: 'bold', color: '#2d3748', fontSize: '15px' },
  productMeta: { margin: 0, fontSize: '13px', color: '#718096' },
  productPrice: { margin: 0, fontWeight: 'bold', color: '#dd6b20', fontSize: '14px' },
  
  repurchaseBtn: { 
    padding: '8px 12px', backgroundColor: '#fff', color: '#27ae60', 
    border: '1px solid #27ae60', borderRadius: '5px', cursor: 'pointer', 
    fontWeight: 'bold', transition: '0.2s', fontSize: '13px' 
  },

  toggleBar: {
    backgroundColor: '#f8fafc', margin: '0 -25px', padding: '12px 0', textAlign: 'center',
    color: '#4a5568', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
    borderTop: '1px solid #edf2f7', transition: 'background-color 0.2s',
  }
};

export default PurchaseHistory;