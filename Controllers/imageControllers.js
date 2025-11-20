import imagekit from "../Configs/imagekitConfigs.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Upload to ImageKit
    const result = await imagekit.upload({
      file: req.file.buffer.toString('base64'), // Convert buffer to base64
      fileName: req.file.originalname,
      folder: "/DSEBlogs", // Optional: organize in folders
    });

    res.status(200).json({ 
      imageUrl: result.url,
      url: result.url,
      thumbnailUrl: result.thumbnailUrl,
      fileId: result.fileId 
    });
  } catch (error) {
    console.error('ImageKit upload error:', error);
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
};

export default { uploadImage };