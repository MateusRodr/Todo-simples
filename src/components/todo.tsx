import { useState } from "react";
import * as React from "react";
import '../estilizacao/todo.css';
import Swal from 'sweetalert2';
import { useEffect } from "react";


interface Todo {
  id: string;
  title: string;
  completed: boolean;
}


function Todo() {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("todas");


  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if(savedTodos){
      setTodoList(JSON.parse(savedTodos));
    }
  },[])
  
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todoList));
  }, [todoList]);

  const addTodo = () => {
    if (!inputValue.trim()) {
      Swal.fire({
        title: "Erro",
        text: "Por favor, insira um texto válido para a tarefa.",
        icon: "error",
      });
      return;
    }

    const newTodo: Todo = {
      id: Date.now().toString(),
      title: inputValue,
      completed: false,
    };

    setTodoList([...todoList, newTodo]);
    setInputValue("");
    Swal.fire({
      title: "Tarefa Adicionada!",
      icon: "success",
    });
  };

  const editTask = (index: number) => {
    const todo = todoList[index];
    setInputValue(todo.title);
    setIsEditing(true);
    setEditIndex(index);
  };

  const updateTask = () => {
    if (editIndex === null || !inputValue.trim()) {
      Swal.fire({
        title: "Erro",
        text: "Por favor, insira um texto válido para a tarefa.",
        icon: "error",
      });
      return;
    }

    const updatedList = [...todoList];
    updatedList[editIndex] = {
      ...updatedList[editIndex],
      title: inputValue,
    };

    setTodoList(updatedList);
    setIsEditing(false);
    setEditIndex(null);
    setInputValue("");
    Swal.fire({
      title: "Tarefa Atualizada!",
      icon: "success",
    });
  };

  const toggleComplete = (id: string) => {
    const updatedList = todoList.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodoList(updatedList);
  };

  const deleteTask = (id: string) => {
    const updatedList = todoList.filter(todo => todo.id !== id);
    setTodoList(updatedList);
    Swal.fire({
      title: "Tarefa Excluída!",
      icon: "success",
    });
  };

  const filteredTodos = todoList.filter(todo => {
    if (filter === "pendentes") return !todo.completed;
    if (filter === "completas") return todo.completed;
    return true;
  });

  return (
    <>
<h1>To-Do List</h1>

<div className="btn-group" role="group" aria-label="Basic example">
  <button
    className={`btn btn-todas ${filter === 'todas' ? '' : 'btn-inactive'}`}
    onClick={() => setFilter("todas")}
  >
    Todas
  </button>
  <button
    className={`btn btn-pendentes ${filter === 'pendentes' ? '' : 'btn-inactive'}`}
    onClick={() => setFilter("pendentes")}
  >
    Pendentes
  </button>
  <button
    className={`btn btn-completas ${filter === 'completas' ? '' : 'btn-inactive'}`}
    onClick={() => setFilter("completas")}
  >
    Completas
  </button>
</div>

<section className="section1">
  <div className="input-container">
    <input
      className="form-control"
      type="text"
      placeholder="📝Digite sua tarefa ..."
      value={inputValue}
      onChange={({ target }) => setInputValue(target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          isEditing ? updateTask() : addTodo();
          return e.preventDefault();
        }
      }}
    />
    <button
      type="button"
      className="add-btn"
      onClick={isEditing ? updateTask : addTodo}
      disabled={loading}
    >
      {loading ? '...' : (isEditing ? '💾' : '+')}
    </button>
  </div>
</section>

<section>
  <h3>
    {filter === 'pendentes'
      ? 'Todas as tarefas pendentes:'
      : filter === 'completas'
      ? 'Todas as tarefas concluídas:'
      : 'Todas as tarefas:'}
  </h3>

        <ul>
          {filteredTodos.map((todo, index) => (
            <li key={todo.id}>
              <div className="todo-item">
                <span className={todo.completed ? 'completed' : ''}>
                  {todo.title}
                </span>
                <div>
                  <button onClick={() => editTask(index)}>✏️</button>
                  <button onClick={() => toggleComplete(todo.id)}>
                    {todo.completed ? '⬜' : '✔️'}
                  </button>
                  <button onClick={() => deleteTask(todo.id)}>❌</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {todoList.length === 0 && (
          <p>✨ Sem tarefas! Adicione uma nova. </p>
        )}
      </section>
    </>
  );
}

export default Todo;

