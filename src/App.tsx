import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ModuleProvider } from './contexts/ModuleContext';
import { AppRoutes } from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ModuleProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-bg-primary text-text-main transition-colors duration-standard">
              <AppRoutes />
            </div>
          </BrowserRouter>
        </ModuleProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
