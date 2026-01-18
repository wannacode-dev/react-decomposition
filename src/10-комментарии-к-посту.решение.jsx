import React, { useState } from 'react';

import './style.css';
function CommentsHeader({ count }) {
    return (
        <div className="comments-header">
            <h4>Комментарии ({count})</h4>
        </div>
    );
}

function CommentItem({ comment, onLike, onReply }) {
    return (
        <div className="comment">
            <div className="comment-author">
                <strong>{comment.user}</strong>
                <span className="time">{comment.time}</span>
            </div>
            <p className="comment-text">{comment.text}</p>
            <div className="comment-actions">
                <button
                    className={comment.liked ? 'liked' : ''}
                    onClick={() => onLike(comment.id)}
                >
                    {comment.liked ? '❤️' : '🤍'} {comment.likes}
                </button>
                <button onClick={() => onReply(comment.id)}>Ответить</button>
            </div>
        </div>
    );
}

function CommentsList({ comments, onLike, onReply }) {
    return (
        <div className="comments-list">
            {comments.map((comment) => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    onLike={onLike}
                    onReply={onReply}
                />
            ))}
        </div>
    );
}

function AddComment({ value, onChange, onAdd, onKeyDown }) {
    return (
        <div className="add-comment">
            <textarea
                placeholder="Оставьте ваш комментарий... (Ctrl+Enter для отправки)"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={onKeyDown}
            />
            <button
                onClick={onAdd}
                disabled={!value.trim()}
            >
                Отправить
            </button>
        </div>
    );
}

function App() {
    const [comments, setComments] = useState([
        {
            id: 1,
            user: 'Алексей',
            text: 'Отличная статья!',
            time: '2 часа назад',
            likes: 5,
            liked: false,
        },
        {
            id: 2,
            user: 'Мария',
            text: 'Спасибо за полезную информацию',
            time: '1 час назад',
            likes: 3,
            liked: false,
        },
    ]);
    const [newComment, setNewComment] = useState('');

    const handleAddComment = () => {
        if (newComment.trim()) {
            const comment = {
                id: comments.length + 1,
                user: 'Вы',
                text: newComment.trim(),
                time: 'только что',
                likes: 0,
                liked: false,
            };

            setComments([...comments, comment]);
            setNewComment('');
        }
    };

    const handleLike = (id) => {
        setComments(
            comments.map((comment) =>
                comment.id === id
                    ? {
                          ...comment,
                          likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
                          liked: !comment.liked,
                      }
                    : comment
            )
        );
    };

    const handleReply = (id) => {
        const comment = comments.find((c) => c.id === id);
        if (comment) {
            setNewComment(`@${comment.user} `);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            handleAddComment();
        }
    };

    return (
        <div className="post-comments">
            <CommentsHeader count={comments.length} />
            <CommentsList
                comments={comments}
                onLike={handleLike}
                onReply={handleReply}
            />
            <AddComment
                value={newComment}
                onChange={setNewComment}
                onAdd={handleAddComment}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
}

export default App;
