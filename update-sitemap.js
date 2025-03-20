async function updateSitemap() {
    const sitemapUrl = 'https://neetstudyhub.github.io/Blogger/sitemap.xml'; // Your sitemap location
    const apiUrl = 'https://broken-hall-68ac.earnmoney100a.workers.dev/'; // Blogger API URL

    try {
        // 1️⃣ Fetch the current sitemap.xml (if exists)
        let existingUrls = new Set();
        try {
            const sitemapResponse = await fetch(sitemapUrl);
            if (sitemapResponse.ok) {
                const sitemapText = await sitemapResponse.text();
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(sitemapText, "text/xml");
                const urls = xmlDoc.getElementsByTagName("loc");

                for (let url of urls) {
                    existingUrls.add(url.textContent);
                }
            }
        } catch (err) {
            console.warn('Could not fetch existing sitemap. Creating a new one.');
        }

        // 2️⃣ Fetch new blog posts from API
        const response = await fetch(apiUrl);
        const data = await response.json();
        let newUrls = new Set();

        data.items.forEach(post => {
            const formattedTitle = post.title
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-') // Convert title to SEO-friendly slug
                .replace(/^-+|-+$/g, ''); // Remove leading/trailing "-"

            const postUrl = `https://neetstudyhub.github.io/Blogger/post/${formattedTitle}`;
            newUrls.add(postUrl);
        });

        // 3️⃣ Merge old and new URLs
        const allUrls = new Set([...existingUrls, ...newUrls]);

        // 4️⃣ Construct the updated sitemap content
        let sitemapEntries = [...allUrls].map(url => `
            <url>
                <loc>${url}</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>weekly</changefreq>
                <priority>0.8</priority>
            </url>
        `).join('\n');

        const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                ${sitemapEntries}
            </urlset>
        `;

        // Log sitemap for testing
        console.log("Updated Sitemap:\n", sitemapContent);

        // 5️⃣ Save sitemap.xml back to GitHub repository (handled in GitHub Actions)

    } catch (error) {
        console.error('Error updating sitemap:', error);
    }
}

// Run the update function
updateSitemap();
