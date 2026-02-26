const express = require('express');
const {
  getQuestions,
  insertQuestions,
  dropQuestions,
  getResult,
  storeResult,
  dropResult
} = require('../controllers/controller');

const router = express.Router();

router.get('/questions', getQuestions);
router.post('/questions', insertQuestions);
router.delete('/questions', dropQuestions);

router.get('/result', getResult);
router.post('/result', storeResult);
router.delete('/result', dropResult);

module.exports = router;
