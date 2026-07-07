import imagekit from '../config/imagekit.js';

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // Upload base64 string to ImageKit to ensure robust API transport
    const result = await imagekit.files.upload({
      file: req.file.buffer.toString('base64'),
      fileName: `image-${Date.now()}-${req.file.originalname}`,
      folder: '/uploads'
    });

    res.status(200).json({
      message: 'Image uploaded successfully to ImageKit.',
      url: result.url,
      thumbnailUrl: result.thumbnailUrl,
      fileId: result.fileId,
      name: result.name,
      size: result.size
    });
  } catch (error) {
    console.error('ImageKit Upload Error:', error);
    res.status(500).json({
      message: 'Failed to upload image.',
      error: error.message
    });
  }
};
