import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000
});

const unwrapResponse = (payload) => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data;
  }

  return payload;
};

export async function getServerData(url, callback) {
  const response = await apiClient.get(url);
  const payload = unwrapResponse(response.data);
  return callback ? callback(payload) : payload;
}

export async function postServerData(url, body, callback) {
  const response = await apiClient.post(url, body);
  const payload = unwrapResponse(response.data);
  return callback ? callback(payload) : payload;
}

export function attempts(result = []) {
  return result.reduce((count, answer) => (answer === null || answer === undefined || answer < 0 ? count : count + 1), 0);
}

export function earnPoints(result = [], answers = [], pointPerQuestion = 1) {
  return result.reduce((points, answer, index) => {
    if (answer === answers[index]) {
      return points + pointPerQuestion;
    }

    return points;
  }, 0);
}

export function flagResult(points = 0, totalPoints = 0) {
  if (!totalPoints) {
    return 'Try Again!';
  }

  const scorePercent = (points / totalPoints) * 100;

  if (scorePercent >= 80) {
    return 'Excellent!';
  }

  if (scorePercent >= 60) {
    return 'Good Job!';
  }

  if (scorePercent >= 40) {
    return 'Average';
  }

  return 'Try Again!';
}
