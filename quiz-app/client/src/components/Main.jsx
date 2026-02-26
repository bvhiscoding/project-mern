import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetAll } from '../redux/question_reducer';
import { resetResultAction, setUserId } from '../redux/result_reducer';

const Main = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  const handleStartQuiz = () => {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      return;
    }

    dispatch(resetAll());
    dispatch(resetResultAction());
    dispatch(setUserId(trimmedUsername));
    navigate('/quiz');
  };

  return (
    <section className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
      {/* Icon */}
      <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center">
        <svg className="w-8 h-8 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-slate-800 mb-2">Quiz App</h1>
      <p className="text-slate-500 mb-8">Enter your username to begin the challenge.</p>

      <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleStartQuiz()}
          placeholder="Your username"
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-150"
        />
        <button
          type="button"
          disabled={!username.trim()}
          onClick={handleStartQuiz}
          className="px-6 py-3 rounded-xl bg-teal-700 text-white font-semibold cursor-pointer transition-all duration-150 hover:bg-teal-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-teal-700 min-h-[44px]"
        >
          Start Quiz
        </button>
      </div>
    </section>
  );
};

export default Main;
