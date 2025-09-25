import './style.css';
const { useState } = React;

function App() {
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'info', title: 'Новое сообщение', text: 'У вас новое сообщение от Марии', time: '5 мин назад', read: false },
        { id: 2, type: 'warning', title: 'Задача просрочена', text: 'Задача "Подготовить отчет" просрочена', time: '1 час назад', read: true }
    ]);

    const markAllAsRead = () => {
        setNotifications(notifications.map(notification => ({
            ...notification,
            read: true
        })));
    };

    const markAsRead = (id) => {
        setNotifications(notifications.map(notification => 
            notification.id === id 
                ? { ...notification, read: true }
                : notification
        ));
    };

    const removeNotification = (id) => {
        setNotifications(notifications.filter(notification => notification.id !== id));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="notifications">
            <div className="notifications-header">
                <h3>Уведомления {unreadCount > 0 && `(${unreadCount})`}</h3>
                <button onClick={markAllAsRead} disabled={unreadCount === 0}>
                    Пометить все как прочитанные
                </button>
            </div>
            
            <div className="notifications-list">
                {notifications.map(notification => (
                    <div 
                        key={notification.id} 
                        className={`notification ${notification.read ? 'read' : 'unread'}`}
                        onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                        <div className="notification-icon">
                            {notification.type === 'info' && 'ℹ️'}
                            {notification.type === 'warning' && '⚠️'}
                        </div>
                        <div className="notification-content">
                            <h4>{notification.title}</h4>
                            <p>{notification.text}</p>
                            <span className="time">{notification.time}</span>
                        </div>
                        <button 
                            className="close-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                            }}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


