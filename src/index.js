const path = require("path");
const { extractImageSources } = require("./extractImages");
const { ImageProcessor } = require("./imageProcessor");
const { PdfGenerator } = require("./pdfGenerator");

class createHTML2Pdf4me {
  constructor(options = {}) {
    this.IMAGE_CACHE_DIR = options.imageCacheDir || path.join(process.cwd(), "tmp_images");
    this.BACKEND_URL = options.backendUrl || "http://localhost:3000";
    this.defaultPDFOptions = options.pdfOptions || {
      format: "A4",
      printBackground: true,
      margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" },
      scale: 0.9,
    };
    this.imageQuality = options.imageQuality || 50;
    this.imageSize = options.imageSize || { width: 500, height: 500 };
    this.imageStyle = options.imageStyle || 'object-fit: cover;';
    this.imageProcessor = new ImageProcessor(this.IMAGE_CACHE_DIR, this.BACKEND_URL, this.imageQuality, this.imageSize, this.imageStyle);
    this.pdfGenerator = new PdfGenerator(this.defaultPDFOptions, this.BACKEND_URL);
  }

  async optimizeImagesInHTML(htmlContent) {
    const imageSources = extractImageSources(htmlContent);
    for (const imgSrc of imageSources) {
      const compressedImagePath = await this.imageProcessor.downloadAndCompressImage(imgSrc);
      if (compressedImagePath) {
        htmlContent = htmlContent.replace(imgSrc, compressedImagePath);
      }
    }
    htmlContent = htmlContent.replace(
      /<img /g,
      `<img width="${this.imageSize.width}" height="${this.imageSize.height}" style="${this.imageStyle}" `
    );
    return htmlContent;
  }

  async createPDF(htmlContent, fileName, folderName) {
    const optimizedHTML = await this.optimizeImagesInHTML(htmlContent);
    return await this.pdfGenerator.createPDF(optimizedHTML, fileName, folderName);
  }
}

module.exports = createHTML2Pdf4me;