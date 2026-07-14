import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Calendar, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import PostCard from '../components/PostCard';
import Pagination from '../components/Pagination';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { Camera } from 'lucide-react';

const UserProfile = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    fetchUserPosts(1);
    setPage(1);
  }, [id]);

  const fetchUserPosts = async (p) => {
    setLoading(true);
    try {
      const response = await api.get(`/posts/user/${id}?page=${p}&limit=12`);
      const fetchedPosts = response.data.posts || [];
      setPosts(fetchedPosts);
      setTotalPages(response.data.totalPages || 1);
      setTotalPosts(response.data.totalPosts || 0);
      // Infer user info from the first post's populated user field
      if (fetchedPosts.length > 0 && fetchedPosts[0].user) {
        setUserInfo(fetchedPosts[0].user);
      }
    } catch {
      toast.error('Failed to load user posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLikeUpdate = (postId, newLikes) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === postId ? { ...p, likes: newLikes } : p))
    );
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchUserPosts(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-5">
        <ArrowLeft className="h-4 w-4" />
        Feed
      </Link>

      {loading && !userInfo ? (
        <Skeleton variant="profile" />
      ) : (
        <div className="animate-fade-in">
          {/* User Header */}
          {userInfo && (
            <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 mb-7">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-surface-raised border border-border flex items-center justify-center text-xl font-bold text-amber shrink-0">
                  {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-text-primary">{userInfo.name}</h1>
                    {userInfo.role === 'admin' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-muted text-amber text-xs font-semibold">
                        <Shield className="h-3 w-3" />
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary">
                    {totalPosts} post{totalPosts !== 1 ? 's' : ''} shared
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Posts */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <Skeleton variant="post" count={6} />
            </div>
          ) : posts.length === 0 ? (
            <EmptyState
              icon={Camera}
              title="No posts yet"
              description="This user hasn't shared any posts."
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} onLikeUpdate={handleLikeUpdate} />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
