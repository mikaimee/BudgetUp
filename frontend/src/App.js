import './App.css';
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Home from './pages/Home/Home';
import Register from './pages/Auth/Register'
import Login from './pages/Auth/Login'
import Main from './pages/Main/Main';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/dashboard' element={<Main/>}/>
      </Routes>
      <Toaster/>
    </div>
  );
}

export default App;
