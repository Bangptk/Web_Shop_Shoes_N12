// js/auth.js
async function login(email, password) {
    const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    
    if (data.token) {
        localStorage.setItem('accessToken', data.token); // Lưu token lại
        alert("Đăng nhập thành công!");
    }
}