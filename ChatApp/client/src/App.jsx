import './App.css';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Outlet/>
      <Toaster position='top-right' duration/>
    </>
  )
}

export default App;
