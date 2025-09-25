import "../../styles.css";
const { useState } = React;

function ContactsHeader({ search, setSearch, count }) {
  return (
    <div className="contacts-header">
      <h3>Контакты ({count})</h3>
      <input
        type="text"
        placeholder="Поиск контактов..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

function ContactItem({ contact, onMessage, getAvatarSrc }) {
  return (
    <div className="contact">
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
      <button className="message-btn" onClick={() => onMessage(contact.id)}>
        Написать
      </button>
    </div>
  );
}

function ContactsList({ contacts, onMessage, getAvatarSrc }) {
  return (
    <div className="contacts-list">
      {contacts.length > 0 ? (
        contacts.map((contact) => (
          <ContactItem
            key={contact.id}
            contact={contact}
            onMessage={onMessage}
            getAvatarSrc={getAvatarSrc}
          />
        ))
      ) : (
        <div className="no-contacts">
          <p>Контакты не найдены</p>
        </div>
      )}
    </div>
  );
}

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
      <ContactsHeader
        search={search}
        setSearch={setSearch}
        count={filteredContacts.length}
      />
      <ContactsList
        contacts={filteredContacts}
        onMessage={handleMessage}
        getAvatarSrc={getAvatarSrc}
      />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
