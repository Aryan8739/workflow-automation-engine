import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Docs from './pages/Docs';
import Auth from './pages/Auth';
import AppPage from './pages/AppPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/app" element={<AppPage />} />
    </Routes>
  );
}
