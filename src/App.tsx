import Todolist from './components/todo';
import Cadastro from './components/cadastro';
import Login from './components/login';
import './estilizacao/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import React from 'react';
import NotFound from './components';

function App() {

  const navigate = useNavigate();
  const Location = useLocation();

  useEffect(() => {
    const publicRoutes = ['/login', '/cadastro'];
    const token = localStorage.getItem('token');
  
    if(!token && !publicRoutes.includes(location.pathname)){
      navigate('/login');
    }
  },[location]);

  return (
    <Routes>
      <Route path='/todo' element={<Todolist />} />
      <Route path='/' element={<Cadastro />} />
      <Route path='/login' element={<Login />} />
      <Route path='/*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
