// =====================================================
// SITE CONFIG MANAGER - Gerenciamento de Configurações
// =====================================================

const SiteConfigManager = {
    // Obter cliente Supabase
    getClient() {
        console.log('🔍 SiteConfigManager.getClient() chamado');

        // Tentar obter de diferentes formas
        if (window.supabaseClient) {
            console.log('✅ window.supabaseClient encontrado');
            return window.supabaseClient;
        }

        console.log('⚠️ window.supabaseClient não encontrado, tentando inicializar...');

        // Verificar se a biblioteca Supabase está disponível
        if (typeof window.supabase === 'undefined') {
            console.error('❌ Biblioteca Supabase não carregada');
            throw new Error('Biblioteca Supabase não carregada. Verifique se o CDN está incluído no HTML.');
        }

        // Tentar usar initSupabase
        if (typeof window.initSupabase === 'function') {
            console.log('🔄 Chamando window.initSupabase()...');
            const client = window.initSupabase();
            if (client) {
                window.supabaseClient = client;
                console.log('✅ Cliente inicializado e armazenado em window.supabaseClient');
                return client;
            }
        }

        console.error('❌ Não foi possível obter cliente Supabase');
        throw new Error('Supabase não inicializado. Verifique a configuração.');
    },

    // Obter configuração por chave
    async getConfig(configKey) {
        try {
            const client = this.getClient();

            const { data, error } = await client
                .from('site_config')
                .select('*')
                .eq('config_key', configKey)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`Erro ao carregar ${configKey}:`, error);
            return null;
        }
    },

    // Salvar/atualizar configuração
    async saveConfig(configKey, configValue) {
        try {
            console.log(`💾 Salvando ${configKey}...`);
            const client = this.getClient();

            console.log('📝 Dados a salvar:', { config_key: configKey, config_value: configValue });

            const { data, error } = await client
                .from('site_config')
                .upsert({
                    config_key: configKey,
                    config_value: configValue
                }, {
                    onConflict: 'config_key'
                })
                .select()
                .single();

            if (error) {
                console.error('❌ Erro do Supabase:', error);
                throw error;
            }

            console.log('✅ Dados salvos com sucesso:', data);
            return { success: true, data };
        } catch (error) {
            console.error(`❌ Erro ao salvar ${configKey}:`, error);
            return { success: false, error: error.message };
        }
    },

    // Carregar todas as configurações
    async loadAllConfigs() {
        try {
            const client = this.getClient();

            const { data, error } = await client
                .from('site_config')
                .select('*');

            if (error) throw error;

            // Converter array em objeto para facilitar acesso
            const configs = {};
            data.forEach(config => {
                configs[config.config_key] = config.config_value;
            });

            return configs;
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
            return {};
        }
    }
};

// =====================================================
// ADMIN - Gerenciamento de Conteúdo do Site
// =====================================================

// Carregar configurações ao abrir a página de conteúdo
async function loadContentPage() {
    try {
        // Carregar Logo
        await loadLogoConfig();

        // Carregar Hero
        await loadHeroConfig();

        // Carregar About
        await loadAboutConfig();

    } catch (error) {
        console.error('Erro ao carregar página de conteúdo:', error);
        showNotification('Erro ao carregar configurações', 'error');
    }
}

// =====================================================
// LOGO CONFIGURATION
// =====================================================

async function loadLogoConfig() {
    const config = await SiteConfigManager.getConfig('site_logo');

    if (config && config.config_value) {
        const data = config.config_value;

        document.getElementById('useLogoImage').checked = data.use_image || false;
        document.getElementById('logoText').value = data.logo_text || 'Priscilla Santalena';
        document.getElementById('logoTagline').value = data.tagline || 'Terapeuta Holística';
        document.getElementById('logoHeight').value = data.logo_height || 60;
        document.getElementById('logoSlogan').value = data.logo_slogan || '';
        document.getElementById('logoSloganFont').value = data.logo_slogan_font || 'Montserrat';
        document.getElementById('logoSloganColor').value = data.logo_slogan_color || '#1a4d3a';

        toggleLogoInputs(data.use_image);

        if (data.logo_url) {
            const preview = document.getElementById('logoPreview');
            preview.innerHTML = `<img src="${data.logo_url}" alt="Logo Preview" style="max-height: ${data.logo_height || 60}px;">`;
            preview.className = 'image-preview show';
        }
    }
}

