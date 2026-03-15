# Web_Shop_Shoes_N12

Cấu trúc web:
-font-end: 
src/
├── assets/                  # Tài nguyên tĩnh của hệ thống
│   ├── images/              # Banner bộ sưu tập (Summer/Winter), Logo Brand
│   ├── icons/               # Icon thước đo (Size Guide), Icon chất liệu da/vải
│   └── size-charts/         # Ảnh bảng quy đổi size (EU, US, UK)
├── api/                     # Quản lý các lệnh gọi API (Axios/Fetch)
│   ├── productApi.js        # Lọc theo: Size, Thương hiệu, Màu sắc
│   └── brandApi.js          # Lấy danh sách các hãng giày (Nike, Adidas...)
├── components/              # Các thành phần giao diện tái sử dụng
│   ├── common/              # Thành phần dùng chung toàn trang
│   │   ├── Modal/           # Pop-up "Hướng dẫn đo size chân"
│   │   └── ShoeCard/        # Card hiển thị giày (có badge Limited, Sale)
│   ├── features/            # Các tính năng phức tạp theo nghiệp vụ
│   │   ├── product-detail/  # Xử lý logic chọn Size và Màu sắc
│   │   ├── size-picker/     # Hiển thị danh sách size còn hàng
│   │   └── tracking/        # Theo dõi trạng thái đơn hàng (Đang giao, Đã đóng gói)
├── constants/               # Các biến hằng số cố định
│   └── common.js            # Danh sách size chuẩn [36 - 45], config màu sắc
├── hooks/                   # Các Custom Hooks xử lý logic tách biệt
│   └── useInventory.js      # Kiểm tra tồn kho thời gian thực cho từng size
└── pages/                   # Các trang chính của ứng dụng
    ├── BrandPage/           # Trang riêng cho từng hãng (VD: Nike, Jordan)
    └── SizeGuide/           # Trang hướng dẫn chọn giày cho người mới

-backend/
├── config/
│   └── db.js                 # Kết nối MySQL (Sequelize hoặc Prisma)
├── controllers/
│   ├── productController.js  # Xử lý Logic lấy giày, lọc theo size/giá
│   └── orderController.js    # Xử lý trừ kho khi khách mua thành công
├── models/
│   ├── Product.js
│   ├── Variant.js            # Quản lý Size/Màu
│   └── User.js
├── routes/
│   └── api.js
└── server.js
