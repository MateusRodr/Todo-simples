import Todolist from './components/todo';
import './estilizacao/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as React from 'react';
import NotFound from './components/index'; 

function App() {

  return (
    <Routes>
      <Route path='/' element={<Todolist />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;