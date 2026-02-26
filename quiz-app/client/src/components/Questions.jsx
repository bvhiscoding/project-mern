import { useDispatch, useSelector } from 'react-redux';
import { pushResultAction } from '../redux/result_reducer';

const Questions = ({ question, trace }) => {
  const dispatch = useDispatch();
  const selectedAnswer = useSelector((state) => state.result.result[trace]);

  if (!question) {
    return null;
  }

  const handleSelectOption = (selectedIndex) => {
    dispatch(pushResultAction({ trace, selectedIndex }));
  };

  return (
    <article>
      <h2 className="text-lg font-semibold text-slate-800 mb-5 leading-snug">{question.question}</h2>

      <ul className="space-y-3">
        {question.options.map((option, index) => {
          const optionId = `q-${question.id}-option-${index}`;
          const isSelected = selectedAnswer === index;

          return (
            <li key={optionId}>
              <label
                htmlFor={optionId}
                className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-150 min-h-[44px] ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50 text-teal-800'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-slate-50'
                }`}
              >
                <input
                  id={optionId}
                  type="radio"
                  name={`question-${trace}`}
                  checked={isSelected}
                  onChange={() => handleSelectOption(index)}
                  className="sr-only"
                />
                {/* Custom radio indicator */}
                <span
                  className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors duration-150 ${
                    isSelected ? 'border-teal-600 bg-teal-600' : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                </span>
                <span className="text-sm font-medium">{option}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </article>
  );
};

export default Questions;
