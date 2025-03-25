const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const fetch = require("node-fetch");

class ImageProcessor {
  constructor(imageCacheDir, backendUrl, imageQuality, imageSize, imageStyle) {
    this.IMAGE_CACHE_DIR = imageCacheDir;
    this.BACKEND_URL = backendUrl;
    this.imageQuality = imageQuality;
    this.imageSize = imageSize;
    this.imageStyle = imageStyle;

    if (!fs.existsSync(this.IMAGE_CACHE_DIR)) {
      fs.mkdirSync(this.IMAGE_CACHE_DIR, { recursive: true });
    }
  }

  async downloadAndCompressImage(imageUrl) {
    try {
      console.log(`Downloading: ${imageUrl}`);
      const response = await fetch(imageUrl, { timeout: 10000 });
      if (!response.ok) throw new Error(`Failed to fetch: ${imageUrl}`);
      
      const buffer = await response.arrayBuffer();
      const fileName = `${Date.now()}-${path.basename(imageUrl)}`;
      const filePath = path.join(this.IMAGE_CACHE_DIR, fileName);

      await sharp(Buffer.from(buffer))
        .resize(this.imageSize.width, this.imageSize.height, { fit: "cover" })
        .jpeg({ quality: this.imageQuality })
        .toFile(filePath);

      return `${this.BACKEND_URL}/tmp_images/${fileName}`;
    } catch (error) {
      console.error(`❌ Error processing image: ${imageUrl}`, error.message);
      return null;
    }
  }

  cleanupTempImages() {
    fs.readdir(this.IMAGE_CACHE_DIR, (err, files) => {
      if (err) {
        console.error("Error reading temp images directory:", err);
        return;
      }
      files.forEach((file) => {
        const filePath = path.join(this.IMAGE_CACHE_DIR, file);
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting file:", filePath, unlinkErr);
          }
        });
      });
    });
  }
}

module.exports = { ImageProcessor };