import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Image as ImageIcon, Send, X, FileText, Type } from 'lucide-react';
import toast from 'react-hot-toast';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      toast.error('Title is required');
      return;
    }
    if (!imageFile) {
      toast.error('An image is required for the post');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', imageFile);

    try {
      await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Post created successfully!');
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create post';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="mb-8 relative">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Create a Post</h2>
          <p className="text-slate-400 mt-2">Share something interesting with the PEP Space community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center space-x-1.5">
              <Type className="h-4 w-4 text-indigo-400" />
              <span>Post Title</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition duration-200"
              placeholder="Give your post a catchy title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center space-x-1.5">
              <FileText className="h-4 w-4 text-indigo-400" />
              <span>Description / Content</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition duration-200 resize-none"
              placeholder="What is this post about?"
            />
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center space-x-1.5">
              <ImageIcon className="h-4 w-4 text-indigo-400" />
              <span>Cover Image</span>
            </label>

            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-850 bg-slate-950 group">
                <img
                  src={imagePreview}
                  alt="Upload Preview"
                  className="w-full max-h-[300px] object-contain mx-auto"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 p-2 bg-slate-900/90 text-slate-400 hover:text-white rounded-full hover:scale-105 transition border border-slate-800 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-950/30 hover:bg-slate-950/50 rounded-2xl p-8 text-center cursor-pointer transition duration-200 group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="p-4 bg-slate-900 text-slate-400 group-hover:text-indigo-400 rounded-2xl border border-slate-800 transition duration-200">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-slate-300 font-medium">Click to upload an image</p>
                    <p className="text-slate-500 text-xs mt-1">Supports PNG, JPG, JPEG (Max 5MB)</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <span>Publish Post</span>
                <Send className="h-5 w-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
