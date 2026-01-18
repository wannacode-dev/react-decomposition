import React, { useState } from 'react';

import './style.css';

function NotificationsHeader({ unreadCount, onMarkAllAsRead }) {
    return (
        <div className="notifications-header">
            <h3>Уведомления {unreadCount > 0 && `(${unreadCount})`}</h3>
            <button
                onClick={onMarkAllAsRead}
                disabled={unreadCount === 0}
            >
                Пометить все как прочитанные
            </button>
        </div>
    );
}

function NotificationIcon({ type }) {
    const getIcon = () => {
        switch (type) {
            case 'info':
                return 'ℹ️';
            case 'warning':
                return '⚠️';
            default:
                return '';
        }
    };

    return <div className="notification-icon">{getIcon()}</div>;
}

function NotificationContent({ title, text, time }) {
    return (
        <div className="notification-content">
            <h4>{title}</h4>
            <p>{text}</p>
            <span className="time">{time}</span>
        </div>
    );
}

function CloseButton({ onClose }) {
    return (
        <button
            className="close-btn"
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}
        >
            ×
        </button>
    );
}

function NotificationItem({ notification, onMarkAsRead, onRemove }) {
    return (
        <div
            className={`notification ${notification.read ? 'read' : 'unread'}`}
            onClick={() => !notification.read && onMarkAsRead(notification.id)}
        >
            <NotificationIcon type={notification.type} />
            <NotificationContent
                title={notification.title}
                text={notification.text}
                time={notification.time}
            />
            <CloseButton onClose={() => onRemove(notification.id)} />
        </div>
    );
}

function NotificationsList({ notifications, onMarkAsRead, onRemove }) {
    return (
        <div className="notifications-list">
            {notifications.map((notification) => (
                <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={onMarkAsRead}
                    onRemove={onRemove}
                />
            ))}
        </div>
    );
}

function App() {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'info',
            title: 'Новое сообщение',
            text: 'У вас новое сообщение от Марии',
            time: '5 мин назад',
            read: false,
        },
        {
            id: 2,
            type: 'warning',
            title: 'Задача просрочена',
            text: 'Задача "Подготовить отчет" просрочена',
            time: '1 час назад',
            read: true,
        },
    ]);

    const markAllAsRead = () => {
        setNotifications(
            notifications.map((notification) => ({
                ...notification,
                read: true,
            }))
        );
    };

    const markAsRead = (id) => {
        setNotifications(
            notifications.map((notification) =>
                notification.id === id ? { ...notification, read: true } : notification
            )
        );
    };

    const removeNotification = (id) => {
        setNotifications(notifications.filter((notification) => notification.id !== id));
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <div className="notifications">
            <NotificationsHeader
                unreadCount={unreadCount}
                onMarkAllAsRead={markAllAsRead}
            />
            <NotificationsList
                notifications={notifications}
                onMarkAsRead={markAsRead}
                onRemove={removeNotification}
            />
        </div>
    );
}

export default App;
