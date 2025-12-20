import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
function App() {
    return (
        <div className="activity-history">
            <h1>История действий ореха</h1>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

export default App;

