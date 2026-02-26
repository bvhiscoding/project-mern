import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './redux/store';

test('renders start quiz button', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const buttonElement = screen.getByRole('button', { name: /start quiz/i });
  expect(buttonElement).toBeInTheDocument();
});
