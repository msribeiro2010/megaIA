// =====================================================
// CARREGADOR DE CONFIGURAÇÕES DO SITE
// Atualiza o conteúdo do site com base no banco de dados
// =====================================================

(async function loadSiteConfigurations() {
    try {
        // Verificar se Supabase está disponível
        if (typeof initSupabase === 'undefined') {
            console.warn('Supabase não carregado, usando conteúdo estático');
            return;
        }

        const client = initSupabase();
        if (!client) {
            console.warn('Supabase não inicializado, usando conteúdo estático');
            return;
        }

        // Carregar todas as configurações
        const { data: configs, error } = await client
            .from('site_config')
            .select('*');

        if (error) throw error;

        // Converter array em objeto
        const configMap = {};
        configs.forEach(config => {
            configMap[config.config_key] = config.config_value;
        });

        // Aplicar configurações
        applyLogoConfig(configMap.site_logo);
        applyHeroConfig(configMap.hero_section);
        applyAboutConfig(configMap.about_section);

    } catch (error) {
        console.error('Erro ao carregar configurações do site:', error);
    }
})();

// =====================================================
// APLICAR LOGO
// =====================================================

function applyLogoConfig(config) {
    if (!config) return;

    const logoContainer = document.querySelector('.logo');
    if (!logoContainer) return;

    if (config.use_image && config.logo_url) {
        // Usar imagem como logo
        const logoHeight = config.logo_height || 60;
        const logoSlogan = config.logo_slogan || '';
        const sloganFont = config.logo_slogan_font || 'Montserrat';
        const sloganColor = config.logo_slogan_color || '#1a4d3a';

        logoContainer.innerHTML = `
            <img src="${config.logo_url}" alt="${config.logo_text || 'Logo'}" style="max-height: ${logoHeight}px;">
            ${logoSlogan ? `<p class="tagline" style="font-family: '${sloganFont}', sans-serif; color: ${sloganColor} !important;">${logoSlogan}</p>` : ''}
        `;
    } else {
        // Usar texto como logo
        logoContainer.innerHTML = `
            <h1>${config.logo_text || 'Priscilla Santalena'}</h1>
            ${config.tagline ? `<p class="tagline">${config.tagline}</p>` : ''}
        `;
    }
}

// =====================================================
// APLICAR HERO
// =====================================================

function applyHeroConfig(config) {
    console.log('🎨 Aplicando configuração do Hero:', config);

    if (!config) {
        console.log('⚠️ Nenhuma configuração de Hero encontrada');
        return;
    }

    // Atualizar título
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && config.title) {
        heroTitle.textContent = config.title;
    }

    // Atualizar subtítulo
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle && config.subtitle) {
        heroSubtitle.textContent = config.subtitle;
    }

    // Atualizar botão primário
    const btnPrimary = document.querySelector('.hero-buttons .btn-primary');
    if (btnPrimary && config.button_primary_text) {
        btnPrimary.textContent = config.button_primary_text;
        if (config.button_primary_link) {
            btnPrimary.setAttribute('href', config.button_primary_link);
        }
    }

    // Atualizar botão secundário
    const btnSecondary = document.querySelector('.hero-buttons .btn-secondary');
    if (btnSecondary && config.button_secondary_text) {
        btnSecondary.textContent = config.button_secondary_text;
        if (config.button_secondary_link) {
            btnSecondary.setAttribute('href', config.button_secondary_link);
        }
    }

    // Atualizar imagem de fundo
    const heroSection = document.querySelector('.hero');
    console.log('🖼️ Elemento Hero encontrado:', !!heroSection);
    console.log('🔧 use_hero_image:', config.use_hero_image);
    console.log('📸 background_images:', config.background_images);

    if (heroSection) {
        if (config.use_hero_image && config.background_images && config.background_images.length > 0) {
            // Usar imagem personalizada (imagem principal)
            const mainImageIndex = config.main_image_index || 0;
            const mainImageUrl = config.background_images[mainImageIndex];
            console.log('✅ Aplicando imagem:', mainImageUrl);

            // Adicionar classe para imagem personalizada
            heroSection.classList.add('has-custom-image');

            // Remover background do CSS
            heroSection.style.background = 'none';

            // Aplicar imagem
            heroSection.style.setProperty('background-image', `url('${mainImageUrl}')`, 'important');
            heroSection.style.setProperty('background-size', 'cover', 'important');
            heroSection.style.setProperty('background-position', 'center', 'important');
            heroSection.style.setProperty('background-repeat', 'no-repeat', 'important');

            console.log('🎨 Classe "has-custom-image" adicionada');
        } else {
            // Usar gradiente padrão (remover imagem se existir)
            console.log('🎨 Usando gradiente padrão');
            heroSection.classList.remove('has-custom-image');
            heroSection.style.removeProperty('background-image');
            heroSection.style.removeProperty('background-size');
            heroSection.style.removeProperty('background-position');
            heroSection.style.removeProperty('background-repeat');
            heroSection.style.background = '';
        }
    }

    // Atualizar opacidade do overlay
    const heroOverlay = document.querySelector('.hero-overlay');
    if (heroOverlay && config.overlay_opacity !== undefined) {
        heroOverlay.style.opacity = config.overlay_opacity;
        console.log('🌫️ Overlay opacity:', config.overlay_opacity);
    }
}

// =====================================================
// APLICAR SOBRE
// =====================================================

function applyAboutConfig(config) {
    if (!config) return;

    // Atualizar nome
    const aboutName = document.querySelector('.about-text h3');
    if (aboutName && config.name) {
        aboutName.textContent = config.name;
    }

    // Atualizar texto em destaque
    const aboutHighlight = document.querySelector('.about-text .highlight');
    if (aboutHighlight && config.highlight) {
        aboutHighlight.textContent = config.highlight;
    }

    // Atualizar biografia (primeiro parágrafo após highlight)
    const aboutParagraphs = document.querySelectorAll('.about-text p:not(.highlight)');
    if (aboutParagraphs.length > 0 && config.bio_intro) {
        aboutParagraphs[0].textContent = config.bio_intro;
    }

    // Atualizar texto antes da lista
    if (aboutParagraphs.length > 1 && config.bio_journey) {
        aboutParagraphs[1].textContent = config.bio_journey;
    }

    // Atualizar lista de especializações
    const servicesList = document.querySelector('.services-list');
    if (servicesList && config.services && Array.isArray(config.services)) {
        servicesList.innerHTML = config.services
            .map(service => `<li>✓ ${service}</li>`)
            .join('');
    }

    // Atualizar texto final
    const lastParagraph = document.querySelector('.about-text p:last-of-type');
    if (lastParagraph && config.bio_footer) {
        lastParagraph.textContent = config.bio_footer;
    }

    // Atualizar foto de perfil
    const profileImage = document.querySelector('.about-image img');
    if (profileImage && config.profile_image) {
        profileImage.src = config.profile_image;
    }
}
