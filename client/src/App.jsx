import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Docs from './pages/Docs';
import Auth from './pages/Auth';
import AppPage from './pages/AppPage';
import useAuthStore from './store/authStore';

export default function App() {
  const loadMe = useAuthStore((s) => s.loadMe);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/app" element={<AppPage />} />
    </Routes>
  );
}
