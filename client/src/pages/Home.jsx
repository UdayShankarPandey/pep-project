import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Heart, MessageSquare, Send, Trash2, ShieldAlert, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const [activeCommentSection, setActiveCommentSection] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts');
      // API returns paginated model { posts, totalPosts ... } or array directly
      setPosts(response.data.posts || response.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    if (!user) {
      toast.error('Please log in to like posts');
      return;
    }

    try {
      const response = await api.post(`/posts/${postId}/like`);
      // Update local state for likes
      setPosts(posts.map((post) => {
        if (post._id === postId) {
          return { ...post, likes: response.data.likes };
        }
        return post;
      }));
      toast.success(response.data.message);
    } catch (error) {
      console.error('Like error:', error);
      toast.error('Failed to toggle like');
    }
  };

  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to add comments');
      return;
    }

    const text = commentInputs[postId]?.trim();
    if (!text) return;

    try {
      const response = await api.post(`/posts/${postId}/comments`, { text });
      // Update local post comment state
      setPosts(posts.map((post) => {
        if (post._id === postId) {
          return response.data.post;
        }
        return post;
      }));
      setCommentInputs({ ...commentInputs, [postId]: '' });
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Add comment error:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      const response = await api.delete(`/posts/${postId}/comments/${commentId}`);
      // Update post comment state
      setPosts(posts.map((post) => {
        if (post._id === postId) {
          return { ...post, comments: response.data.comments };
        }
        return post;
      }));
      toast.success('Comment deleted');
    } catch (error) {
      console.error('Delete comment error:', error);
      toast.error('Failed to delete comment');
    }
  };

  const toggleCommentSection = (postId) => {
    setActiveCommentSection({
      ...activeCommentSection,
      [postId]: !activeCommentSection[postId]
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Hero Welcome banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-8 text-center sm:text-left">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center sm:justify-start space-x-2">
              <Sparkles className="h-6 w-6 text-indigo-400" />
              <span>Explore PEP Space</span>
            </h1>
            <p className="text-slate-400 max-w-md">
              A modern playground to publish ideas, share visuals, and interact with colleagues in real-time.
            </p>
          </div>
          {!user && (
            <Link
              to="/login"
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl transition duration-200 shadow-md shadow-indigo-500/20 whitespace-nowrap"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
          <p className="text-slate-400 font-medium">No posts available yet</p>
          <p className="text-slate-500 text-sm mt-1">Be the first to share an update!</p>
          <Link
            to="/create-post"
            className="inline-flex items-center space-x-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-4 py-2 rounded-xl mt-4 transition"
          >
            Create First Post
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => {
            const author = post.user || {};
            const isLiked = user && post.likes?.includes(user.id || user._id);

            return (
              <div key={post._id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-slate-800/80 transition duration-200">
                {/* Author Info */}
                <div className="p-5 flex items-center justify-between border-b border-slate-850">
                  <div className="flex items-center space-x-3.5">
                    {/* Avatar */}
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                      {author.name ? author.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">{author.name || 'Unknown Author'}</h3>
                      <div className="flex items-center space-x-1.5 mt-0.5">
                        {author.role === 'admin' && (
                          <span className="inline-flex items-center space-x-0.5 bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
                            <ShieldAlert className="h-2.5 w-2.5" />
                            <span>Admin</span>
                          </span>
                        )}
                        <span className="text-xs text-slate-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  <h2 className="text-xl font-bold text-white leading-snug">{post.title}</h2>
                  {post.content && (
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
                  )}
                </div>

                {/* Image */}
                <div className="bg-slate-950/40 relative aspect-video flex items-center justify-center overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover max-h-[400px]"
                  />
                </div>

                {/* Engagement Bar */}
                <div className="px-5 py-4 border-t border-slate-850 bg-slate-900/40 flex items-center space-x-6">
                  {/* Like Button */}
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center space-x-2 text-sm font-medium transition duration-200 cursor-pointer ${
                      isLiked ? 'text-rose-500' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-rose-500' : ''}`} />
                    <span>{post.likes?.length || 0}</span>
                  </button>

                  {/* Comment Section Toggle */}
                  <button
                    onClick={() => toggleCommentSection(post._id)}
                    className={`flex items-center space-x-2 text-sm font-medium transition duration-200 cursor-pointer ${
                      activeCommentSection[post._id] ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>{post.comments?.length || 0}</span>
                  </button>
                </div>

                {/* Accordion Comment Drawer */}
                {activeCommentSection[post._id] && (
                  <div className="border-t border-slate-850 bg-slate-950/60 p-5 space-y-4">
                    {/* Add Comment */}
                    {user ? (
                      <form
                        onSubmit={(e) => handleAddComment(e, post._id)}
                        className="flex items-center space-x-3"
                      >
                        <input
                          type="text"
                          value={commentInputs[post._id] || ''}
                          onChange={(e) =>
                            setCommentInputs({ ...commentInputs, [post._id]: e.target.value })
                          }
                          className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition"
                          placeholder="Write a comment..."
                          required
                        />
                        <button
                          type="submit"
                          className="bg-indigo-500 hover:bg-indigo-600 text-white p-2.5 rounded-xl transition cursor-pointer"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </form>
                    ) : (
                      <p className="text-xs text-slate-500 text-center">
                        Please{' '}
                        <Link to="/login" className="text-indigo-400 hover:underline">
                          login
                        </Link>{' '}
                        to participate in the discussion.
                      </p>
                    )}

                    {/* Comments List */}
                    <div className="space-y-3.5 max-h-[250px] overflow-y-auto pr-1">
                      {post.comments?.length === 0 ? (
                        <p className="text-xs text-slate-600 text-center py-2">No comments yet. Start the conversation!</p>
                      ) : (
                        post.comments.map((comment) => {
                          const commentAuthor = comment.user || {};
                          const canDelete =
                            user &&
                            (commentAuthor._id === user.id ||
                              commentAuthor._id === user._id ||
                              post.user?._id === user.id ||
                              post.user?._id === user._id ||
                              user.role === 'admin');

                          return (
                            <div key={comment._id} className="bg-slate-900/50 border border-slate-850 p-3.5 rounded-2xl flex items-start space-x-3">
                              <div className="h-7 w-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                                {commentAuthor.name ? commentAuthor.name.charAt(0).toUpperCase() : 'U'}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-white truncate">
                                    {commentAuthor.name || 'Anonymous'}
                                  </span>
                                  <span className="text-[10px] text-slate-650">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-slate-300 text-sm mt-1 leading-relaxed break-words">{comment.text}</p>
                              </div>

                              {canDelete && (
                                <button
                                  onClick={() => handleDeleteComment(post._id, comment._id)}
                                  className="text-red-400/80 hover:text-red-400 p-1 rounded-md hover:bg-red-500/5 transition cursor-pointer"
                                  title="Delete Comment"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
