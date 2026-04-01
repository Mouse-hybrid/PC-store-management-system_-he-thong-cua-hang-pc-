import React from 'react';

export default function GameHelpModal({ open, onClose, title = 'Hướng dẫn', content = '' }) {
  if (!open) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>{title}</h2>
        <p style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>{content || 'Chưa có hướng dẫn.'}</p>
        <button onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};

const modalStyle = {
  width: 'min(600px, 90vw)',
  background: 'white',
  color: '#111',
  borderRadius: 12,
  padding: 24,
};