function toggleLogoInputs(useImage) {
    const imageSection = document.getElementById('logoImageSection');
    const textSection = document.getElementById('logoTextSection');

    if (useImage) {
        imageSection.style.display = 'block';
        textSection.style.display = 'none';
    } else {
        imageSection.style.display = 'none';
        textSection.style.display = 'block';
    }
}

async function saveLogoConfig(e) {
    e.preventDefault();

    const useImage = document.getElementById('useLogoImage').checked;
    const logoFile = document.getElementById('logoImage').files[0];

    let logoUrl = null;

    // Upload logo se houver arquivo
    if (useImage && logoFile) {
        showNotification('Fazendo upload do logo...', 'info');

        const { data, error } = await SupabaseHelper.uploadImagem(logoFile, 'site');

        if (error) {
            showNotification('Erro ao fazer upload: ' + error, 'error');
            return;
        }

        logoUrl = data.url;
    }

    const currentConfig = await SiteConfigManager.getConfig('site_logo');

    const configData = {
        use_image: useImage,
        logo_text: document.getElementById('logoText').value,
        tagline: document.getElementById('logoTagline').value,
        logo_height: parseInt(document.getElementById('logoHeight').value) || 60,
        logo_slogan: document.getElementById('logoSlogan').value || '',
        logo_slogan_font: document.getElementById('logoSloganFont').value || 'Montserrat',
        logo_slogan_color: document.getElementById('logoSloganColor').value || '#1a4d3a',
        logo_url: logoUrl || currentConfig?.config_value?.logo_url || ''
    };

    const result = await SiteConfigManager.saveConfig('site_logo', configData);

    if (result.success) {
        showNotification('Logo atualizado com sucesso!', 'success');
        await updateSiteLogo(configData);
    } else {
        showNotification('Erro ao salvar logo: ' + result.error, 'error');
    }
}

// Atualizar logo no site principal (se estiver aberto)
async function updateSiteLogo(config) {
    // Esta função será chamada no index.html para atualizar o logo dinamicamente
    console.log('Logo atualizado:', config);
}

// =====================================================
// HERO SECTION CONFIGURATION
// =====================================================

async function loadHeroConfig() {
    const config = await SiteConfigManager.getConfig('hero_section');

    if (config && config.config_value) {
        const data = config.config_value;

        document.getElementById('heroTitle').value = data.title || '';
        document.getElementById('heroSubtitle').value = data.subtitle || '';
        document.getElementById('heroBtnPrimary').value = data.button_primary_text || '';
        document.getElementById('heroBtnPrimaryLink').value = data.button_primary_link || '#contato';
        document.getElementById('heroBtnSecondary').value = data.button_secondary_text || '';
        document.getElementById('heroBtnSecondaryLink').value = data.button_secondary_link || '#servicos';
        document.getElementById('heroOverlay').value = data.overlay_opacity || 0.7;

        // Carregar configuração de uso de imagem
        const useHeroImage = data.use_hero_image || false;
        document.getElementById('useHeroImage').checked = useHeroImage;
        toggleHeroImageSection(useHeroImage);

        // Carregar imagens existentes
        if (data.background_images && Array.isArray(data.background_images)) {
            renderHeroImageGallery(data.background_images, data.main_image_index || 0);
        }
    }
}

function toggleHeroImageSection(show) {
    const section = document.getElementById('heroImageSection');
    if (section) {
        section.style.display = show ? 'block' : 'none';
    }
}

