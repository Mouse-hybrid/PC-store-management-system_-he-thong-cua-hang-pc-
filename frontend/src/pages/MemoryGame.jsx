import React, { useEffect, useMemo, useState } from 'react';
import GameHelpModal from '../components/GameHelpModal';
import GameRating from '../components/GameRating';
import { getGameHelp, loadGameState, saveGameState, submitScore } from '../utils/gameStorage';

const icons = ['🍎', '🍌', '🍓', '🍇', '🥝', '🍒', '🍍', '🥥'];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function createBoard() {
  const cards = shuffle([...icons, ...icons]).map((icon, index) => ({
    id: index,
    icon,
    flipped: false,
    matched: false,
  }));
  return cards;
}

export default function MemoryGame() {
  const [cards, setCards] = useState(createBoard());
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpText, setHelpText] = useState('');
  const [startTime] = useState(Date.now());

  useEffect(() => {
    getGameHelp('memory').then((res) => setHelpText(res.data.instructions || ''));
  }, []);

  const finished = useMemo(() => cards.every((c) => c.matched), [cards]);

  useEffect(() => {
    if (selected.length !== 2) return;

    const [a, b] = selected;
    if (cards[a].icon === cards[b].icon) {
      setCards((prev) => prev.map((card, idx) => (
        idx === a || idx === b ? { ...card, matched: true } : card
      )));
      setSelected([]);
    } else {
      const timer = setTimeout(() => {
        setCards((prev) => prev.map((card, idx) => (
          idx === a || idx === b ? { ...card, flipped: false } : card
        )));
        setSelected([]);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [selected, cards]);

  useEffect(() => {
    if (finished) {
      const seconds = Math.floor((Date.now() - startTime) / 1000);
      submitScore('memory', Math.max(100 - moves, 1), seconds).catch(console.error);
    }
  }, [finished]);

  const handleCardClick = (index) => {
    if (selected.length >= 2) return;
    const card = cards[index];
    if (card.flipped || card.matched) return;

    setCards((prev) => prev.map((c, i) => i === index ? { ...c, flipped: true } : c));
    setSelected((prev) => [...prev, index]);
    if (selected.length === 1) setMoves((m) => m + 1);
  };

  const handleSave = async () => {
    await saveGameState('memory', { boardState: cards, isPlayerTurn: true, moves });
    alert('Đã lưu game');
  };

  const handleLoad = async () => {
    const data = await loadGameState('memory');
    const parsed = typeof data.state_data === 'string' ? JSON.parse(data.state_data) : data.state_data;
    setCards(parsed.boardState || parsed.board || createBoard());
    setMoves(parsed.moves || 0);
  };

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1>Memory Game</h1>
      <p>Số lượt lật: {moves}</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleLoad}>Load</button>
        <button onClick={() => setHelpOpen(true)}>Help</button>
      </div>

      <div style={grid}>
        {cards.map((card, index) => (
          <button key={card.id} onClick={() => handleCardClick(index)} style={cell}>
            {card.flipped || card.matched ? card.icon : '❓'}
          </button>
        ))}
      </div>

      {finished && <h2>Hoàn thành!</h2>}

      <GameHelpModal open={helpOpen} onClose={() => setHelpOpen(false)} content={helpText} />
      <GameRating gameSlug="memory" />
    </div>
  );
}

const grid = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 };
const cell = { minHeight: 80, fontSize: 28 };