import './App.css';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './Components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Outlet/>
      <Toaster position='top-right' duration/>
    </ErrorBoundary>
  )
}

export default App;
