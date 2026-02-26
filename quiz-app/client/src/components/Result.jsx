import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { attempts, earnPoints, flagResult } from '../helper/helper';
import useSaveResult from '../hooks/setResult';
import { resetAll } from '../redux/question_reducer';
import { resetResultAction } from '../redux/result_reducer';

const Result = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasSavedRef = useRef(false);

  const userId = useSelector((state) => state.result.userId);
  const selectedResult = useSelector((state) => state.result.result);
  const answers = useSelector((state) => state.questions.answers);

  const { isSaving, saveError, saveResult } = useSaveResult();

  const attemptCount = attempts(selectedResult);
  const totalPoints = earnPoints(selectedResult, answers, 1);
  const label = flagResult(totalPoints, answers.length);

  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }

    if (!answers.length || hasSavedRef.current) {
      return;
    }

    hasSavedRef.current = true;
    const sanitizedResult = Array.from({ length: answers.length }, (_, i) =>
      Number.isInteger(selectedResult[i]) && selectedResult[i] >= -1 ? selectedResult[i] : -1
    );
    saveResult({
      username: userId,
      result: sanitizedResult,
      attempts: attemptCount,
      points: totalPoints,
      achieved: label
    }).catch(() => {
      hasSavedRef.current = false;
    });
  }, [answers.length, attemptCount, label, navigate, saveResult, selectedResult, totalPoints, userId]);

  const handleRestart = () => {
    dispatch(resetAll());
    dispatch(resetResultAction());
    navigate('/');
  };

  const stats = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      label: 'Username',
      value: userId,
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      label: 'Score',
      value: `${totalPoints} / ${answers.length}`,
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      label: 'Attempts',
      value: attemptCount,
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      label: 'Achievement',
      value: label,
    },
  ];

  return (
    <section className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center">
          <svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-1">Quiz Result</h1>
        <p className="text-slate-500">Here's how you did!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {stats.map(({ icon, label: statLabel, value }) => (
          <div key={statLabel} className="flex items-center gap-4 rounded-xl bg-slate-50 border border-slate-100 p-4">
            <span className="text-teal-700 flex-shrink-0">{icon}</span>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">{statLabel}</p>
              <p className="text-base font-semibold text-slate-800">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {isSaving ? (
        <p className="text-center text-sm text-slate-400 mb-6">Saving result...</p>
      ) : null}
      {saveError ? (
        <p className="text-center text-sm text-red-500 mb-6">Save failed: {saveError}</p>
      ) : null}

      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <button
          type="button"
          onClick={handleRestart}
          className="px-6 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-semibold cursor-pointer transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 active:scale-95 min-h-[44px]"
        >
          Restart
        </button>
        <Link
          to="/scoreboard"
          className="px-6 py-3 rounded-xl bg-teal-700 text-white font-semibold text-center transition-all duration-150 hover:bg-teal-600 active:scale-95 min-h-[44px] flex items-center justify-center"
        >
          Scoreboard
        </Link>
      </div>
    </section>
  );
};

export default Result;
