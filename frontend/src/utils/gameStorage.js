import api from './api';

export const saveGameState = async (gameSlug, state) => {
  const res = await api.post('/api/game/save', {
    gameSlug,
    ...state,
  });
  return res.data;
};

export const loadGameState = async (gameSlug) => {
  const res = await api.get(`/api/game/load/${gameSlug}`);
  return res.data;
};

export const getGameHelp = async (gameSlug) => {
  const res = await api.get(`/api/game/${gameSlug}/help`);
  return res.data;
};

export const submitScore = async (gameSlug, score, play_time_seconds) => {
  const res = await api.post(`/api/game/${gameSlug}/score`, {
    score,
    play_time_seconds,
  });
  return res.data;
};

export const getReviews = async (gameSlug) => {
  const res = await api.get(`/api/game/${gameSlug}/reviews`);
  return res.data;
};

export const addReview = async (gameSlug, rating, comment) => {
  const res = await api.post(`/api/game/${gameSlug}/reviews`, {
    rating,
    comment,
  });
  return res.data;
};