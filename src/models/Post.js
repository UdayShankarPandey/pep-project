import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Comment user is required']
    },
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Post author (user) is required']
    },
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true
    },
    content: {
      type: String,
      trim: true
    },
    imageUrl: {
      type: String,
      required: [true, 'Post image URL is required']
    },
    imageThumbnailUrl: {
      type: String
    },
    imageFileId: {
      type: String
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    comments: [commentSchema]
  },
  {
    timestamps: true
  }
);

// Indexes for query performance
postSchema.index({ user: 1 });
postSchema.index({ createdAt: -1 });

const Post = mongoose.model('Post', postSchema);

export default Post;
