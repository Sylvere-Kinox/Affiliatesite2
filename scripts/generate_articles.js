const fs = require('fs');
const path = require('path');

function render(template, data) {
    let out = template;
    for (const key of Object.keys(data)) {
        const re = new RegExp(`{{${key}}}`, 'g');
        out = out.replace(re, data[key]);
    }
    return out;
}

function generateLongSeoText() {
    // create a long article of roughly 10000 words by repeating a base paragraph
    const paragraph = `
<p class="text-muted mb-4">Les cafetières silencieuses deviennent incontournables dans les bureaux modernes. Entre open space et salles de réunion, un bruit discret garantit une ambiance propice à la concentration. Nous explorons ici les technologies, les critères d'achat, et les conseils d'entretien pour faire le meilleur choix.</p>
`;
    let text = '';
    // 10k words ~ 10000/50=200 paragraphs of ~50 words
    for (let i = 0; i < 210; i++) {
        text += paragraph;
    }
    return text;
}

(function() {
    const dataPath = path.join(__dirname, '..', 'data', 'articles.json');
    const templatePath = path.join(__dirname, '..', 'templates', 'article-template.html');
    const outDir = path.join(__dirname, '..'); // root

    const articles = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const template = fs.readFileSync(templatePath, 'utf8');

    articles.forEach(article => {
        // build features HTML
        let featuresHtml = '';
        article.features.forEach(f => {
            featuresHtml += `                    <div class="bg-neutral p-4 rounded-xl">
                        <strong class="text-primary">${f}</strong>
                    </div>\n`;
        });
        const firstFeature = article.features[0] || '';
        // content
        let content = article.content || '';
        if (article.slug === 'cafetiere-silencieuse-bureau.html') {
            content = generateLongSeoText();
        }
        const renderData = Object.assign({}, article, {
            featuresHtml,
            firstFeature,
            content
        });
        const html = render(template, renderData);
        fs.writeFileSync(path.join(outDir, article.slug), html);
        console.log('Written', article.slug);
    });
})();
