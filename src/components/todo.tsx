import React, { useEffect, useState } from "react";
import '../estilizacao/todo.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";


interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface DecodedToken {
  exp: number;
}

function Todo() {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("todas");
  const navigate = useNavigate();
  const API_URL=import.meta.env.VITE_API_URL

  const handleUnauthorized = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleApiResponse = async (response: Response) => {
    if(response.status === 401){
      handleUnauthorized()
      throw new Error('Unauthorized')
    }
    if(!response.ok){
      const errorData = await response.json()
      throw new Error(errorData.message || 'API Error')
    }
    return response
  }

  const checkTokenExpiration = () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      handleUnauthorized();
      return;
    }

  try {
    const decodedToken = jwtDecode<DecodedToken>(storedToken);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      handleUnauthorized();
      Swal.fire({
        title: "Sessão expirada",
        text: "Sua sessão expirou. Por favor, faça login novamente.",
        icon: "warning",
      });
    }
  } catch (error) {
    handleUnauthorized();
  }
};

useEffect(() => {
  checkTokenExpiration()
  fetchTodos();
}, [filter]);
  
const fetchTodos = async () => {
  const token = localStorage.getItem('token');
  if(!token){
    handleUnauthorized();
    return
  }

  try {
    const response = await fetch(`${API_URL}/api/tasks`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    await handleApiResponse(response)
    const data = await response.json();
    setTodoList (data)
  } catch (error) {
    
  }
};

const addTodo = async () => {
  const storedToken = localStorage.getItem('token');
  if (!storedToken) {
    handleUnauthorized();
    return;
  }

  if (!inputValue.trim()) {
    Swal.fire({
      title: "Erro",
      text: "Por favor, insira um texto válido para a tarefa.",
      icon: "error",
    });
    return;
  }

  setLoading(true)

  try {
    const response = await fetch(`${API_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${storedToken}`,
      },
      body: JSON.stringify({ title: inputValue }),
    });
    await handleApiResponse(response);
    
    fetchTodos();
    setInputValue("");
    Swal.fire({
      title: "Tarefa Adicionada!",
      icon: "success",
    });
  } catch (error) {
    if (error instanceof Error && error.message !== 'Unauthorized') {
      Swal.fire({
        title: "Erro",
        text: "Não foi possível adicionar a tarefa. Tente novamente.",
        icon: "error",
      });
    }
  } finally {
    setLoading(false);
  }
};
  const editTask = (index: number) => {
    const todo = todoList[index];
    setInputValue(todo.title);
    setIsEditing(true);
    setEditIndex(index);
  };

  const updateTask = async () => {
    const token = localStorage.getItem('token');

    if (editIndex === null) return;
    if (!inputValue.trim()) {
      Swal.fire({
        title: "Erro",
        text: "Por favor, insira um texto válido para a tarefa.",
        icon: "error",
      });
      return;
    }

    setLoading(true); 

    try {
      const response = await fetch(`${API_URL}/api/tasks/${todoList[editIndex].id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title: inputValue, completed: todoList[editIndex].completed }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Swal.fire({
          title: "Erro",
          text: errorData.message || 'Erro ao atualizar tarefa.',
          icon: "error",
        });
        return;
      }

      setIsEditing(false);
      setEditIndex(null);
      setInputValue("");
      fetchTodos();
      Swal.fire({
        title: "Tarefa Atualizada!",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Erro",
        text: "Não foi possível atualizar a tarefa. Tente novamente.",
        icon: "error",
      });
    } finally {
      setLoading(false); 
    }
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    const token = localStorage.getItem('token');
    const todo = todoList.find(todo => todo.id === id)

    if (!todo) return;

    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title: todo.title, completed: !completed }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Swal.fire({
          title: "Erro",
          text: errorData.message || 'Erro ao atualizar status da tarefa.',
          icon: "error",
        });
        return;
      }

      fetchTodos();
      Swal.fire({
        title: `Tarefa marcada como ${completed ? 'não completada' : 'completada'}!`,
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Erro",
        text: "Não foi possível atualizar status da tarefa. Tente novamente.",
        icon: "error",
      });
    }
  };

  const deleteTask = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        await fetchTodos(); 
        Swal.fire({
          title: "Tarefa Removida!",
          icon: "success",
        });
      } else {
        const error = await response.json();
        Swal.fire({
          title: "Erro",
          text: "Erro ao remover tarefa.",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Erro",
        text: "Erro ao remover tarefa.",
        icon: "error",
      });
    }
  };

  function ToDoList(){


    useEffect(() => {
      searchTask();
    }, [filter])

    const searchTask = async () => {
      try {
        const response = await fetch(`${API_URL}/tarefas?status=${filter}`)
        const data = await response.json()
        setTodoList(data)
      } catch (error) {
      }
    }
  }

  return (
    <>
      <h1>To-Do List</h1>
      <div>
        <button onClick={() => setFilter("todas")}>Todas</button>
        <button onClick={() => setFilter("pendentes")}>Pendentes</button>
        <button onClick={() => setFilter("completas")}>Completas</button>
      </div>

      <section className="section1">
        <div className="input-group">
          <input
            className="form-control"
            type="text"
            placeholder="Digite sua tarefa"
            aria-label="default input example"
            value={inputValue}
            onChange={({ target }) => setInputValue(target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                isEditing ? updateTask() : addTodo();
                return e.preventDefault()
              }
            }}
          />
          <button
            type="button"
            className="btn btn-success"
            onClick={isEditing ? updateTask : addTodo}
            disabled={loading}
          >
            
            {loading ? 'Processando...' : (isEditing ? 'Salvar' : 'Adicionar')}
          </button>
        </div>
      </section>

      <section>
        <h3>Lista de tarefas:</h3>
        <ul>
          {todoList.map((todo, index) => (
            <li key={todo.id}>
              <div className="todo-item">
                <span className={todo.completed ? 'completed' : ''}>
                  {todo.title}
                </span>
                <div>
                  <button onClick={() => editTask(index)}>
                    ✏️
                  </button>
                  <button onClick={() => toggleComplete(todo.id, todo.completed)}>
                    {todo.completed ? '⬜' : '✔️'}
                  </button>
                  <button onClick={() => deleteTask(todo.id)}>
                    ❌
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {todoList.length === 0 && (
          <p>Adicione novas tarefas para começar!</p>
        )}
      </section>
    </>
  );
}

export default Todo;


