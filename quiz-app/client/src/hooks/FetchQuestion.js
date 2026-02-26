import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getServerData } from '../helper/helper';
import { moveNext, movePrev, startExam } from '../redux/question_reducer';

const QUIZ_SIZE = 25;

const pickRandomQuestions = (questions = [], answers = [], size = QUIZ_SIZE) => {
  const pairs = questions.map((question, index) => ({
    question,
    answer: answers[index]
  }));

  const shuffled = [...pairs];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  const selected = shuffled.slice(0, Math.min(size, shuffled.length));

  return {
    questions: selected.map((item) => item.question),
    answers: selected.map((item) => item.answer)
  };
};

export const useFetchQuestion = () => {
  const dispatch = useDispatch();

  const [fetchState, setFetchState] = useState({
    isLoading: false,
    apiData: null,
    serverError: null
  });

  useEffect(() => {
    let isMounted = true;

    const fetchQuestions = async () => {
      setFetchState((prev) => ({ ...prev, isLoading: true }));

      try {
        const data = await getServerData('/api/questions');
        const randomizedData = pickRandomQuestions(data?.questions || [], data?.answers || []);

        if (!isMounted) {
          return;
        }

        dispatch(startExam({
          questions: randomizedData.questions,
          answers: randomizedData.answers
        }));

        setFetchState({
          isLoading: false,
          apiData: randomizedData,
          serverError: null
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setFetchState({
          isLoading: false,
          apiData: null,
          serverError: error.response?.data?.message || error.message
        });
      }
    };

    fetchQuestions();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return fetchState;
};

export const MoveNextQuestion = () => {
  return (dispatch, getState) => {
    const { trace, queue } = getState().questions;

    if (trace < queue.length - 1) {
      dispatch(moveNext());
    }
  };
};

export const MovePrevQuestion = () => {
  return (dispatch, getState) => {
    const { trace } = getState().questions;

    if (trace > 0) {
      dispatch(movePrev());
    }
  };
};
