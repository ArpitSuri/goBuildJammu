import Product from "../model/productModel.js";

// Renamed and fixed the export syntax for a standard Express controller
export const getSitemap = async (req, res) => {
    try {
        const products = await Product.find({}, "_id updatedAt");

        // Map through products to create URL entries
        const productUrls = products.map(p => `
    <url>
      <loc>https://www.digitalinfratech.in/product/${p._id}</loc>
      <lastmod>${p.updatedAt ? p.updatedAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
      <priority>0.7</priority>
    </url>`).join("");

        // Construct the full XML string
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.digitalinfratech.in/</loc>
    <priority>1.0</priority>
  </url>
  ${productUrls}
</urlset>`;

        // Set the header so the browser/Google treats it as a file, not a string
        res.header("Content-Type", "application/xml");
        res.status(200).send(sitemap.trim());
    } catch (err) {
        console.error("Sitemap Generation Error:", err);
        res.status(500).send("Error generating sitemap");
    }
};