import Todolist from './components/todo';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
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