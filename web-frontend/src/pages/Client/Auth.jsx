import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true); // Chuyển đổi giữa Đăng nhập/Đăng ký
    const [formData, setFormData] = useState({ fullname: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (isLogin) {
            // 1. Gọi API đăng nhập
            const res = await axios.post('http://localhost:5000/api/login', {
                email: formData.email,
                password: formData.password
            });

            // 2. Lưu thông tin user vào localStorage
            const user = res.data.user;
            localStorage.setItem('user', JSON.stringify(user));

            // 3. KIỂM TRA ROLE ĐỂ ĐIỀU HƯỚNG
            if (user.role === 'admin') {
                alert("Chào Admin! Đang chuyển hướng đến trang quản trị...");
                navigate('/admin/dashboard'); // Nếu là admin thì vào thẳng dashboard
            } else {
                alert("Đăng nhập thành công!");
                navigate('/'); // Nếu là khách thì về trang chủ bán hàng
            }
            
        } else {
            // Xử lý đăng ký giữ nguyên...
            await axios.post('http://localhost:5000/api/register', formData);
            alert("Đăng ký thành công! Hãy đăng nhập nhé.");
            setIsLogin(true);
        }
    } catch (error) {
        alert(error.response?.data?.message || "Sai tài khoản hoặc mật khẩu!");
    }
};

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>{isLogin ? 'ĐĂNG NHẬP' : 'TẠO TÀI KHOẢN'}</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    {!isLogin && (
                        <input 
                            type="text" placeholder="Họ và tên" required
                            style={styles.input}
                            onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                        />
                    )}
                    <input 
                        type="email" placeholder="Email" required
                        style={styles.input}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <input 
                        type="password" placeholder="Mật khẩu" required
                        style={styles.input}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <button type="submit" style={styles.button}>
                        {isLogin ? 'ĐĂNG NHẬP' : 'ĐĂNG KÝ NGAY'}
                    </button>
                </form>
                <p style={styles.switchText}>
                    {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản rồi?"} 
                    <span style={styles.link} onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? " Đăng ký tại đây" : " Đăng nhập ngay"}
                    </span>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f7f6' },
    card: { background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '380px', textAlign: 'center' },
    title: { marginBottom: '25px', color: '#333', letterSpacing: '1px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    input: { padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '15px' },
    button: { padding: '12px', borderRadius: '6px', border: 'none', background: '#333', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
    switchText: { marginTop: '20px', fontSize: '14px', color: '#666' },
    link: { color: '#e67e22', cursor: 'pointer', fontWeight: 'bold' }
};

export default Auth;
