// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login.jsx';
import MainPage from './components/MainPage.jsx';
import ErrorPage from './components/ErrorPage.jsx';
import './styles.scss';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="*" element={<ErrorPage />} />
      <Route path="/" element={<MainPage />} />
      <Route path="login" element={<Login />} />
    </Routes>
  </BrowserRouter>
);

export default App;
