import { Request, Response } from 'express';
import { imagekit } from '../lib/imagekit.js';

/**
 * Generates HMAC authentication parameters for direct client-side upload to ImageKit.
 * Returns: { token, expire, signature }
 */
export const getImageKitAuth = async (req: Request, res: Response) => {
  try {
    const authParameters = imagekit.getAuthenticationParameters();
    return res.status(200).json(authParameters);
  } catch (error: any) {
    console.error('Failed to generate ImageKit auth parameters:', error);
    return res.status(500).json({ 
      error: 'Failed to generate ImageKit signature', 
      details: error.message 
    });
  }
};

/**
 * Server-side fallback upload handler using multer buffer.
 * Useful for admin background imports or server-side workflows.
 */
export const uploadMedia = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const folder = (req.body.folder as string) || '/pahadi-basera/general';
    const fileName = `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;

    const uploadResponse = await imagekit.upload({
      file: file.buffer,
      fileName,
      folder,
      useUniqueFileName: true,
    });

    return res.status(201).json({
      message: 'Image uploaded successfully',
      fileId: uploadResponse.fileId,
      url: uploadResponse.url,
      thumbnailUrl: uploadResponse.thumbnailUrl,
      filePath: uploadResponse.filePath,
      name: uploadResponse.name,
      height: uploadResponse.height,
      width: uploadResponse.width,
    });
  } catch (error: any) {
    console.error('Failed to upload image to ImageKit:', error);
    return res.status(500).json({ 
      error: 'Failed to upload image', 
      details: error.message 
    });
  }
};

/**
 * Deletes a file from ImageKit storage by its fileId.
 */
export const deleteMedia = async (req: Request, res: Response) => {
  try {
    const fileId = Array.isArray(req.params.fileId) ? req.params.fileId[0] : req.params.fileId;
    if (!fileId) {
      return res.status(400).json({ error: 'fileId is required' });
    }

    await imagekit.deleteFile(fileId);
    return res.status(200).json({ message: 'Media deleted successfully', fileId });
  } catch (error: any) {
    console.error('Failed to delete media from ImageKit:', error);
    return res.status(500).json({ 
      error: 'Failed to delete media', 
      details: error.message 
    });
  }
};
