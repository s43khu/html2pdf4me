const extractImageSources = (html) => {
    const regex = /<img[^>]+src="([^"]+)"/g;
    let images = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      images.push(match[1]);
    }
    return images;
  };
  
  module.exports = { extractImageSources };