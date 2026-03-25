import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalRevenue: 0 });

  useEffect(() => {
    // Lưu ý: Đảm bảo Backend của bạn đã có đường dẫn /api/admin/stats này
    axios.get('http://localhost:5000/api/admin/stats')
      .then(res => setStats(res.data))
      .catch(err => console.log("Lỗi lấy thống kê:", err));
  }, []);

  const cardStyle = {
    background: 'white', 
    padding: '30px', 
    borderRadius: '12px', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
    flex: 1, 
    textAlign: 'center',
    transition: 'transform 0.2s'
  };

  const titleStyle = {
    margin: '0 0 10px 0',
    color: '#7f8c8d',
    fontSize: '16px',
    fontWeight: '500'
  };

  const valueStyle = {
    fontSize: '28px', 
    fontWeight: 'bold', 
    margin: 0
  };

  return (
    <div style={{ width: '100%' }}>
      <h1 style={{ marginBottom: '30px', color: '#2c3e50', fontSize: '24px' }}>📊 Tổng quan hệ thống</h1>
      
      <div style={{ display: 'flex', gap: '25px' }}>
        {/* Thẻ Sản phẩm */}
        <div style={cardStyle}>
          <h3 style={titleStyle}>📦 Tổng Sản phẩm</h3>
          <p style={{ ...valueStyle, color: '#3498db' }}>{stats.totalProducts}</p>
        </div>

        {/* Thẻ Đơn hàng */}
        <div style={cardStyle}>
          <h3 style={titleStyle}>🛒 Đơn hàng mới</h3>
          <p style={{ ...valueStyle, color: '#2ecc71' }}>{stats.totalOrders}</p>
        </div>

        {/* Thẻ Doanh thu */}
        <div style={cardStyle}>
          <h3 style={titleStyle}>💰 Tổng Doanh thu</h3>
          <p style={{ ...valueStyle, color: '#e67e22' }}>
            {new Intl.NumberFormat('vi-VN', { 
              style: 'currency', 
              currency: 'VND' 
            }).format(stats.totalRevenue || 0)}
          </p>
        </div>
      </div>

      {/* Bạn có thể thêm biểu đồ hoặc danh sách đơn hàng gần đây ở dưới này */}
      <div style={{ marginTop: '40px', padding: '20px', background: '#ebf2f2', borderRadius: '10px', color: '#5f8d8d' }}>
        <p>💡 <i>Mẹo: Hãy thường xuyên kiểm tra kho hàng để cập nhật các mẫu giày hot nhất!</i></p>
      </div>
    </div>
  );
};

export default Dashboard;