// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login/Login';
import ProtectedRoute from './Components/ProtectedRoute';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/dashbord"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
