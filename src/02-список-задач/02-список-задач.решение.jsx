import '../../styles.css';
const { useState } = React;

function TodoItem({ todo, onToggle, onDelete }) {
    return (
        <li className={todo.done ? 'completed' : ''}>
            <div className="todo-item-content">
                <input 
                    type="checkbox" 
                    checked={todo.done}
                    onChange={() => onToggle(todo.id)}
                    className="todo-checkbox"
                />
                <span className="todo-text">{todo.text}</span>
            </div>
            <button 
                className="delete-btn"
                onClick={() => onDelete(todo.id)}
            >
                Удалить
            </button>
        </li>
    );
}

function TodoListView({ todos, onToggle, onDelete }) {
    return (
        <ul className="todo-list">
            {todos.length > 0 ? (
                todos.map(todo => (
                    <TodoItem 
                        key={todo.id} 
                        todo={todo}
                        onToggle={onToggle}
                        onDelete={onDelete}
                    />
                ))
            ) : (
                <li className="no-todos">
                    <span>Нет задач</span>
                </li>
            )}
        </ul>
    );
}

function TodoInput({ value, onChange, onAdd }) {
    return (
        <div className="todo-input">
            <input 
                type="text" 
                placeholder="Новая задача..." 
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <button 
                onClick={onAdd}
                disabled={!value.trim()}
            >
                Добавить
            </button>
        </div>
    );
}

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
            <TodoListView 
                todos={todos}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
            />
            <TodoInput 
                value={newTodo}
                onChange={setNewTodo}
                onAdd={addTodo}
            />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


