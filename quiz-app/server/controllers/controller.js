const Question = require('../models/questionSchema');
const Result = require('../models/resultSchema');
const { questions: seedQuestions, answers: seedAnswers } = require('../database/data');

const sendError = (res, status, message, details = null) => (
  res.status(status).json({
    success: false,
    message,
    ...(details ? { details } : {})
  })
);

const sendSuccess = (res, status, message, data = null) => (
  res.status(status).json({
    success: true,
    message,
    ...(data ? { data } : {})
  })
);

const normalizeQuestionsResponse = (doc) => {
  const questions = doc.questions || [];
  const answers = doc.answers || [];

  return {
    questions,
    answers,
    total: questions.length
  };
};

const validateQuestionPayload = (questions, answers) => {
  if (!Array.isArray(questions) || !Array.isArray(answers)) {
    return 'questions and answers must be arrays';
  }

  if (!questions.length) {
    return 'questions cannot be empty';
  }

  if (questions.length !== answers.length) {
    return 'questions and answers length must match';
  }

  const hasInvalidQuestion = questions.some((item, index) => {
    if (!item || typeof item !== 'object') {
      return true;
    }

    if (!Number.isInteger(item.id) || item.id <= 0) {
      return true;
    }

    if (typeof item.question !== 'string' || !item.question.trim()) {
      return true;
    }

    if (!Array.isArray(item.options) || item.options.length < 2) {
      return true;
    }

    if (item.options.some((option) => typeof option !== 'string' || !option.trim())) {
      return true;
    }

    const answer = answers[index];
    if (!Number.isInteger(answer) || answer < 0 || answer >= item.options.length) {
      return true;
    }

    return false;
  });

  if (hasInvalidQuestion) {
    return 'invalid question or answer format';
  }

  return null;
};

const validateResultPayload = ({ username, result, attempts, points, achieved }) => {
  if (!username || typeof username !== 'string' || !username.trim()) {
    return 'username is required';
  }

  if (!Array.isArray(result)) {
    return 'result must be an array';
  }

  if (result.some((item) => !Number.isInteger(item) || item < -1)) {
    return 'result values must be integers greater than or equal to -1';
  }

  if (!Number.isInteger(attempts) || attempts < 0) {
    return 'attempts must be a non-negative integer';
  }

  if (typeof points !== 'number' || points < 0) {
    return 'points must be a non-negative number';
  }

  if (achieved !== undefined && typeof achieved !== 'string') {
    return 'achieved must be a string';
  }

  return null;
};

const getQuestions = async (req, res) => {
  try {
    let questionDoc = await Question.findOne().sort({ createdAt: -1 }).lean();

    if (!questionDoc) {
      const created = await Question.create({
        questions: seedQuestions,
        answers: seedAnswers
      });
      questionDoc = created.toObject();
    }

    return sendSuccess(res, 200, 'Questions fetched successfully', normalizeQuestionsResponse(questionDoc));
  } catch (error) {
    console.error('getQuestions error:', error);
    return sendError(res, 500, error.message);
  }
};

const insertQuestions = async (req, res) => {
  try {
    const { questions, answers } = req.body;
    const validationError = validateQuestionPayload(questions, answers);

    if (validationError) {
      return sendError(res, 400, validationError);
    }

    const created = await Question.create({ questions, answers });
    return sendSuccess(res, 201, 'Questions inserted successfully', { id: created._id });
  } catch (error) {
    console.error('insertQuestions error:', error);
    return sendError(res, 500, error.message);
  }
};

const dropQuestions = async (req, res) => {
  try {
    const deleted = await Question.deleteMany({});
    return sendSuccess(res, 200, 'Questions deleted successfully', { deletedCount: deleted.deletedCount });
  } catch (error) {
    console.error('dropQuestions error:', error);
    return sendError(res, 500, error.message);
  }
};

const getResult = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Math.min(Number.parseInt(req.query.limit, 10) || 50, 100);
    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([
      Result.find()
        .sort({ points: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Result.countDocuments()
    ]);

    return sendSuccess(res, 200, 'Results fetched successfully', {
      results,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1
    });
  } catch (error) {
    console.error('getResult error:', error);
    return sendError(res, 500, error.message);
  }
};

const storeResult = async (req, res) => {
  try {
    const {
      username,
      result = [],
      attempts = 0,
      points = 0,
      achieved = ''
    } = req.body;

    const validationError = validateResultPayload({ username, result, attempts, points, achieved });
    if (validationError) {
      return sendError(res, 400, validationError);
    }

    const savedResult = await Result.create({
      username: username.trim(),
      result,
      attempts,
      points,
      achieved
    });

    return sendSuccess(res, 201, 'Result saved successfully', { result: savedResult });
  } catch (error) {
    console.error('storeResult error:', error);
    return sendError(res, 500, error.message);
  }
};

const dropResult = async (req, res) => {
  try {
    const deleted = await Result.deleteMany({});
    return sendSuccess(res, 200, 'Results deleted successfully', { deletedCount: deleted.deletedCount });
  } catch (error) {
    console.error('dropResult error:', error);
    return sendError(res, 500, error.message);
  }
};

module.exports = {
  getQuestions,
  insertQuestions,
  dropQuestions,
  getResult,
  storeResult,
  dropResult
};
