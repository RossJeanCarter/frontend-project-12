import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AuthProvider } from './contexts/Authcontext.js';
import Login from './components/Login.jsx';
import MainPage from './components/MainPage.jsx';
import ErrorPage from './components/ErrorPage.jsx';
import store from './store.js';
import './styles.scss';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Provider store={store}>
        <Routes>
          <Route path="*" element={<ErrorPage />} />
          <Route path="login" element={<Login />} />
          <Route path="/" element={<MainPage />} />
        </Routes>
      </Provider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
