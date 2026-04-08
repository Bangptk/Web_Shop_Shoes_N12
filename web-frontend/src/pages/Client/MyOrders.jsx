import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- STATE CHO DẠNG "XỔ XUỐNG" ---
  const [expandedOrderId, setExpandedOrderId] = useState(null); // Lưu ID đơn hàng đang mở
  const [orderDetails, setOrderDetails] = useState([]); // Lưu danh sách giày của đơn đó
  const [loadingDetails, setLoadingDetails] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user && user.id) {
      const token = localStorage.getItem('token');

      axios.get(`http://localhost:5000/api/orders/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const dataList = res.data.data || res.data;
        setOrders(Array.isArray(dataList) ? dataList : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi lấy danh sách:", err);
        setLoading(false);
      });
    }
  }, [user?.id]);

  // --- HÀM MỞ/ĐÓNG CHI TIẾT ---
  const toggleDetails = async (orderId) => {
    // Nếu đang mở rồi thì đóng lại
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      setOrderDetails([]);
      return;
    }

    // Nếu chưa mở thì xổ xuống và gọi API
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

  const renderStatus = (status) => {
    const statusMap = {
      'pending': { text: '🕒 Chờ xử lý', color: '#f39c12', bg: '#fef5e7' },
      'shipped': { text: '🚚 Đang giao hàng', color: '#3498db', bg: '#ebf5fb' },
      'delivered': { text: '✅ Hoàn thành', color: '#27ae60', bg: '#eafaf1' },
      'canceled': { text: '❌ Đã hủy', color: '#e74c3c', bg: '#fdedec' }
    };

    const current = statusMap[status] || { text: status, color: '#7f8c8d', bg: '#f4f6f7' };

    return (
      <span style={{ 
        padding: '6px 15px', borderRadius: '20px', fontSize: '13px', 
        fontWeight: 'bold', color: current.color, backgroundColor: current.bg
      }}>
        {current.text}
      </span>
    );
  };

  if (loading) return <div style={styles.container}><p style={{textAlign: 'center'}}>Đang tải dữ liệu...</p></div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>📦 TIẾN ĐỘ ĐƠN HÀNG</h2>
      
      <div style={styles.flexLayout}>
        <div style={styles.listSection}>
          {orders.length === 0 ? (
            <div style={styles.emptyState}>
              <p>Bạn chưa có đơn hàng nào.</p>
            </div>
          ) : (
            orders.map(order => (
              <div 
                key={order.id} 
                style={{
                  ...styles.orderCard,
                  // Đổi màu viền một chút khi thẻ đang được mở để tạo điểm nhấn
                  borderColor: expandedOrderId === order.id ? '#3182ce' : '#e2e8f0',
                  boxShadow: expandedOrderId === order.id ? '0 10px 25px -5px rgba(49, 130, 206, 0.15)' : '0 10px 15px -3px rgba(0,0,0,0.1)'
                }}
              >
                {/* PHẦN ĐẦU THẺ (GIỮ NGUYÊN) */}
                <div style={styles.cardHeader}>
                  <span style={styles.orderIdText}>Mã đơn: #{order.id}</span>
                  {renderStatus(order.status)}
                </div>

                {/* THÔNG TIN CHÍNH CỦA ĐƠN HÀNG */}
                <div style={styles.cardBody}>
                  <div style={styles.infoRow}>
                    <span style={styles.label}>📅 Ngày đặt:</span>
                    <span style={styles.value}>{new Date(order.order_date).toLocaleString('vi-VN')}</span>
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
                  <div style={styles.infoRow}>
                    <span style={styles.label}>📞 Liên hệ:</span>
                    <span style={styles.value}>{order.phone}</span>
                  </div>
                </div>

                {/* --- KHU VỰC CHI TIẾT XỔ XUỐNG --- */}
                {expandedOrderId === order.id && (
                  <div style={styles.expandedContent}>
                    <h4 style={styles.expandedTitle}>Sản phẩm trong đơn:</h4>
                    
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
                            </div>
                          ))
                        ) : (
                          <p style={{ color: '#e53e3e', fontSize: '14px', fontStyle: 'italic' }}>Không có chi tiết sản phẩm.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* NÚT BẤM KÉO XUỐNG / THU GỌN */}
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

const styles = {
  container: { padding: '40px 20px', backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: '"Inter", sans-serif' },
  header: { textAlign: 'center', marginBottom: '40px', color: '#1a202c', fontSize: '32px', fontWeight: '700' },
  flexLayout: { display: 'flex', justifyContent: 'center', width: '100%' },
  listSection: { width: '100%', maxWidth: '850px', display: 'flex', flexDirection: 'column', gap: '25px' },
  orderCard: { backgroundColor: '#fff', borderRadius: '15px', padding: '25px 25px 0 25px', border: '2px solid #e2e8f0', transition: 'all 0.3s ease', overflow: 'hidden' }, // Sửa padding dưới thành 0 để nối với thanh toggle
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f7fafc' },
  orderIdText: { fontSize: '18px', fontWeight: 'bold', color: '#2d3748' },
  cardBody: { display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '20px' },
  infoRow: { display: 'flex', justifyContent: 'space-between', fontSize: '15px' },
  label: { color: '#718096' },
  value: { color: '#2d3748', fontWeight: '500' },
  totalValue: { color: '#dd6b20', fontWeight: 'bold', fontSize: '18px' },
  emptyState: { textAlign: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: '15px', color: '#a0aec0' },
  
  // --- CSS DÀNH RIÊNG CHO PHẦN XỔ XUỐNG ---
  expandedContent: {
    borderTop: '1px dashed #cbd5e0',
    paddingTop: '20px',
    paddingBottom: '20px',
    animation: 'fadeIn 0.3s ease-in-out'
  },
  expandedTitle: { margin: '0 0 15px 0', color: '#4a5568', fontSize: '15px', fontWeight: '600' },
  loadingText: { color: '#a0aec0', fontStyle: 'italic', fontSize: '14px' },
  productList: { display: 'flex', flexDirection: 'column', gap: '15px' },
  productItem: { display: 'flex', gap: '15px', alignItems: 'center', backgroundColor: '#f7fafc', padding: '10px', borderRadius: '10px' },
  productImg: { width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' },
  productInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' },
  productName: { margin: 0, fontWeight: 'bold', color: '#2d3748', fontSize: '15px' },
  productMeta: { margin: 0, fontSize: '13px', color: '#718096' },
  productPrice: { margin: 0, fontWeight: 'bold', color: '#dd6b20', fontSize: '14px' },
  
  // --- THANH BẤM ĐỂ MỞ/ĐÓNG TẠI ĐÁY THẺ ---
  toggleBar: {
    backgroundColor: '#f8fafc',
    margin: '0 -25px', // Tràn ra sát mép thẻ
    padding: '12px 0',
    textAlign: 'center',
    color: '#4a5568',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    borderTop: '1px solid #edf2f7',
    transition: 'background-color 0.2s',
  }
};

export default MyOrders;