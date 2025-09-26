import './style.css';

function App() {
    return (
        <div className="registration">
            <h2>Регистрация</h2>
            <form>
                <div className="form-group">
                    <label>Имя</label>
                    <input type="text" placeholder="Введите ваше имя" />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="Введите ваш email" />
                </div>
                <div className="form-group">
                    <label>Пароль</label>
                    <input type="password" placeholder="Придумайте пароль" />
                </div>
                <div className="form-group">
                    <label>Подтверждение пароля</label>
                    <input type="password" placeholder="Повторите пароль" />
                </div>
                <button type="submit">Зарегистрироваться</button>
                <p>Уже есть аккаунт? <a href="/login">Войти</a></p>
            </form>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


