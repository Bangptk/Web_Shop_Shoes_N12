import React from 'react';
import './styles/global.css'; // Đường dẫn phải đúng đến file css của bạn
import Header from './components/layout/Header';
import Home from './pages/Home';

function App() {
  return (
    <div className="App">
      <Header />
      <Home />
    </div>
  );
}

export default App;