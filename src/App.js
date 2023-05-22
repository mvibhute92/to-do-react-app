import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from './modules/dashboard/dashboard';
import NoPage from './notfound';

function App() {
  return (
  
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardPage />}>
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>

  );
}

export default App;
