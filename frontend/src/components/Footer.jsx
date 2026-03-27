import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      width: '100%',
      padding: '15px 0',
      backgroundColor: 'var(--navbar-bg, #1a1a1a)',
      color: 'var(--text-main, #f0f0f0)',
      textAlign: 'center',
      marginTop: 'auto', // Lệnh này giúp Footer luôn bị đẩy xuống dưới cùng màn hình
      borderTop: '1px solid #333',
      fontSize: '14px'
    }}>
      <p style={{ margin: 0 }}>© 2026 LED MATRIX GAMES. Đồ án Web - All rights reserved.</p>
    </footer>
  );
};

export default Footer;