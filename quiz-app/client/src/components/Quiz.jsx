import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MoveNextQuestion, MovePrevQuestion, useFetchQuestion } from '../hooks/FetchQuestion';
import Questions from './Questions';

const Quiz = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, serverError } = useFetchQuestion();

  const userId = useSelector((state) => state.result.userId);
  const trace = useSelector((state) => state.questions.trace);
  const queue = useSelector((state) => state.questions.queue);

  useEffect(() => {
    if (!userId) {
      navigate('/');
    }
  }, [userId, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <svg className="animate-spin h-8 w-8 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-sm font-medium">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (serverError) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center">
        <p className="text-red-600 font-medium">Failed to load questions</p>
        <p className="text-red-400 text-sm mt-1">{serverError}</p>
      </div>
    );
  }

  if (!queue.length) {
    return (
      <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 text-center">
        <p className="text-slate-500 text-sm">No questions available.</p>
      </div>
    );
  }

  const isLastQuestion = trace >= queue.length - 1;
  const progressPercent = Math.round(((trace + 1) / queue.length) * 100);

  const handleNext = () => {
    if (isLastQuestion) {
      navigate('/result');
      return;
    }

    dispatch(MoveNextQuestion());
  };

  const handlePrev = () => {
    dispatch(MovePrevQuestion());
  };

  return (
    <section className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Quiz</h1>
        <span className="text-sm font-medium text-slate-400">
          Question <span className="text-teal-600 font-semibold">{trace + 1}</span> / {queue.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-teal-600 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
          role="progressbar"
          aria-valuenow={trace + 1}
          aria-valuemin={1}
          aria-valuemax={queue.length}
        />
      </div>

      {/* Question */}
      <Questions question={queue[trace]} trace={trace} />

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={handlePrev}
          disabled={trace === 0}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-sm font-medium cursor-pointer transition-all duration-150 hover:bg-slate-50 hover:border-slate-400 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Prev
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-700 text-white text-sm font-semibold cursor-pointer transition-all duration-150 hover:bg-teal-800 active:scale-95 shadow-sm"
        >
          {isLastQuestion ? 'Finish' : 'Next'}
          {!isLastQuestion && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          )}
          {isLastQuestion && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
      </div>
    </section>
  );
};

export default Quiz;