function renderHeroImageGallery(images, mainIndex = 0) {
    const gallery = document.getElementById('heroImageGallery');
    if (!gallery) return;

    if (!images || images.length === 0) {
        gallery.innerHTML = '<div class="hero-image-gallery-empty">Nenhuma imagem adicionada ainda</div>';
        return;
    }

    gallery.innerHTML = images.map((imageUrl, index) => `
        <div class="hero-image-item ${index === mainIndex ? 'main-image' : ''}" data-index="${index}">
            <img src="${imageUrl}" alt="Hero Image ${index + 1}">
            <div class="hero-image-actions">
                ${index !== mainIndex ? `<button type="button" class="btn-set-main" onclick="setMainHeroImage(${index})">Definir como Principal</button>` : ''}
                <button type="button" class="btn-delete-image" onclick="deleteHeroImage(${index})">×</button>
            </div>
        </div>
    `).join('');
}

window.setMainHeroImage = function(index) {
    const items = document.querySelectorAll('.hero-image-item');
    items.forEach((item, i) => {
        if (i === index) {
            item.classList.add('main-image');
        } else {
            item.classList.remove('main-image');
        }
    });
    showNotification('Imagem principal definida! Clique em Salvar para confirmar.', 'info');
};

window.deleteHeroImage = async function(index) {
    if (!confirm('Deseja realmente remover esta imagem?')) return;

    const config = await SiteConfigManager.getConfig('hero_section');
    if (config && config.config_value && config.config_value.background_images) {
        const images = [...config.config_value.background_images];
        images.splice(index, 1);

        let mainIndex = config.config_value.main_image_index || 0;
        if (mainIndex === index) {
            mainIndex = 0;
        } else if (mainIndex > index) {
            mainIndex--;
        }

        const updatedConfig = {
            ...config.config_value,
            background_images: images,
            main_image_index: mainIndex
        };

        const result = await SiteConfigManager.saveConfig('hero_section', updatedConfig);

        if (result.success) {
            renderHeroImageGallery(images, mainIndex);
            showNotification('Imagem removida com sucesso!', 'success');
        } else {
            showNotification('Erro ao remover imagem', 'error');
        }
    }
};

async function saveHeroConfig(e) {
    e.preventDefault();

    console.log('💾 saveHeroConfig iniciado');

    const currentConfig = await SiteConfigManager.getConfig('hero_section');
    console.log('📦 Configuração atual:', currentConfig);

    const useHeroImage = document.getElementById('useHeroImage').checked;
    console.log('🖼️ Usar imagem personalizada?', useHeroImage);

    // Obter imagens existentes e índice principal atual
    let backgroundImages = currentConfig?.config_value?.background_images || [];
    let mainImageIndex = currentConfig?.config_value?.main_image_index || 0;

    console.log('📸 Imagens atuais:', backgroundImages);

    // Se usar imagem personalizada, processar uploads
    if (useHeroImage) {
        const imageFiles = document.getElementById('heroBackgroundImage').files;
        console.log('📁 Arquivos selecionados:', imageFiles?.length || 0);

        // Upload de novas imagens
        if (imageFiles && imageFiles.length > 0) {
            showNotification(`Fazendo upload de ${imageFiles.length} imagem(ns)...`, 'info');

            for (let i = 0; i < imageFiles.length; i++) {
                console.log(`📤 Fazendo upload da imagem ${i + 1}/${imageFiles.length}`);
                const { data, error } = await SupabaseHelper.uploadImagem(imageFiles[i], 'hero');

                if (error) {
                    console.error(`❌ Erro no upload da imagem ${i + 1}:`, error);
                    showNotification(`Erro ao fazer upload da imagem ${i + 1}: ${error}`, 'error');
                    continue;
                }

                console.log(`✅ Upload ${i + 1} concluído. URL:`, data.url);
                backgroundImages.push(data.url);
            }

            console.log('📸 Todas as imagens após upload:', backgroundImages);

            // Limpar input de arquivos
            document.getElementById('heroBackgroundImage').value = '';
        }

        // Verificar qual imagem está marcada como principal
        const mainItem = document.querySelector('.hero-image-item.main-image');
        if (mainItem) {
            mainImageIndex = parseInt(mainItem.dataset.index) || 0;
        }
    }

    const configData = {
        title: document.getElementById('heroTitle').value,
        subtitle: document.getElementById('heroSubtitle').value,
        button_primary_text: document.getElementById('heroBtnPrimary').value,
        button_primary_link: document.getElementById('heroBtnPrimaryLink').value,
        button_secondary_text: document.getElementById('heroBtnSecondary').value,
        button_secondary_link: document.getElementById('heroBtnSecondaryLink').value,
        overlay_opacity: parseFloat(document.getElementById('heroOverlay').value),
        use_hero_image: useHeroImage,
        background_images: useHeroImage ? backgroundImages : [],
        main_image_index: useHeroImage ? mainImageIndex : 0
    };

    console.log('💾 Dados a salvar:', configData);

    const result = await SiteConfigManager.saveConfig('hero_section', configData);

    if (result.success) {
        console.log('✅ Configuração salva com sucesso');
        showNotification('Seção Hero atualizada com sucesso!', 'success');
        // Recarregar galeria se houver imagens
        if (useHeroImage && backgroundImages.length > 0) {
            renderHeroImageGallery(backgroundImages, mainImageIndex);
        }
    } else {
        console.error('❌ Erro ao salvar configuração:', result.error);
        showNotification('Erro ao salvar: ' + result.error, 'error');
    }
}

