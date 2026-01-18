import React, { useState } from 'react';

import './style.css';

function ContactsHeader({ search, onChange, count }) {
    return (
        <div className="contacts-header">
            <h3>Контакты ({count})</h3>
            <input
                type="text"
                placeholder="Поиск контактов..."
                value={search}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

function ContactAvatar({ avatar, status }) {
    return (
        <div className="contact-avatar">
            <div className="avatar-emoji">{avatar}</div>
            <div className={`status ${status}`}></div>
        </div>
    );
}

function ContactInfo({ name, status, lastSeen }) {
    const statusText = status === 'online' ? 'online' : `был(а) ${lastSeen}`;

    return (
        <div className="contact-info">
            <strong>{name}</strong>
            <span className="status-text">{statusText}</span>
        </div>
    );
}

function MessageButton({ onMessage }) {
    return (
        <button
            className="message-btn"
            onClick={onMessage}
        >
            Написать
        </button>
    );
}

function ContactItem({ contact, onMessage }) {
    return (
        <div className="contact">
            <ContactAvatar
                avatar={contact.avatar}
                status={contact.status}
            />
            <ContactInfo
                name={contact.name}
                status={contact.status}
                lastSeen={contact.lastSeen}
            />
            <MessageButton onMessage={() => onMessage(contact.id)} />
        </div>
    );
}

function NoContacts() {
    return (
        <div className="no-contacts">
            <p>Контакты не найдены</p>
        </div>
    );
}

function ContactsList({ contacts, onMessage }) {
    return (
        <div className="contacts-list">
            {contacts.length > 0 ? (
                contacts.map((contact) => (
                    <ContactItem
                        key={contact.id}
                        contact={contact}
                        onMessage={onMessage}
                    />
                ))
            ) : (
                <NoContacts />
            )}
        </div>
    );
}

function App() {
    const [contacts, setContacts] = useState([
        {
            id: 1,
            name: 'Анна Петрова',
            status: 'online',
            lastSeen: 'только что',
            gender: 'female',
            avatar: '👩',
        },
        {
            id: 2,
            name: 'Иван Сидоров',
            status: 'offline',
            lastSeen: '2 часа назад',
            gender: 'male',
            avatar: '👨',
        },
        {
            id: 3,
            name: 'Мария Козлова',
            status: 'online',
            lastSeen: '5 минут назад',
            gender: 'female',
            avatar: '👩‍💻',
        },
        {
            id: 4,
            name: 'Алексей Волков',
            status: 'offline',
            lastSeen: '1 день назад',
            gender: 'male',
            avatar: '🧑',
        },
        {
            id: 5,
            name: 'Елена Смирнова',
            status: 'online',
            lastSeen: 'только что',
            gender: 'female',
            avatar: '👨‍💻',
        },
    ]);
    const [search, setSearch] = useState('');

    const filteredContacts = contacts.filter((contact) =>
        contact.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleMessage = (contactId) => {
        const contact = contacts.find((c) => c.id === contactId);
        alert(`Открываем чат с ${contact.name}`);
    };

    return (
        <div className="contacts">
            <ContactsHeader
                search={search}
                onChange={setSearch}
                count={filteredContacts.length}
            />
            <ContactsList
                contacts={filteredContacts}
                onMessage={handleMessage}
            />
        </div>
    );
}

export default App;
