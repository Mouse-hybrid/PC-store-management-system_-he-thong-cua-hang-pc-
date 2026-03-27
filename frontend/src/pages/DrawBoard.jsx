import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DrawBoard = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);

  // Khởi tạo Canvas (Bảng trắng)
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth > 800 ? 800 : window.innerWidth - 40;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; // Luôn đổ nền trắng giống Paint
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.closePath();
      setIsDrawing(false);
    }
  };

  // Tính toán tọa độ chính xác cho cả Chuột và Cảm ứng
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const y = e.clientY || (e.touches && e.touches[0].clientY);
    return { offsetX: x - rect.left, offsetY: y - rect.top };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', color: 'var(--text-main)' }}>
      <h1 style={{ color: '#fd7e14', fontSize: '30px', margin: '0 0 15px 0' }}>🎨 BẢNG VẼ TỰ DO</h1>
      
      {/* THANH CÔNG CỤ (TOOLBAR) */}
      <div style={{ display: 'flex', gap: '20px', backgroundColor: 'var(--control-bg)', padding: '15px', borderRadius: '10px', marginBottom: '15px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label fontWeight="bold">Màu sắc:</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ cursor: 'pointer', width: '40px', height: '40px', border: 'none', borderRadius: '5px' }} />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label fontWeight="bold">Cọ vẽ: {brushSize}px</label>
          <input type="range" min="1" max="50" value={brushSize} onChange={(e) => setBrushSize(e.target.value)} style={{ cursor: 'pointer' }} />
        </div>

        <button onClick={clearCanvas} style={{ padding: '8px 15px', background: '#fa5252', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>🗑️ Xóa trắng</button>
        <button onClick={() => navigate('/')} style={{ padding: '8px 15px', background: '#339af0', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>🏠 Sảnh chờ</button>
      </div>

      {/* BẢNG VẼ CANVAS */}
      <div style={{ border: '4px solid #339af0', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.5)' }}>
        <canvas
          ref={canvasRef}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerOut={stopDrawing}
          style={{ cursor: 'crosshair', touchAction: 'none' }} // touchAction: none để không bị cuộn trang khi vẽ trên điện thoại
        />
      </div>
    </div>
  );
};

export default DrawBoard;