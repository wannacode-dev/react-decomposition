import React, { useState } from 'react';
 
import './style.css';
function App() {
    const [comments, setComments] = useState([
        { id: 1, user: 'Алексей', text: 'Отличная статья!', time: '2 часа назад', likes: 5, liked: false },
        { id: 2, user: 'Мария', text: 'Спасибо за полезную информацию', time: '1 час назад', likes: 3, liked: false }
    ]);
    const [newComment, setNewComment] = useState('');

    const handleAddComment = () => {
        if (newComment.trim()) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
            
            const comment = {
                id: comments.length + 1,
                user: 'Вы',
                text: newComment.trim(),
                time: 'только что',
                likes: 0,
                liked: false
            };
            
            setComments([...comments, comment]);
            setNewComment('');
        }
    };

    const handleLike = (id) => {
        setComments(comments.map(comment => 
            comment.id === id 
                ? { 
                    ...comment, 
                    likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
                    liked: !comment.liked
                  }
                : comment
        ));
    };

    const handleReply = (id) => {
        const comment = comments.find(c => c.id === id);
        if (comment) {
            setNewComment(`@${comment.user} `);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            handleAddComment();
        }
    };

    return (
        <div className="post-comments">
            <div className="comments-header">
                <h4>Комментарии ({comments.length})</h4>
            </div>
            
            <div className="comments-list">
                {comments.map(comment => (
                    <div key={comment.id} className="comment">
                        <div className="comment-author">
                            <strong>{comment.user}</strong>
                            <span className="time">{comment.time}</span>
                        </div>
                        <p className="comment-text">{comment.text}</p>
                        <div className="comment-actions">
                            <button 
                                className={comment.liked ? 'liked' : ''}
                                onClick={() => handleLike(comment.id)}
                            >
                                {comment.liked ? '❤️' : '🤍'} {comment.likes}
                            </button>
                            <button onClick={() => handleReply(comment.id)}>
                                Ответить
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="add-comment">
                <textarea 
                    placeholder="Оставьте ваш комментарий... (Ctrl+Enter для отправки)"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
                <button onClick={handleAddComment} disabled={!newComment.trim()}>
                    Отправить
                </button>
            </div>
        </div>
    );
}


// Export for Sandpack SDK
export default App;