// =====================================================
// ABOUT SECTION CONFIGURATION
// =====================================================

async function loadAboutConfig() {
    const config = await SiteConfigManager.getConfig('about_section');

    if (config && config.config_value) {
        const data = config.config_value;

        document.getElementById('aboutName').value = data.name || '';
        document.getElementById('aboutHighlight').value = data.highlight || '';
        document.getElementById('aboutBioIntro').value = data.bio_intro || '';
        document.getElementById('aboutBioJourney').value = data.bio_journey || '';
        document.getElementById('aboutServices').value = (data.services || []).join('\n');
        document.getElementById('aboutBioFooter').value = data.bio_footer || '';

        if (data.profile_image) {
            const preview = document.getElementById('aboutImagePreview');
            const actions = document.getElementById('aboutImageActions');
            preview.innerHTML = `<img src="${data.profile_image}" alt="Profile Preview">`;
            preview.className = 'image-preview show';
            if (actions) actions.style.display = 'block';
        }
    }
}

window.removeAboutImage = async function() {
    if (!confirm('Deseja realmente remover a foto de perfil?')) return;

    const preview = document.getElementById('aboutImagePreview');
    const actions = document.getElementById('aboutImageActions');
    const fileInput = document.getElementById('aboutProfileImage');

    // Limpar preview
    preview.innerHTML = '';
    preview.className = 'image-preview';
    if (actions) actions.style.display = 'none';
    if (fileInput) fileInput.value = '';

    // Salvar sem imagem
    const currentConfig = await SiteConfigManager.getConfig('about_section');
    const servicesText = document.getElementById('aboutServices').value;
    const servicesArray = servicesText.split('\n').filter(s => s.trim() !== '');

    const configData = {
        name: document.getElementById('aboutName').value,
        highlight: document.getElementById('aboutHighlight').value,
        bio_intro: document.getElementById('aboutBioIntro').value,
        bio_journey: document.getElementById('aboutBioJourney').value,
        services: servicesArray,
        bio_footer: document.getElementById('aboutBioFooter').value,
        profile_image: '' // Remover imagem
    };

    const result = await SiteConfigManager.saveConfig('about_section', configData);

    if (result.success) {
        showNotification('Foto removida com sucesso!', 'success');
    } else {
        showNotification('Erro ao remover foto: ' + result.error, 'error');
    }
};

