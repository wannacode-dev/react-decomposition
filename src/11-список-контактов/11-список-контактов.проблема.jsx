import "../../styles.css";
const { useState } = React;

function App() {
  const [contacts, setContacts] = useState([
    {
        id: 1,
        name: "Анна Петрова",
        status: "online",
        lastSeen: "только что",
        gender: "female",
        avatar: "/avatar2.jpeg",
      },
      {
        id: 2,
        name: "Иван Сидоров",
        status: "offline",
        lastSeen: "2 часа назад",
        gender: "male",
        avatar: "/avatar.jpeg",
      },
      {
        id: 3,
        name: "Мария Козлова",
        status: "online",
        lastSeen: "5 минут назад",
        gender: "female",
        avatar: "/avatar3.jpeg",
      },
      {
        id: 4,
        name: "Алексей Волков",
        status: "offline",
        lastSeen: "1 день назад",
        gender: "male",
        avatar: "/avatar5.jpeg",
      },
      {
        id: 5,
        name: "Елена Смирнова",
        status: "online",
        lastSeen: "только что",
        gender: "female",
        avatar: "/avatar4.jpeg",
      },
  ]);
  const [search, setSearch] = useState("");

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleMessage = (contactId) => {
    const contact = contacts.find((c) => c.id === contactId);
    alert(`Открываем чат с ${contact.name}`);
  };

  const getAvatarSrc = (contact) => {
    return contact.avatar;
  };

  return (
    <div className="contacts">
      <div className="contacts-header">
        <h3>Контакты ({filteredContacts.length})</h3>
        <input
          type="text"
          placeholder="Поиск контактов..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="contacts-list">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <div key={contact.id} className="contact">
              <div className="contact-avatar">
                <img
                  src={getAvatarSrc(contact)}
                  alt={contact.name}
                  className="avatar-img"
                />
                <div className={`status ${contact.status}`}></div>
              </div>
              <div className="contact-info">
                <strong>{contact.name}</strong>
                <span className="status-text">
                  {contact.status === "online"
                    ? "online"
                    : `был(а) ${contact.lastSeen}`}
                </span>
              </div>
              <button
                className="message-btn"
                onClick={() => handleMessage(contact.id)}
              >
                Написать
              </button>
            </div>
          ))
        ) : (
          <div className="no-contacts">
            <p>Контакты не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
