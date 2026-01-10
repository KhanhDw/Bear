import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import AppProvider from './contexts/AppProvider';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App
