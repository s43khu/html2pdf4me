const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

class PdfGenerator {
  constructor(pdfOptions, backendUrl) {
    this.pdfOptions = pdfOptions;
    this.backendUrl = backendUrl;
  }

  async createPDF(htmlContent, fileName, folderName) {
    try {
      const browser = await puppeteer.launch({
        headless: "new",
        args: ["--disable-dev-shm-usage", "--no-sandbox"],
      });
      const page = await browser.newPage();
      await page.setDefaultNavigationTimeout(300000);
      await page.setContent(htmlContent, { waitUntil: "load" });
      const pdfBuffer = await page.pdf(this.pdfOptions);
      await browser.close();
      
      const name = `${Date.now()}-${fileName}.pdf`;
      const filePath = path.join(process.cwd(), folderName, name);
      fs.writeFileSync(filePath, pdfBuffer);
      
      return `${this.backendUrl}/${folderName}/${name}`;
    } catch (error) {
      throw new Error(`PDF generation failed: ${error.message}`);
    }
  }
}

module.exports = { PdfGenerator };