import './style.css';
const { useState } = React;

function FormGroup({ label, type, placeholder }) {
    return (
        <div className="form-group">
            <label>{label}</label>
            <input type={type} placeholder={placeholder} />
        </div>
    );
}

function RegisterLink() {
    return (
        <p>Уже есть аккаунт? <a href="/login">Войти</a></p>
    );
}

function RegistrationForm() {
    return (
        <form>
            <FormGroup label="Имя" type="text" placeholder="Введите ваше имя" />
            <FormGroup label="Email" type="email" placeholder="Введите ваш email" />
            <FormGroup label="Пароль" type="password" placeholder="Придумайте пароль" />
            <FormGroup label="Подтверждение пароля" type="password" placeholder="Повторите пароль" />
            <button type="submit">Зарегистрироваться</button>
            <RegisterLink />
        </form>
    );
}

function App() {
    return (
        <div className="registration">
            <h2>Регистрация</h2>
            <RegistrationForm />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


