import { Navigate, Route, Routes } from 'react-router-dom';

import AuthPage from './pages/AuthPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import InterviewPage from './pages/InterviewPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import Layout from './components/Layout.jsx';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
