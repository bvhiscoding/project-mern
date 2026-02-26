const questions = [
  {
    id: 1,
    question: "JavaScript is a _____ language",
    options: ["Object-Oriented", "Object-Based", "Procedural", "All of the above"]
  },
  {
    id: 2,
    question: "Which method converts JSON string to object?",
    options: ["JSON.convert()", "JSON.parse()", "JSON.stringify()", "JSON.toObject()"]
  },
  {
    id: 3,
    question: "Which hook is used for side effects in React?",
    options: ["useMemo", "useRef", "useEffect", "useCallback"]
  },
  {
    id: 4,
    question: "MongoDB stores data in which format?",
    options: ["XML", "Tables", "BSON Documents", "CSV"]
  },
  {
    id: 5,
    question: "Which HTTP status code means resource created successfully?",
    options: ["200", "201", "400", "500"]
  }
];

const answers = [3, 1, 2, 2, 1];

module.exports = { questions, answers };
