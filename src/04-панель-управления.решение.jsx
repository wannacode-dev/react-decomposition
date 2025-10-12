import './style.css';
const { useState, useEffect } = React;

function Header({ onLogout }) {
    return (
        <header>
            <h1>Панель управления</h1>
            <div className="user-menu">
                <span>Администратор</span>
                <button onClick={onLogout} className="logout-btn">
                    Выйти
                </button>
            </div>
        </header>
    );
}

function StatCard({ title, value, change }) {
    return (
        <div className="stat-card">
            <h3>{title}</h3>
            <p className="stat-value">{value}</p>
            <span className="stat-change">{change}</span>
        </div>
    );
}

function Stats({ stats }) {
    return (
        <div className="stats">
            <StatCard 
                title="Пользователи" 
                value={stats.users.toLocaleString()} 
                change="+12 за неделю"
            />
            <StatCard 
                title="Заказы" 
                value={stats.orders.toLocaleString()} 
                change="+8 за неделю"
            />
            <StatCard 
                title="Выручка" 
                value={`${stats.revenue.toLocaleString()} ₽`} 
                change="+15% за месяц"
            />
        </div>
    );
}

function RecentOrdersTable({ orders, sortBy, sortOrder, onSort, getStatusColor, getStatusText }) {
    return (
        <div className="table-section">
            <h2>Последние заказы</h2>
            <table className="recent-orders">
                <thead>
                    <tr>
                        <th 
                            className="sortable"
                            onClick={() => onSort('id')}
                        >
                            ID заказа {sortBy === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th 
                            className="sortable"
                            onClick={() => onSort('date')}
                        >
                            Дата {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th 
                            className="sortable"
                            onClick={() => onSort('amount')}
                        >
                            Сумма {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th>Статус</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
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
    );
}

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
            <Header onLogout={handleLogout} />
            <Stats stats={stats} />
            <RecentOrdersTable 
                orders={sortedOrders}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
            />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


