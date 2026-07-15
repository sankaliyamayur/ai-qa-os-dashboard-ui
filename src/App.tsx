import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './config/queryClient';
import { AppRoutes } from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-bg-primary text-text-main transition-colors duration-standard">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
