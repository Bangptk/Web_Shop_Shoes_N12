import React, { useState } from 'react';
import { loginAdmin } from '../../api/authApi';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await loginAdmin({ email, password });
            if (data.user.role === 'admin') {
                localStorage.setItem('token', data.token);
                alert('Chào sếp! Đang vào trang quản trị...');
                window.location.href = '/admin/dashboard'; // Chuyển hướng
            } else {
                alert('Bạn không có quyền truy cập Admin!');
            }
        } catch (error) {
            alert('Đăng nhập thất bại!');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin}>
                <h2>Admin Login</h2>
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Đăng nhập</button>
            </form>
        </div>
    );
};

export default LoginPage;

