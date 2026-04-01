import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ErrorPage = ({ defaultCode = 404 }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy mã lỗi từ state (nếu có component khác đẩy sang), nếu không thì dùng mặc định
  const errorCode = location.state?.errorCode || defaultCode;

  // Từ điển các mã lỗi phổ biến và thông báo tương ứng
  const errorDetails = {
    400: { title: 'Yêu cầu không hợp lệ', desc: 'Dữ liệu bạn gửi lên không đúng định dạng hoặc bị thiếu.' },
    401: { title: 'Chưa xác thực', desc: 'Phiên đăng nhập đã hết hạn hoặc bạn chưa đăng nhập.' },
    403: { title: 'Bị từ chối truy cập', desc: 'Bạn không có quyền quản trị (Admin) để vào khu vực này.' },
    404: { title: 'Không tìm thấy trang', desc: 'Đường dẫn bạn đang cố truy cập không tồn tại, đã bị đổi tên hoặc bị xóa.' },
    500: { title: 'Lỗi máy chủ nội bộ', desc: 'Hệ thống Backend đang gặp sự cố. Vui lòng thử lại sau.' },
    503: { title: 'Dịch vụ gián đoạn', desc: 'Máy chủ hiện đang bảo trì hoặc đang bị quá tải.' }
  };

  // Nếu rơi vào mã lỗi lạ, sẽ lấy thông báo mặc định này
  const currentError = errorDetails[errorCode] || { title: 'Lỗi không xác định', desc: 'Đã xảy ra sự cố ngoài ý muốn trên hệ thống.' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', color: 'white', textAlign: 'center', padding: '20px' }}>
      <h1 style={{ 
        fontSize: '120px', 
        margin: '0', 
        color: '#fa5252', 
        textShadow: '0px 0px 20px rgba(250, 82, 82, 0.4)',
        fontFamily: 'monospace'
      }}>
        {errorCode}
      </h1>
      <h2 style={{ fontSize: '30px', margin: '10px 0', color: '#fcc419', textTransform: 'uppercase', letterSpacing: '2px' }}>
        {currentError.title}
      </h2>
      <p style={{ fontSize: '18px', color: '#aaa', maxWidth: '500px', lineHeight: '1.6' }}>
        {currentError.desc}
      </p>
      
      <button
        onClick={() => navigate('/')}
        style={{ marginTop: '40px', padding: '12px 25px', fontSize: '16px', fontWeight: 'bold', border: '1px solid #339af0', borderRadius: '8px', backgroundColor: 'transparent', color: '#339af0', cursor: 'pointer', transition: 'all 0.3s' }}
        onMouseOver={(e) => { e.target.style.backgroundColor = '#339af0'; e.target.style.color = 'white'; }}
        onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#339af0'; }}
      >
        🏠 Quay lại Trang chủ
      </button>
    </div>
  );
};

export default ErrorPage;