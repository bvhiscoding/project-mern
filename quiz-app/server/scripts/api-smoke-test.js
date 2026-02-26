const BASE_URL = process.env.API_URL || 'http://localhost:8080';

const request = async (path, options = {}) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch (error) {
    data = text;
  }

  return { status: response.status, data };
};

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const run = async () => {
  console.log(`Running API smoke tests against ${BASE_URL}`);

  const health = await request('/health');
  assert(health.status === 200, 'GET /health should return 200');

  const dropResults = await request('/api/result', { method: 'DELETE' });
  assert(dropResults.status === 200, 'DELETE /api/result should return 200');

  const dropQuestions = await request('/api/questions', { method: 'DELETE' });
  assert(dropQuestions.status === 200, 'DELETE /api/questions should return 200');

  const questions = await request('/api/questions');
  assert(questions.status === 200, 'GET /api/questions should return 200');
  assert(questions.data?.success === true, 'GET /api/questions should return success=true');
  assert(Array.isArray(questions.data?.data?.questions), 'questions should be an array');
  assert(Array.isArray(questions.data?.data?.answers), 'answers should be an array');
  assert(questions.data?.data?.questions.length >= 5, 'should auto-seed at least 5 questions');

  const badResult = await request('/api/result', {
    method: 'POST',
    body: JSON.stringify({ username: '', result: [] })
  });
  assert(badResult.status === 400, 'invalid POST /api/result should return 400');

  const payload = {
    username: 'api-test-user',
    result: [1, 2, -1, 0, 1],
    attempts: 4,
    points: 3,
    achieved: 'Good Job!'
  };

  const createResult = await request('/api/result', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  assert(createResult.status === 201, 'POST /api/result should return 201');
  assert(createResult.data?.success === true, 'POST /api/result should return success=true');

  const results = await request('/api/result?limit=10&page=1');
  assert(results.status === 200, 'GET /api/result should return 200');
  assert(Array.isArray(results.data?.data?.results), 'results should be an array');
  assert(results.data?.data?.results.length >= 1, 'results should contain created record');

  console.log('All API smoke tests passed');
};

run().catch((error) => {
  console.error('API smoke test failed:', error.message);
  process.exit(1);
});
