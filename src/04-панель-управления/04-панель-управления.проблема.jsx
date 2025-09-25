import '../../styles.css';
const { useState, useEffect } = React;

function App() {
    const [stats, setStats] = useState({
        users: 1234,
        orders: 567,
        revenue: 125000
    });
    const [orders, setOrders] = useState([
        { id: '#12345', date: '2024-01-15', amount: 5000, status: 'completed' },
        { id: '#12346', date: '2024-01-14', amount: 3200, status: 'pending' },
        { id: '#12347', date: '2024-01-13', amount: 7800, status: 'completed' },
        { id: '#12348', date: '2024-01-12', amount: 2100, status: 'cancelled' },
        { id: '#12349', date: '2024-01-11', amount: 9500, status: 'completed' }
    ]);
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prevStats => ({
                users: prevStats.users + Math.floor(Math.random() * 3),
                orders: prevStats.orders + Math.floor(Math.random() * 2),
                revenue: prevStats.revenue + Math.floor(Math.random() * 1000)
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        if (confirm('Вы уверены, что хотите выйти?')) {
            alert('Выход выполнен');
        }
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const sortedOrders = [...orders].sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        if (sortBy === 'amount') {
            aValue = parseInt(aValue);
            bValue = parseInt(bValue);
        } else if (sortBy === 'date') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        }

        if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return '#10b981';
            case 'pending': return '#f59e0b';
            case 'cancelled': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed': return 'Завершен';
            case 'pending': return 'В обработке';
            case 'cancelled': return 'Отменен';
            default: return status;
        }
    };

    return (
        <div className="dashboard">
            <header>
                <h1>Панель управления</h1>
                <div className="user-menu">
                    <span>Администратор</span>
                    <button onClick={handleLogout} className="logout-btn">
                        Выйти
                    </button>
                </div>
            </header>
            
            <div className="stats">
                <div className="stat-card">
                    <h3>Пользователи</h3>
                    <p className="stat-value">{stats.users.toLocaleString()}</p>
                    <span className="stat-change">+12 за неделю</span>
                </div>
                <div className="stat-card">
                    <h3>Заказы</h3>
                    <p className="stat-value">{stats.orders.toLocaleString()}</p>
                    <span className="stat-change">+8 за неделю</span>
                </div>
                <div className="stat-card">
                    <h3>Выручка</h3>
                    <p className="stat-value">{stats.revenue.toLocaleString()} ₽</p>
                    <span className="stat-change">+15% за месяц</span>
                </div>
            </div>

            <div className="table-section">
                <h2>Последние заказы</h2>
                <table className="recent-orders">
                    <thead>
                        <tr>
                            <th 
                                className="sortable"
                                onClick={() => handleSort('id')}
                            >
                                ID заказа {sortBy === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                className="sortable"
                                onClick={() => handleSort('date')}
                            >
                                Дата {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                className="sortable"
                                onClick={() => handleSort('amount')}
                            >
                                Сумма {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th>Статус</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedOrders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.date}</td>
                                <td>{order.amount.toLocaleString()} ₽</td>
                                <td>
                                    <span 
                                        className="status-badge"
                                        style={{ backgroundColor: getStatusColor(order.status) }}
                                    >
                                        {getStatusText(order.status)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


