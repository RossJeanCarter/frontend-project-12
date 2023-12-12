import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/Authcontext.js';
import Login from './components/Login.jsx';
import MainPage from './components/MainPage.jsx';
import ErrorPage from './components/ErrorPage.jsx';
import './styles.scss';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="*" element={<ErrorPage />} />
        <Route path="login" element={<Login />} />
        <Route path="/" element={<MainPage />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
