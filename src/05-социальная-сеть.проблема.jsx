import './style.css';
const { useState } = React;

function App() {
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: { name: 'Иван', avatar: 'avatar.jpeg' },
            content: 'Сегодня прекрасный день!',
            likes: 15,
            liked: false,
            comments: [
                { id: 1, user: 'Алексей', text: 'Полностью согласен!' }
            ],
            showComments: false
        },
        {
            id: 2,
            author: { name: 'Мария', avatar: 'avatar2.jpeg' },
            content: 'Только что вернулась с прогулки в парке. Природа прекрасна!',
            likes: 8,
            liked: false,
            comments: [],
            showComments: false
        }
    ]);
    const [newPost, setNewPost] = useState('');
    const [newComment, setNewComment] = useState({});

    const handleCreatePost = () => {
        if (newPost.trim()) {
            const post = {
                id: posts.length + 1,
                author: { name: 'Вы', avatar: 'avatar.jpeg' },
                content: newPost.trim(),
                likes: 0,
                liked: false,
                comments: [],
                showComments: false
            };
            setPosts([post, ...posts]);
            setNewPost('');
        }
    };

    const handleLike = (postId) => {
        setPosts(posts.map(post => 
            post.id === postId 
                ? { 
                    ...post, 
                    likes: post.liked ? post.likes - 1 : post.likes + 1,
                    liked: !post.liked
                  }
                : post
        ));
    };

    const handleToggleComments = (postId) => {
        setPosts(posts.map(post => 
            post.id === postId 
                ? { ...post, showComments: !post.showComments }
                : post
        ));
    };

    const handleAddComment = (postId) => {
        const commentText = newComment[postId];
        if (commentText && commentText.trim()) {
            const comment = {
                id: Date.now(),
                user: 'Вы',
                text: commentText.trim()
            };
            
            setPosts(posts.map(post => 
                post.id === postId 
                    ? { 
                        ...post, 
                        comments: [...post.comments, comment],
                        showComments: true
                      }
                    : post
            ));
            
            setNewComment({ ...newComment, [postId]: '' });
        }
    };

    const handleCommentChange = (postId, value) => {
        setNewComment({ ...newComment, [postId]: value });
    };

    return (
        <div className="social-feed">
            <div className="create-post">
                <textarea 
                    placeholder="Что у вас нового?" 
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                />
                <button 
                    onClick={handleCreatePost}
                    disabled={!newPost.trim()}
                >
                    Опубликовать
                </button>
            </div>
            
            {posts.map(post => (
                <div key={post.id} className="post">
                    <div className="post-header">
                        <img src={post.author.avatar} alt="Avatar" />
                        <strong>{post.author.name}</strong>
                        <span className="post-time">2 часа назад</span>
                    </div>
                    <p>{post.content}</p>
                    <div className="post-actions">
                        <button 
                            className={`like-btn ${post.liked ? 'liked' : ''}`}
                            onClick={() => handleLike(post.id)}
                        >
                            {post.liked ? '❤️' : '🤍'} {post.likes}
                        </button>
                        <button 
                            className="comment-btn"
                            onClick={() => handleToggleComments(post.id)}
                        >
                            💬 Комментировать ({post.comments.length})
                        </button>
                    </div>
                    
                    {post.showComments && (
                        <div className="comments-section">
                            <div className="comments">
                                {post.comments.map(comment => (
                                    <div key={comment.id} className="comment">
                                        <strong>{comment.user}</strong>: {comment.text}
                                    </div>
                                ))}
                            </div>
                            <div className="add-comment">
                                <input 
                                    type="text" 
                                    placeholder="Написать комментарий..."
                                    value={newComment[post.id] || ''}
                                    onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                />
                                <button 
                                    onClick={() => handleAddComment(post.id)}
                                    disabled={!newComment[post.id]?.trim()}
                                >
                                    Отправить
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


