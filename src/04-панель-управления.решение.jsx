import React, { useState, useEffect } from 'react';

import './style.css';

function Header({ onLogout }) {
    return (
        <header>
            <h1>Панель управления</h1>
            <div className="user-menu">
                <span>Администратор</span>
                <button
                    onClick={onLogout}
                    className="logout-btn"
                >
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

function StatusBadge({ status }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return '#10b981';
            case 'pending':
                return '#f59e0b';
            case 'cancelled':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed':
                return 'Завершен';
            case 'pending':
                return 'В обработке';
            case 'cancelled':
                return 'Отменен';
            default:
                return status;
        }
    };

    return (
        <span
            className="status-badge"
            style={{ backgroundColor: getStatusColor(status) }}
        >
            {getStatusText(status)}
        </span>
    );
}

function SortableHeader({ field, currentSortBy, sortOrder, onSort, children }) {
    const isActive = currentSortBy === field;
    const arrow = isActive ? (sortOrder === 'asc' ? '↑' : '↓') : '';

    return (
        <th
            className="sortable"
            onClick={() => onSort(field)}
        >
            {children} {arrow}
        </th>
    );
}

function OrderRow({ order }) {
    return (
        <tr>
            <td>{order.id}</td>
            <td>{order.date}</td>
            <td>{order.amount.toLocaleString()} ₽</td>
            <td>
                <StatusBadge status={order.status} />
            </td>
        </tr>
    );
}

function RecentOrdersTable({ orders, sortBy, sortOrder, onSort }) {
    return (
        <div className="table-section">
            <h2>Последние заказы</h2>
            <table className="recent-orders">
                <thead>
                    <tr>
                        <SortableHeader
                            field="id"
                            currentSortBy={sortBy}
                            sortOrder={sortOrder}
                            onSort={onSort}
                        >
                            ID заказа
                        </SortableHeader>
                        <SortableHeader
                            field="date"
                            currentSortBy={sortBy}
                            sortOrder={sortOrder}
                            onSort={onSort}
                        >
                            Дата
                        </SortableHeader>
                        <SortableHeader
                            field="amount"
                            currentSortBy={sortBy}
                            sortOrder={sortOrder}
                            onSort={onSort}
                        >
                            Сумма
                        </SortableHeader>
                        <th>Статус</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <OrderRow
                            key={order.id}
                            order={order}
                        />
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
        revenue: 125000,
    });
    const [orders, setOrders] = useState([
        { id: '#12345', date: '2024-01-15', amount: 5000, status: 'completed' },
        { id: '#12346', date: '2024-01-14', amount: 3200, status: 'pending' },
        { id: '#12347', date: '2024-01-13', amount: 7800, status: 'completed' },
        { id: '#12348', date: '2024-01-12', amount: 2100, status: 'cancelled' },
        { id: '#12349', date: '2024-01-11', amount: 9500, status: 'completed' },
    ]);
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        const interval = setInterval(() => {
            setStats((prevStats) => ({
                users: prevStats.users + Math.floor(Math.random() * 3),
                orders: prevStats.orders + Math.floor(Math.random() * 2),
                revenue: prevStats.revenue + Math.floor(Math.random() * 1000),
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

    const sortOrders = (orders, sortBy, sortOrder) => {
        return [...orders].sort((a, b) => {
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
    };

    const sortedOrders = sortOrders(orders, sortBy, sortOrder);

    return (
        <div className="dashboard">
            <Header onLogout={handleLogout} />
            <Stats stats={stats} />
            <RecentOrdersTable
                orders={sortedOrders}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
            />
        </div>
    );
}

export default App;
