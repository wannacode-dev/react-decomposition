import React, { useState } from 'react';

import './style.css';

function ProfileHeader({ avatarSrc, name, role }) {
    return (
        <div className="profile-header">
            <div className="avatar-emoji">{avatarSrc}</div>
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
            <ProfileHeader
                avatarSrc="👨"
                name="Иван Иванов"
                role="Frontend-разработчик"
            />
            <ProfileDetails
                email="ivan@example.com"
                phone="+7 999 123-45-67"
            />
        </div>
    );
}

export default App;
