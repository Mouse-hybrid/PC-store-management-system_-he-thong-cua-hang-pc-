import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import GameHelpModal from '../components/GameHelpModal';
import GameRating from '../components/GameRating';
import { getGameHelp, loadGameState, saveGameState } from '../utils/gameStorage';

const GAME_SLUG = 'free-draw'; // Nếu slug trong DB khác, đổi tại đây
=======
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4

const DrawBoard = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
<<<<<<< HEAD
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpText, setHelpText] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth > 800 ? 800 : Math.max(window.innerWidth - 40, 320);
    canvas.height = 500;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
=======

  // Khởi tạo Canvas (Bảng trắng)
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth > 800 ? 800 : window.innerWidth - 40;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; // Luôn đổ nền trắng giống Paint
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

<<<<<<< HEAD
  useEffect(() => {
    getGameHelp(GAME_SLUG)
      .then((res) => setHelpText(res.data?.instructions || ''))
      .catch(() => setHelpText('Dùng chuột hoặc cảm ứng để vẽ tự do trên canvas.'));
  }, []);

  const getCtx = () => canvasRef.current.getContext('2d');

  const startDrawing = (e) => {
    const { offsetX, offsetY } = getCoordinates(e);
    const ctx = getCtx();
=======
  const startDrawing = (e) => {
    const { offsetX, offsetY } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = getCoordinates(e);
<<<<<<< HEAD
    const ctx = getCtx();
    ctx.strokeStyle = color;
    ctx.lineWidth = Number(brushSize);
=======
    const ctx = canvasRef.current.getContext('2d');
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
<<<<<<< HEAD
    if (!isDrawing) return;
    const ctx = getCtx();
    ctx.closePath();
    setIsDrawing(false);
  };

=======
    if (isDrawing) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.closePath();
      setIsDrawing(false);
    }
  };

  // Tính toán tọa độ chính xác cho cả Chuột và Cảm ứng
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const y = e.clientY || (e.touches && e.touches[0].clientY);
    return { offsetX: x - rect.left, offsetY: y - rect.top };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
<<<<<<< HEAD
    const ctx = getCtx();
=======
    const ctx = canvas.getContext('2d');
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

<<<<<<< HEAD
  const handleSave = async () => {
    try {
      const imageDataUrl = canvasRef.current.toDataURL('image/png');
      await saveGameState(GAME_SLUG, {
        boardState: {
          imageDataUrl,
          color,
          brushSize: Number(brushSize),
        },
        isPlayerTurn: true,
      });
      alert('Đã lưu bảng vẽ');
    } catch (error) {
      alert(error?.response?.data?.message || 'Không lưu được bảng vẽ');
    }
  };

  const handleLoad = async () => {
    try {
      const data = await loadGameState(GAME_SLUG);
      const parsed =
        typeof data.state_data === 'string'
          ? JSON.parse(data.state_data)
          : data.state_data;

      const state = parsed.boardState || parsed.board || {};
      if (typeof state.brushSize === 'number') setBrushSize(state.brushSize);
      if (state.color) setColor(state.color);

      if (state.imageDataUrl) {
        const canvas = canvasRef.current;
        const ctx = getCtx();
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = state.imageDataUrl;
      }

      alert('Đã tải bảng vẽ');
    } catch (error) {
      alert(error?.response?.data?.message || 'Không tải được bảng vẽ');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', color: 'var(--text-main)', paddingBottom: '40px' }}>
      <h1 style={{ color: '#fd7e14', fontSize: '30px', margin: '0 0 15px 0' }}>🎨 BẢNG VẼ TỰ DO</h1>

      <div
        style={{
          display: 'flex',
          gap: '20px',
          backgroundColor: 'var(--control-bg)',
          padding: '15px',
          borderRadius: '10px',
          marginBottom: '15px',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontWeight: 'bold' }}>Màu sắc:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ cursor: 'pointer', width: '40px', height: '40px', border: 'none', borderRadius: '5px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontWeight: 'bold' }}>Cọ vẽ: {brushSize}px</label>
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            style={{ cursor: 'pointer' }}
          />
        </div>

        <button onClick={handleSave} style={toolBtn('#40c057')}>💾 Save</button>
        <button onClick={handleLoad} style={toolBtn('#845ef7')}>📂 Load</button>
        <button onClick={() => setHelpOpen(true)} style={toolBtn('#339af0')}>❓ Help</button>
        <button onClick={clearCanvas} style={toolBtn('#fa5252')}>🗑️ Xóa trắng</button>
        <button onClick={() => navigate('/')} style={toolBtn('#495057')}>🏠 Sảnh chờ</button>
      </div>

=======
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
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4
      <div style={{ border: '4px solid #339af0', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.5)' }}>
        <canvas
          ref={canvasRef}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerOut={stopDrawing}
<<<<<<< HEAD
          style={{ cursor: 'crosshair', touchAction: 'none' }}
        />
      </div>

      <GameHelpModal
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        title="Bảng vẽ - Hướng dẫn"
        content={helpText}
      />

      <div style={{ width: 'min(800px, 95vw)' }}>
        <GameRating gameSlug={GAME_SLUG} />
      </div>
=======
          style={{ cursor: 'crosshair', touchAction: 'none' }} // touchAction: none để không bị cuộn trang khi vẽ trên điện thoại
        />
      </div>
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4
    </div>
  );
};

<<<<<<< HEAD
function toolBtn(bg) {
  return {
    padding: '8px 15px',
    background: bg,
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  };
}

=======
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4
export default DrawBoard;