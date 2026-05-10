(() => {
    const data = window.SiteData || {};
    const page = document.body.dataset.page || 'home';

    const buildCategoryCard = (category) => `
        <article class="card" data-aos="fade-up">
            <img src="${category.image}" alt="${category.name}">
            <div class="overlay">
                <div class="icon-box"><img src="${category.icon}" alt="${category.name} icon"></div>
                <h3>${category.name}</h3>
                <p>${category.tagline}</p>
            </div>
        </article>
    `;

    const renderHome = () => {
        const container = document.getElementById('categoryCards');
        if (container && Array.isArray(data.categories)) {
            container.innerHTML = data.categories.map(buildCategoryCard).join('');
        }

        const achievementWrapper = document.getElementById('achievementsGrid');
        if (achievementWrapper && Array.isArray(data.achievements)) {
            achievementWrapper.innerHTML = data.achievements
                .map(item => `
                    <div class="achievement-card" data-aos="fade-up">
                        <span>${item.value}</span>
                        <p>${item.label}</p>
                    </div>
                `)
                .join('');
        }

        const clientWrapper = document.getElementById('clientGallery');
        if (clientWrapper && Array.isArray(data.clients)) {
            clientWrapper.innerHTML = data.clients
                .map(client => `<img src="${client.logo}" alt="${client.name}" data-aos="zoom-in">`)
                .join('');
        }

        const globalWrapper = document.getElementById('globalHighlights');
        if (globalWrapper && Array.isArray(data.globalHighlights)) {
            globalWrapper.innerHTML = data.globalHighlights
                .map(spot => `
                    <article class="global-card" data-aos="fade-up">
                        <h4>${spot.title}</h4>
                        <p>${spot.description}</p>
                    </article>
                `)
                .join('');
        }
    };

    const renderProducts = () => {
        const container = document.getElementById('productCategories');
        if (!container || !Array.isArray(data.categories)) return;

        container.innerHTML = data.categories
            .map(category => `
                <section class="product-section" data-aos="fade-up">
                    <div class="section-heading">
                        <p>Category</p>
                        <h2>${category.name}</h2>
                        <p>${category.summary}</p>
                    </div>
                    <div class="products-grid">
                        ${category.products
                            .map(product => `
                                <article class="product-card">
                                    <div class="product-card-header">
                                        <img src="${product.icon}" alt="${product.title} icon">
                                        <h3>${product.title}</h3>
                                    </div>
                                    <p>${product.description}</p>
                                    <ul>
                                        ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                                    </ul>
                                    <p class="specs">Key specs: ${product.specs.join(', ')}</p>
                                </article>
                            `)
                            .join('')}
                    </div>
                </section>
            `)
            .join('');
    };

    const renderMedia = () => {
        const container = document.getElementById('mediaList');
        if (!container || !Array.isArray(data.media)) return;

        container.innerHTML = data.media
            .map(item => `
                <article class="media-card" data-aos="fade-up">
                    <header>
                        <span class="badge">${item.type}</span>
                        <time>${item.date}</time>
                    </header>
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <a href="${item.link}" class="link-arrow">Read more ↗</a>
                </article>
            `)
            .join('');
    };

    const renderCareers = () => {
        const container = document.getElementById('careerBoard');
        if (!container || !Array.isArray(data.careers)) return;

        container.innerHTML = data.careers
            .map(job => `
                <article class="career-card" data-aos="fade-up">
                    <div class="career-card-header">
                        <h3>${job.title}</h3>
                        <span>${job.location}</span>
                    </div>
                    <p class="career-summary">${job.summary}</p>
                    <p class="career-meta">Experience: ${job.experience}</p>
                    <div class="chip-group">
                        ${job.skills.map(skill => `<span class="chip">${skill}</span>`).join('')}
                    </div>
                    <div class="chip-group">
                        ${job.perks.map(perk => `<span class="chip chip--accent">${perk}</span>`).join('')}
                    </div>
                    <button class="primary-btn">Apply Now</button>
                </article>
            `)
            .join('');
    };

    switch (page) {
        case 'home':
            renderHome();
            break;
        case 'products':
            renderProducts();
            break;
        case 'media':
            renderMedia();
            break;
        case 'careers':
            renderCareers();
            break;
        default:
            break;
    }
})();
