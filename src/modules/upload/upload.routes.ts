import { Router, Request, Response } from "express";
import {
  uploadSingle,
  uploadMultiple,
  handleMulterError,
} from "../../middlewares/upload.middleware";
import { ImageService } from "../../services/image.service";

const router = Router();

// ============================================
// GENERIC IMAGE UPLOAD
// ============================================

router.post(
  "/upload-image",
  uploadSingle,
  handleMulterError,
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image provided" });
      }

      const imageService = req.app.locals.imageService as ImageService;

      const result = await imageService.uploadImage(req.file, {
        folder: req.body.folder || "uploads",
        resize:
          req.body.width || req.body.height
            ? {
                width: req.body.width ? parseInt(req.body.width) : undefined,
                height: req.body.height ? parseInt(req.body.height) : undefined,
                fit: req.body.fit || "cover",
              }
            : undefined,
        quality: req.body.quality ? parseInt(req.body.quality) : 80,
        generateThumbnail: req.body.thumbnail === "true",
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
);

// ============================================
// MULTIPLE IMAGES
// ============================================

router.post(
  "/upload-multiple-images",
  uploadMultiple,
  handleMulterError,
  async (req: Request, res: Response) => {
    try {
      if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({ error: "No images provided" });
      }

      const imageService = req.app.locals.imageService as ImageService;

      const results = await imageService.uploadMultipleImages(req.files, {
        folder: req.body.folder || "uploads",
        quality: req.body.quality ? parseInt(req.body.quality) : 80,
        generateThumbnail: req.body.thumbnail === "true",
      });

      res.json({
        success: true,
        count: results.length,
        data: results,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
);

// ============================================
// DELETE
// ============================================

router.delete("/*key", async (req: Request, res: Response) => {
  try {
    const imageService = req.app.locals.imageService as ImageService;
    const key = (req.params.key as unknown as string[]).join("/");
    await imageService.deleteImage(key);
    res.json({ success: true, deleted: key });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
