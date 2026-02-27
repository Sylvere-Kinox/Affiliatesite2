const fs = require('fs');
const path = require('path');

(function() {
    const dataPath = path.join(__dirname, '..', 'data', 'articles.json');
    const blogPath = path.join(__dirname, '..', 'blog.html');

    const articles = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    // only include those with price or affiliate link (exclude long SEO article maybe)
    const filtered = articles.filter(a => a.price || a.affiliateLink);

    function makeCard(article) {
        const titleShort = article.title.replace(/ Machine à café.*$/,'');
        const rating = article.rating || '';
        const time = '3 min';
        return `            <div class="card-professional p-6 mt-6">
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="md:w-1/3">
                        <img loading="lazy" src="images/${article.id}-320.avif" alt="${article.title} — Test" class="w-full h-48 object-cover rounded-lg">
                    </div>
                    <div class="md:w-2/3">
                        <div class="flex gap-2 mb-3">
                            <span class="bg-secondary text-white px-3 py-1 rounded-full text-xs font-semibold">TEST COMPLET</span>
                            ${rating ? `<span class="bg-warning text-white px-3 py-1 rounded-full text-xs font-semibold">★ ${rating}</span>` : ''}
                        </div>
                        <h3 class="text-2xl font-bold text-primary mb-3">${article.title} — avis ${rating ? '' : ''}</h3>
                        <p class="text-muted mb-4">${article.shortExcerpt || ''}</p>
                        <div class="flex justify-between items-center text-sm text-muted">
                            <div class="flex gap-4">
                                <span>📅 ${article.lastUpdated}</span>
                                <span>👤 Par <a href="about.html">Sylvère Kinox</a></span>
                                <span>⏱️ ${time}</span>
                            </div>
                            <a href="${article.slug}" class="text-secondary font-semibold hover:text-accent transition-colors">Lire l'article complet →</a>
                        </div>
                    </div>
                </div>
            </div>\n`;
    }

    const cards = filtered.map(makeCard).join('');

    let blogHtml = fs.readFileSync(blogPath, 'utf8');
    const startMarker = '<!-- DYNAMIC-ARTICLES-START -->';
    const endMarker = '<!-- DYNAMIC-ARTICLES-END -->';
    const regex = new RegExp(`${startMarker}[\s\S]*?${endMarker}`);
    const replacement = `${startMarker}\n${cards}            ${endMarker}`;
    blogHtml = blogHtml.replace(regex, replacement);
    fs.writeFileSync(blogPath, blogHtml);
    console.log('Updated blog.html with', filtered.length, 'articles');
})();