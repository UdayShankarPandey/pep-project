import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Mail, Calendar, Grid, MessageSquare, Trash2, Heart, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user) return;
      try {
        const response = await api.get(`/posts/user/${user.id || user._id}`);
        // Support paginated model
        setPosts(response.data.posts || response.data);
      } catch (error) {
        console.error('Failed to load user posts:', error);
        toast.error('Failed to load your posts');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [user]);

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`/posts/${postId}`);
      setPosts(posts.filter((post) => post._id !== postId));
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast.error('Failed to delete post');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-8">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 relative">
          {/* Avatar Placeholder */}
          <div className="h-24 w-24 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-indigo-500/20">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">{user.name}</h1>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-slate-400">
              <span className="flex items-center space-x-1">
                <Mail className="h-4 w-4 text-indigo-400" />
                <span>{user.email}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="h-4 w-4 text-indigo-400" />
                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </span>
            </div>

            {user.role === 'admin' && (
              <span className="inline-flex items-center space-x-1 bg-red-500/10 text-red-400 border border-red-500/20 text-xs px-2.5 py-1 rounded-full font-semibold mt-2">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Administrator</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* User Posts Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Grid className="h-5 w-5 text-indigo-400" />
          <span>My Posts ({posts.length})</span>
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-12 text-center">
            <p className="text-slate-400 font-medium">You haven't posted anything yet</p>
            <p className="text-slate-500 text-sm mt-1">Publish your first post to see it here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <div key={post._id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-slate-700 transition duration-200 flex flex-col group">
                <div className="relative aspect-video bg-slate-950">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="p-2 bg-slate-950/80 text-red-400 hover:text-red-300 rounded-full hover:scale-105 transition border border-slate-800 cursor-pointer"
                      title="Delete Post"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{post.title}</h3>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">{post.content}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-500 font-medium">
                    <span className="flex items-center space-x-1">
                      <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                      <span>{post.likes?.length || 0} Likes</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4 text-indigo-400" />
                      <span>{post.comments?.length || 0} Comments</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
