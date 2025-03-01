import * as React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../estilizacao/cadastro.css';
import InputPassword from './inputPassword';



function Cadastro() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://back-end-todo-demec89mg-mateusrodrs-projects.vercel.app/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password }),
      });

      if (response.ok) {
        Swal.fire({
          title: 'Usuário criado com sucesso!',
          icon: 'success',
        });
        navigate('/login');
      } else {
        Swal.fire({
          title: 'Erro ao criar usuário.',
          icon: 'error',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Erro ao criar usuário.',
        icon: 'error',
      });
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: '400px' }}>
        <h3 className="text-center mb-4">Cadastre-se</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">Nome</label>
            <input
              type="text"
              id="name"
              className="form-control"
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Senha</label>
            <InputPassword value={password} onChange={(e) => setPassword(e.target.value)} />

          </div>

          <button type="submit" className="btn btn-primary w-100">Cadastrar</button>

          <div className="text-center mt-3">
            <span>Já possui conta? </span>
            <Link to="/login">Faça seu login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Cadastro;
