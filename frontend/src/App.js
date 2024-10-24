import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/loginPage';
import Dashboard from './components/dashboard';
import NewReportPage from './components/NewReportPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/new-report" element={<NewReportPage />} />  {/* New Report Page */}
      </Routes>
    </Router>
  );
}

export default App;
