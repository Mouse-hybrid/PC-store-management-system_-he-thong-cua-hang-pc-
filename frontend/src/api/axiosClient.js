// src/api/axiosClient.js
import axios from 'axios';

// 1. Tạo một instance của axios với cấu hình mặc định
const axiosClient = axios.create({
  baseURL: 'https://localhost:3443/api/v1', // Trỏ thẳng vào Backend Docker của bạn
  headers: {
    'Content-Type': 'application/json',
  },
  // credentials: true // (Mở ra nếu backend của bạn có dùng Cookie)
});

// 2. INTERCEPTOR (Người gác cổng trước khi gửi Request)
// Tự động lấy Token từ LocalStorage nhét vào header của mọi API
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. INTERCEPTOR (Người gác cổng khi nhận Response về)
// Bóc tách dữ liệu cho gọn, để lúc dùng không phải gọi res.data.data
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Xử lý lỗi tập trung ở đây (vd: Token hết hạn thì tự động logout)
    if (error.response && error.response.status === 401) {
      console.log('Token hết hạn hoặc chưa đăng nhập!');
      // TODO: Có thể xử lý clear localStorage và đá về trang login ở đây
    }
    return Promise.reject(error);
  }
);

export default axiosClient;