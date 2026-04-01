import React from 'react';
import CaroGame from './CaroGame';

export default function Caro4Game() {
  return (
    <CaroGame
      title="CARO 4"
      gameSlug="caro-4"
      boardSize={15}
      winLength={4}
    />
  );
}