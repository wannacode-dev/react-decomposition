import './style.css';
const { useState } = React;

function App() {
    const [todos, setTodos] = useState([
        { id: 1, text: 'Купить молоко', done: false },
        { id: 2, text: 'Выучить React', done: true }
    ]);
    const [newTodo, setNewTodo] = useState('');

    const addTodo = () => {
        if (newTodo.trim()) {
            const todo = {
                id: todos.length + 1,
                text: newTodo.trim(),
                done: false
            };
            setTodos([...todos, todo]);
            setNewTodo('');
        }
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(todo => 
            todo.id === id ? { ...todo, done: !todo.done } : todo
        ));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const completedCount = todos.filter(todo => todo.done).length;
    const totalCount = todos.length;

    return (
        <div className="todo-app">
            <h1>Мои задачи ({completedCount}/{totalCount})</h1>
            <ul className="todo-list">
                {todos.length > 0 ? (
                    todos.map(todo => (
                        <li key={todo.id} className={todo.done ? 'completed' : ''}>
                            <div className="todo-item-content">
                                <input 
                                    type="checkbox" 
                                    checked={todo.done}
                                    onChange={() => toggleTodo(todo.id)}
                                    className="todo-checkbox"
                                />
                                <span className="todo-text">{todo.text}</span>
                            </div>
                            <button 
                                className="delete-btn"
                                onClick={() => deleteTodo(todo.id)}
                            >
                                Удалить
                            </button>
                        </li>
                    ))
                ) : (
                    <li className="no-todos">
                        <span>Нет задач</span>
                    </li>
                )}
            </ul>
            <div className="todo-input">
                <input 
                    type="text" 
                    placeholder="Новая задача..." 
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                />
                <button 
                    onClick={addTodo}
                    disabled={!newTodo.trim()}
                >
                    Добавить
                </button>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


