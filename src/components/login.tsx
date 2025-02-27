import * as React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../estilizacao/login.css';
import InputPassword from './inputPassword';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  // Acessando a variável de ambiente diretamente
  const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, '');
  console.log(API_URL);  // Para verificar se a variável está sendo lida corretamente

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { access_token, user } = data; 
        localStorage.setItem('token', access_token);
        localStorage.setItem('userId', user.id); 
        
        Swal.fire('Bem-vindo!', '', 'success');
        navigate('/todo');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops..',
          text: 'E-mail ou senha incorretos. Por favor, tente novamente.',
        });
      }
    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Algo deu errado, por favor tente novamente mais tarde.',
      });
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Senha</label>
            <InputPassword value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Entrar
          </button>
        </form>

        <p className="text-center mt-3">
          Não tem conta? <Link to="/">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
