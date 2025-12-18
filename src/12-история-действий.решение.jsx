import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
function ActivityHeader({ filter, onFilterChange, count }) {
    return (
        <div className="activity-header">
            <h3>История действий ({count})</h3>
            <select value={filter} onChange={onFilterChange}>
                <option value="all">За все время</option>
                <option value="today">За сегодня</option>
                <option value="week">За неделю</option>
            </select>
        </div>
    );
}

function ActivityItem({ activity }) {
    return (
        <div className="activity-item">
            <div className="activity-icon">{activity.icon}</div>
            <div className="activity-content">
                <p>{activity.text}</p>
                <span className="activity-time">{activity.time}</span>
            </div>
        </div>
    );
}

function ActivityList({ activities }) {
    return (
        <div className="activity-list">
            {activities.length > 0 ? (
                activities.map(activity => (
                    <ActivityItem key={activity.id} activity={activity} />
                ))
            ) : (
                <div className="no-activities">
                    <p>Действия не найдены</p>
                </div>
            )}
        </div>
    );
}

function App() {
    const [activities, setActivities] = useState([
        { id: 1, type: 'login', text: 'Вы выполнили вход в систему', time: 'Сегодня, 10:30', icon: '🔐', date: new Date() },
        { id: 2, type: 'edit', text: 'Отредактирован профиль пользователя', time: 'Вчера, 15:45', icon: '✏️', date: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        { id: 3, type: 'upload', text: 'Загружен новый файл', time: 'Вчера, 12:20', icon: '📁', date: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        { id: 4, type: 'delete', text: 'Удален документ', time: '2 дня назад, 09:15', icon: '🗑️', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
        { id: 5, type: 'create', text: 'Создан новый проект', time: '3 дня назад, 14:30', icon: '📝', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
        { id: 6, type: 'share', text: 'Поделились файлом с коллегами', time: 'Неделю назад, 16:45', icon: '🔗', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    ]);
    const [filter, setFilter] = useState('all');

    const getFilteredActivities = () => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        switch (filter) {
            case 'today':
                return activities.filter(activity => activity.date >= today);
            case 'week':
                return activities.filter(activity => activity.date >= weekAgo);
            default:
                return activities;
        }
    };

    const filteredActivities = getFilteredActivities();

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    return (
        <div className="activity-history">
            <ActivityHeader 
                filter={filter}
                onFilterChange={handleFilterChange}
                count={filteredActivities.length}
            />
            <ActivityList activities={filteredActivities} />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


