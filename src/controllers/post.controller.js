import imagekit from '../config/imagekit.js';
import Post from '../models/Post.js';

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required.' });
    }

    let imageUrl = req.body.imageUrl;
    let imageThumbnailUrl = req.body.imageThumbnailUrl;
    let imageFileId = req.body.imageFileId;

    // Handle direct image file upload via multer
    if (req.file) {
      const result = await imagekit.files.upload({
        file: req.file.buffer.toString('base64'),
        fileName: `post-${Date.now()}-${req.file.originalname}`,
        folder: '/posts'
      });
      imageUrl = result.url;
      imageThumbnailUrl = result.thumbnailUrl;
      imageFileId = result.fileId;
    }

    if (!imageUrl) {
      return res.status(400).json({ message: 'Post image is required. Please upload an image file or provide a valid imageUrl.' });
    }

    const post = await Post.create({
      user: req.user._id,
      title,
      content,
      imageUrl,
      imageThumbnailUrl,
      imageFileId
    });

    res.status(201).json({
      message: 'Post created successfully.',
      post
    });
  } catch (error) {
    console.error('Create Post Error:', error);
    res.status(500).json({ message: 'Failed to create post.', error: error.message });
  }
};

// Get all posts (newest first)
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name email role')
      .populate('comments.user', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve posts.', error: error.message });
  }
};

// Get a single post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'name email role')
      .populate('comments.user', 'name email');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve post.', error: error.message });
  }
};

// Update a post (only allowed for the author)
export const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Check ownership
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this post.' });
    }

    if (title) post.title = title;
    if (content !== undefined) post.content = content;

    const updatedPost = await post.save();
    res.status(200).json({
      message: 'Post updated successfully.',
      post: updatedPost
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update post.', error: error.message });
  }
};

// Delete a post (only allowed for the author or an admin)
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Check authorization (post owner or admin)
    if (post.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to delete this post.' });
    }

    // Delete image from ImageKit if imageFileId is stored
    if (post.imageFileId) {
      try {
        await imagekit.files.deleteFile(post.imageFileId);
      } catch (ikError) {
        console.error('Failed to delete image from ImageKit:', ikError.message);
        // We log the error but don't block post deletion in DB if it was already deleted or not found
      }
    }

    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post.', error: error.message });
  }
};

// Toggle like/unlike on a post
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const userId = req.user._id;
    const index = post.likes.indexOf(userId);

    if (index === -1) {
      // Like the post
      post.likes.push(userId);
    } else {
      // Unlike the post
      post.likes.splice(index, 1);
    }

    await post.save();
    res.status(200).json({
      message: index === -1 ? 'Post liked successfully.' : 'Post unliked successfully.',
      likesCount: post.likes.length,
      likes: post.likes
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle like on post.', error: error.message });
  }
};

// Add a comment to a post
export const commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required.' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const newComment = {
      user: req.user._id,
      text
    };

    post.comments.push(newComment);
    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('user', 'name email role')
      .populate('comments.user', 'name email');

    res.status(201).json({
      message: 'Comment added successfully.',
      post: updatedPost
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment.', error: error.message });
  }
};

// Delete a comment from a post
export const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    // Check authorization: comment author, post owner, or admin
    if (
      comment.user.toString() !== req.user._id.toString() &&
      post.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'You are not authorized to delete this comment.' });
    }

    comment.deleteOne();
    await post.save();

    res.status(200).json({
      message: 'Comment deleted successfully.',
      comments: post.comments
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete comment.', error: error.message });
  }
};
