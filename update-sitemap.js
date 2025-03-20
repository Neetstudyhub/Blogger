async function updateSitemap() {
    try {
        const response = await fetch('https://broken-hall-68ac.earnmoney100a.workers.dev/');
        const data = await response.json();
        
        let sitemapEntries = [];

        data.items.forEach(post => {
            const formattedTitle = post.title
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-') // Convert title to SEO-friendly slug
                .replace(/^-+|-+$/g, ''); // Remove leading/trailing "-"

            const postUrl = `https://neetstudyhub.github.io/pixellab/mypost/${formattedTitle}`;
            
            sitemapEntries.push(`
                <url>
                    <loc>${postUrl}</loc>
                    <lastmod>${new Date(post.published).toISOString()}</lastmod>
                    <changefreq>weekly</changefreq>
                    <priority>0.8</priority>
                </url>
            `);
        });

        const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                ${sitemapEntries.join('\n')}
            </urlset>
        `;

        // Store sitemap.xml in your GitHub repository
        console.log("Updated Sitemap:", sitemapContent);

        // You need to manually update your GitHub repository using GitHub API or GitHub Actions
        // If using GitHub Actions, you can automate pushing the updated sitemap.xml

    } catch (error) {
        console.error('Error updating sitemap:', error);
    }
}

// Run the update
updateSitemap();
