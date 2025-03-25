const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

if (typeof ReadableStream === "undefined") {
  global.ReadableStream = require("web-streams-polyfill").ReadableStream;
}

class PdfGenerator {
  constructor(pdfOptions, backendUrl, executablePath) {
    this.pdfOptions = pdfOptions;
    this.backendUrl = backendUrl;
    this.executablePath = executablePath;
  }

  async createPDF(htmlContent, fileName, folderName) {
    try {
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName, { recursive: true });
      }

      const browser = await puppeteer.launch({
        headless: "new",
        args: ["--disable-dev-shm-usage", "--no-sandbox"],
        executablePath: this.executablePath || undefined,
      });
      const page = await browser.newPage();
      await page.setDefaultNavigationTimeout(300000);
      await page.setContent(htmlContent, { waitUntil: "load" });

      const pdfFile = path.join(process.cwd(), folderName, `${Date.now()}-${fileName}.pdf`);
      await page.pdf({ path: pdfPath, ...this.pdfOptions });
      await browser.close();

      const pdfBuffer = fs.readFileSync(pdfPath);
      return pdfFile;
    } catch (error) {
      throw new Error(`PDF generation failed: ${error.message}`);
    }

  }
}

module.exports = { PdfGenerator };