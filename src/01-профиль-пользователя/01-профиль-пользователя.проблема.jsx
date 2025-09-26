import './style.css';

function App() {
    return (
        <div className="profile">
            <div className="profile-header">
                <img src="avatar.jpeg" alt="Avatar" />
                <h2>Иван Иванов</h2>
                <p>Frontend-разработчик</p>
            </div>
            <div className="profile-details">
                <p>Email: ivan@example.com</p>
                <p>Телефон: +7 999 123-45-67</p>
                <button>Редактировать профиль</button>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


