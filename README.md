# HTML2PDF4ME

## Overview
HTML2PDF4ME is a Node.js library that converts HTML content into a PDF while optimizing images by downloading, compressing, and embedding them within the document.

## Features
- Extracts images from HTML content and compresses them before embedding.
- Uses Puppeteer to generate high-quality PDFs.
- Supports automatic folder and filename handling.
- Cleans up temporary image files after PDF generation.
- Configurable settings for image quality, size, and PDF options.

## Installation
To install the package, run the following command:
```sh
npm install html2pdf4me
```

## Usage
Below is an example of how to use `html2pdf4me` in your Node.js project:

```javascript
const createHTML2Pdf4me = require("html2pdf4me");

const htmlToPdf = new createHTML2Pdf4me({
  backendUrl: "http://localhost:3000",
  imageQuality: 50,
  imageSize: { width: 500, height: 500 },
  pdfOptions: {
    format: "A4",
    printBackground: true,
    margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" },
    scale: 0.9,
  },
});

const htmlContent = `<html><body><h1>Hello World</h1><img src="https://example.com/image.jpg"></body></html>`;
const fileName = "test_pdf";
const folderName = "uploads";

htmlToPdf.createPDF(htmlContent, fileName, folderName)
  .then((pdfUrl) => {
    console.log("PDF generated successfully at:", pdfUrl);
  })
  .catch((error) => {
    console.error("Error generating PDF:", error);
  });
```

## Configuration Options
| Option           | Type     | Default Value               | Description |
|-----------------|----------|-----------------------------|-------------|
| `backendUrl`    | String   | "http://localhost:3000"    | Base URL for accessing processed files. |
| `imageQuality`  | Number   | 50                          | Quality of compressed images (1-100). |
| `imageSize`     | Object   | `{ width: 500, height: 500 }` | Size of images after compression. |
| `pdfOptions`    | Object   | `{ format: "A4", printBackground: true, margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" }, scale: 0.9 }` | PDF configuration options for Puppeteer. |

## License
This project is licensed under the MIT License.

