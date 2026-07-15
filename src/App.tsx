import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg-primary text-text-main transition-colors duration-standard">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
