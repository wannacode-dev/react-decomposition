import './style.css';
const { useState } = React;

function ChatHeader() {
    return (
        <div className="chat-header">
            <h3>Чат с Анной</h3>
            <span className="status">online</span>
        </div>
    );
}

function Message({ message }) {
    return (
        <div className={`message ${message.isOwn ? 'own-message' : 'other-message'}`}>
            {!message.isOwn && <span className="sender">{message.user}</span>}
            <div className="message-bubble">
                <p>{message.text}</p>
                <span className="time">{message.time}</span>
            </div>
        </div>
    );
}

function Messages({ messages }) {
    return (
        <div className="messages">
            {messages.map(message => (
                <Message key={message.id} message={message} />
            ))}
        </div>
    );
}

function MessageInput({ value, onChange, onSend }) {
    return (
        <div className="message-input">
            <input 
                type="text" 
                placeholder="Введите сообщение..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <button onClick={onSend}>Отправить</button>
        </div>
    );
}

function App() {
    const [messages, setMessages] = useState([
        { id: 1, user: 'Анна', text: 'Привет! Как дела?', time: '10:30', isOwn: false },
        { id: 2, user: 'Вы', text: 'Отлично!', time: '10:31', isOwn: true }
    ]);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
            
            const message = {
                id: messages.length + 1,
                user: 'Вы',
                text: newMessage.trim(),
                time: timeString,
                isOwn: true
            };
            
            setMessages([...messages, message]);
            setNewMessage('');
        }
    };

    return (
        <div className="chat">
            <ChatHeader />
            <Messages messages={messages} />
            <MessageInput 
                value={newMessage} 
                onChange={setNewMessage} 
                onSend={handleSendMessage}
            />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


