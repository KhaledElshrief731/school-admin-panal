import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import './i18n';
import App from './App';
import ReduxToast from './components/ui/ReduxToast';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <ReduxToast />
      </BrowserRouter> 
    </Provider>
  </StrictMode>
);