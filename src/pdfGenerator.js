const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

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
      const pdfBuffer = await page.pdf(this.pdfOptions);
      await browser.close();
      
      let name = `${Date.now()}-${fileName}.pdf`;
      let filePath = path.join(process.cwd(), folderName, name);

      // Ensure unique filename
      let counter = 1;
      while (fs.existsSync(filePath)) {
        name = `${Date.now()}-${counter}-${fileName}.pdf`;
        filePath = path.join(process.cwd(), folderName, name);
        counter++;
      }
      
      fs.writeFileSync(filePath, pdfBuffer);
      
      return `${this.backendUrl}/${folderName}/${name}`;
    } catch (error) {
      throw new Error(`PDF generation failed: ${error.message}`);
    }
  }
}

module.exports = { PdfGenerator };