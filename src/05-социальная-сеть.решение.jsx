import React, { useState } from 'react';
 
import './style.css';
function CreatePost({ value, onChange, onCreate, disabled }) {
    return (
        <div className="create-post">
            <textarea 
                placeholder="Что у вас нового?" 
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <button 
                onClick={onCreate}
                disabled={disabled}
            >
                Опубликовать
            </button>
        </div>
    );
}

function PostHeader({ author }) {
    return (
        <div className="post-header">
            <div className="avatar-emoji">{author.avatar}</div>
            <strong>{author.name}</strong>
            <span className="post-time">2 часа назад</span>
        </div>
    );
}

function PostActions({ likes, liked, commentsCount, onLike, onToggleComments }) {
    return (
        <div className="post-actions">
            <button 
                className={`like-btn ${liked ? 'liked' : ''}`}
                onClick={onLike}
            >
                {liked ? '❤️' : '🤍'} {likes}
            </button>
            <button 
                className="comment-btn"
                onClick={onToggleComments}
            >
                💬 Комментировать ({commentsCount})
            </button>
        </div>
    );
}

function Comments({ comments, postId, newComment, onCommentChange, onAddComment }) {
    return (
        <div className="comments-section">
            <div className="comments">
                {comments.map(comment => (
                    <div key={comment.id} className="comment">
                        <strong>{comment.user}</strong>: {comment.text}
                    </div>
                ))}
            </div>
            <div className="add-comment">
                <input 
                    type="text" 
                    placeholder="Написать комментарий..."
                    value={newComment || ''}
                    onChange={(e) => onCommentChange(postId, e.target.value)}
                />
                <button 
                    onClick={() => onAddComment(postId)}
                    disabled={!newComment?.trim()}
                >
                    Отправить
                </button>
            </div>
        </div>
    );
}

function Post({ post, onLike, onToggleComments, newComment, onCommentChange, onAddComment, onKeyPress }) {
    return (
        <div className="post">
            <PostHeader author={post.author} />
            <p>{post.content}</p>
            <PostActions 
                likes={post.likes}
                liked={post.liked}
                commentsCount={post.comments.length}
                onLike={() => onLike(post.id)}
                onToggleComments={() => onToggleComments(post.id)}
            />
            {post.showComments && (
                <Comments 
                    comments={post.comments}
                    postId={post.id}
                    newComment={newComment[post.id]}
                    onCommentChange={onCommentChange}
                    onAddComment={onAddComment}
                    onKeyPress={onKeyPress}
                />
            )}
        </div>
    );
}

function App() {
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: { name: 'Иван', avatar: '👨' },
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
            author: { name: 'Мария', avatar: '👩' },
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
                author: { name: 'Вы', avatar: '👨' },
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
            <CreatePost 
                value={newPost}
                onChange={setNewPost}
                onCreate={handleCreatePost}
                disabled={!newPost.trim()}
            />
            {posts.map(post => (
                <Post 
                    key={post.id} 
                    post={post}
                    onLike={handleLike}
                    onToggleComments={handleToggleComments}
                    newComment={newComment}
                    onCommentChange={handleCommentChange}
                    onAddComment={handleAddComment}
                />
            ))}
        </div>
    );
}


// Export for Sandpack SDK
export default App;

