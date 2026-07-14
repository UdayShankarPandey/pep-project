import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Mail, Calendar, Grid, Heart, MessageSquare, Trash2, Edit3, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { Camera } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchUserPosts = async () => {
      try {
        const response = await api.get(`/posts/user/${user.id || user._id}`);
        setPosts(response.data.posts || response.data);
      } catch {
        toast.error('Failed to load your posts');
      } finally {
        setLoading(false);
      }
    };
    fetchUserPosts();
  }, [user]);

  const handleDeletePost = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/posts/${deleteTarget}`);
      setPosts(posts.filter((p) => p._id !== deleteTarget));
      toast.success('Post deleted');
    } catch {
      toast.error('Failed to delete post');
    } finally {
      setDeleteTarget(null);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {/* Profile Header */}
      <div className="bg-surface border border-border rounded-2xl p-5 sm:p-7 mb-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-xl bg-surface-raised border border-border flex items-center justify-center text-3xl font-extrabold text-amber shrink-0">
            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-bold text-text-primary tracking-tight">{user.name}</h1>
              {user.role === 'admin' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-muted text-amber text-xs font-semibold">
                  <Shield className="h-3 w-3" />
                  Admin
                </span>
              )}
            </div>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-text-secondary">
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-text-tertiary" />
                {user.email}
              </span>
              {user.createdAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-text-tertiary" />
                  Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-text-primary">
            <Grid className="h-4 w-4 text-amber" />
            My Posts
            {!loading && <span className="text-sm font-normal text-text-tertiary">({posts.length})</span>}
          </h2>
          <Link
            to="/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber text-text-inverse text-sm font-semibold hover:bg-amber-hover transition-colors"
          >
            <Camera className="h-3.5 w-3.5" />
            New
          </Link>
        </div>

        {loading ? (
          <Skeleton variant="profile" />
        ) : posts.length === 0 ? (
          <EmptyState
            icon={Camera}
            title="No posts yet"
            description="Your published posts will appear here."
            actionLabel="Create your first post"
            actionTo="/create"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children">
            {posts.map((post) => (
              <div key={post._id} className="bg-surface border border-border rounded-2xl overflow-hidden group hover:border-surface-overlay transition-colors">
                {/* Image */}
                <Link to={`/post/${post._id}`} className="block relative aspect-video bg-canvas overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  {/* Actions overlay */}
                  <div className="absolute top-2.5 right-2.5 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      to={`/post/${post._id}/edit`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 bg-canvas/80 backdrop-blur-sm rounded-lg text-text-secondary hover:text-amber border border-border transition-colors"
                      title="Edit post"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDeleteTarget(post._id);
                      }}
                      className="p-2 bg-canvas/80 backdrop-blur-sm rounded-lg text-text-secondary hover:text-danger border border-border transition-colors cursor-pointer"
                      title="Delete post"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </Link>

                {/* Content */}
                <div className="p-4">
                  <Link to={`/post/${post._id}`}>
                    <h3 className="text-sm font-bold text-text-primary mb-1 line-clamp-1 hover:text-amber transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  {post.content && (
                    <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed mb-3">{post.content}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-text-tertiary">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5 text-coral" />
                      {post.likes?.length || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5 text-amber" />
                      {post.comments?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete post"
        message="This post and all its comments will be permanently removed. This cannot be undone."
        confirmLabel="Delete Post"
        onConfirm={handleDeletePost}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default Profile;
