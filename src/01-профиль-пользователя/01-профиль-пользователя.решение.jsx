import './style.css';
const { useState } = React;

function ProfileHeader({ avatarSrc, name, role }) {
    return (
        <div className="profile-header">
            <img src={avatarSrc} alt="Avatar" />
            <h2>{name}</h2>
            <p>{role}</p>
        </div>
    );
}

function ProfileDetails({ email, phone }) {
    return (
        <div className="profile-details">
            <p>Email: {email}</p>
            <p>Телефон: {phone}</p>
            <button>Редактировать профиль</button>
        </div>
    );
}

function App() {
    return (
        <div className="profile">
            <ProfileHeader avatarSrc="avatar.jpeg" name="Иван Иванов" role="Frontend-разработчик" />
            <ProfileDetails email="ivan@example.com" phone="+7 999 123-45-67" />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