async function saveAboutConfig(e) {
    e.preventDefault();

    const imageFile = document.getElementById('aboutProfileImage').files[0];

    let profileImage = null;

    // Upload foto de perfil se houver
    if (imageFile) {
        showNotification('Fazendo upload da imagem...', 'info');

        const { data, error } = await SupabaseHelper.uploadImagem(imageFile, 'about');

        if (error) {
            showNotification('Erro ao fazer upload: ' + error, 'error');
            return;
        }

        profileImage = data.url;
    }

    const currentConfig = await SiteConfigManager.getConfig('about_section');

    // Converter textarea de serviços em array
    const servicesText = document.getElementById('aboutServices').value;
    const servicesArray = servicesText.split('\n').filter(s => s.trim() !== '');

    const configData = {
        name: document.getElementById('aboutName').value,
        highlight: document.getElementById('aboutHighlight').value,
        bio_intro: document.getElementById('aboutBioIntro').value,
        bio_journey: document.getElementById('aboutBioJourney').value,
        services: servicesArray,
        bio_footer: document.getElementById('aboutBioFooter').value,
        profile_image: profileImage || currentConfig?.config_value?.profile_image || 'images/priscilla.jpg'
    };

    const result = await SiteConfigManager.saveConfig('about_section', configData);

    if (result.success) {
        showNotification('Seção Sobre atualizada com sucesso!', 'success');
    } else {
        showNotification('Erro ao salvar: ' + result.error, 'error');
    }
}

// =====================================================
// TAB NAVIGATION
// =====================================================

function initContentTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;

            // Remove active de todos
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Adiciona active no clicado
            btn.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
        });
    });
}

// =====================================================
// PREVIEW DE IMAGENS
// =====================================================

function setupImagePreviews() {
    // Logo
    const logoImageInput = document.getElementById('logoImage');
    if (logoImageInput) {
        logoImageInput.addEventListener('change', (e) => {
            previewImageFile(e, 'logoPreview');
        });
    }

    // Hero - Preview temporário antes do upload
    const heroImageInput = document.getElementById('heroBackgroundImage');
    if (heroImageInput) {
        heroImageInput.addEventListener('change', (e) => {
            previewHeroImages(e);
        });
    }

    // About
    const aboutImageInput = document.getElementById('aboutProfileImage');
    if (aboutImageInput) {
        aboutImageInput.addEventListener('change', (e) => {
            previewImageFile(e, 'aboutImagePreview');
        });
    }
}

function previewHeroImages(e) {
    const files = e.target.files;
    const gallery = document.getElementById('heroImageGallery');

    if (!files || files.length === 0 || !gallery) return;

    // Mostrar preview temporário
    const tempPreviews = document.createElement('div');
    tempPreviews.className = 'hero-image-gallery';
    tempPreviews.innerHTML = '<div class="hero-image-gallery-empty">📸 ' + files.length + ' nova(s) imagem(ns) selecionada(s). Clique em "Salvar Hero" para fazer upload.</div>';

    // Adicionar ao lado da galeria existente
    if (gallery.querySelector('.hero-image-gallery-empty')) {
        // Se galeria está vazia, substituir
        gallery.innerHTML = tempPreviews.innerHTML;
    } else {
        // Se já tem imagens, adicionar aviso
        const notice = document.createElement('div');
        notice.style.cssText = 'padding: 1rem; background: #e3f2fd; border-left: 4px solid #2196f3; margin: 1rem 0; border-radius: 4px;';
        notice.innerHTML = `<strong>📸 ${files.length} nova(s) imagem(ns) selecionada(s)</strong><br><small>Clique em "Salvar Hero" para fazer upload e adicionar à galeria.</small>`;
        gallery.parentElement.insertBefore(notice, gallery.nextSibling);

        // Remover aviso após 5 segundos
        setTimeout(() => notice.remove(), 5000);
    }
}

function previewImageFile(e, previewId) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById(previewId);
            if (preview) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                preview.className = 'image-preview show';
            }
        };
        reader.readAsDataURL(file);
    }
}
