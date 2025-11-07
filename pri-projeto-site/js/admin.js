// =====================================================
// ADMIN DASHBOARD JAVASCRIPT
// =====================================================

let currentUser = null;
let produtos = [];
let pedidos = [];
let cupons = [];
let currentEditingProduct = null;

// Verificar autenticação ao carregar página
window.addEventListener('DOMContentLoaded', async () => {
    const isAuth = await SupabaseHelper.isAuthenticated();

    if (!isAuth) {
        window.location.href = 'admin-login.html';
        return;
    }

    currentUser = await SupabaseHelper.getCurrentUser();
    if (currentUser) {
        document.getElementById('adminEmail').textContent = currentUser.email;
    }

    // Carregar dashboard
    loadDashboard();

    // Setup event listeners
    setupEventListeners();
});

// =====================================================
// SETUP EVENT LISTENERS
// =====================================================

function setupEventListeners() {
    // Navegação
    document.querySelectorAll('.admin-nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            navigateTo(page);
        });
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Refresh
    document.getElementById('refreshBtn').addEventListener('click', () => {
        const currentPage = document.querySelector('.admin-page.active').id.replace('-page', '');
        loadPageContent(currentPage);
    });

    // Produto Modal
    document.getElementById('addProductBtn')?.addEventListener('click', () => {
        currentEditingProduct = null;
        openProductModal();
    });

    document.getElementById('productForm')?.addEventListener('submit', saveProduct);

    // Preview de imagem
    document.getElementById('productImage')?.addEventListener('change', previewImage);

    // Filtro de pedidos
    document.getElementById('statusFilter')?.addEventListener('change', filterOrders);

    // ===== CONTEÚDO DO SITE =====
    // Tabs
    initContentTabs();

    // Previews de imagem
    setupImagePreviews();

    // Toggle Logo Image/Text
    document.getElementById('useLogoImage')?.addEventListener('change', (e) => {
        toggleLogoInputs(e.target.checked);
    });

    // Toggle Hero Image Section
    document.getElementById('useHeroImage')?.addEventListener('change', (e) => {
        toggleHeroImageSection(e.target.checked);
    });

    // Forms de Conteúdo
    document.getElementById('logoForm')?.addEventListener('submit', saveLogoConfig);
    document.getElementById('heroForm')?.addEventListener('submit', saveHeroConfig);
    document.getElementById('aboutForm')?.addEventListener('submit', saveAboutConfig);
}

// =====================================================
// NAVEGAÇÃO
// =====================================================

function navigateTo(page) {
    // Atualizar menu ativo
    document.querySelectorAll('.admin-nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === page) {
            item.classList.add('active');
        }
    });

    // Atualizar páginas
    document.querySelectorAll('.admin-page').forEach(p => {
        p.classList.remove('active');
    });
    document.getElementById(`${page}-page`).classList.add('active');

    // Atualizar título
    const titles = {
        dashboard: 'Dashboard',
        conteudo: 'Conteúdo do Site',
        produtos: 'Gerenciar Produtos',
        pedidos: 'Gerenciar Pedidos',
        cupons: 'Cupons Promocionais',
        configuracoes: 'Configurações'
    };
    document.getElementById('pageTitle').textContent = titles[page];

    // Carregar conteúdo
    loadPageContent(page);
}

function goToPage(page) {
    navigateTo(page);
}

// =====================================================
// LOGOUT
// =====================================================

async function logout() {
    if (confirm('Deseja realmente sair?')) {
        await SupabaseHelper.signOut();
        window.location.href = 'admin-login.html';
    }
}

// =====================================================
// DASHBOARD
// =====================================================

async function loadDashboard() {
    try {
        // Carregar produtos
        const { data: produtosData } = await SupabaseHelper.getProdutos();
        produtos = produtosData || [];

        // Carregar pedidos (implementação futura com tabela real)
        // Por enquanto, dados simulados
        pedidos = [];

        // Atualizar estatísticas
        document.getElementById('totalProdutos').textContent = produtos.length;
        document.getElementById('totalPedidos').textContent = pedidos.length;

        const receita = pedidos.reduce((sum, p) => sum + parseFloat(p.total || 0), 0);
        document.getElementById('receitaTotal').textContent = `€${receita.toFixed(2)}`;

        const clientes = [...new Set(pedidos.map(p => p.cliente_email))].length;
        document.getElementById('totalClientes').textContent = clientes;

        // Produtos com baixo estoque
        loadLowStockProducts();

    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        showNotification('Erro ao carregar dashboard', 'error');
    }
}

function loadLowStockProducts() {
    const lowStock = produtos.filter(p => p.estoque <= 5).sort((a, b) => a.estoque - b.estoque);

    const container = document.getElementById('lowStockProducts');

    if (lowStock.length === 0) {
        container.innerHTML = '<p class="loading-text">Nenhum produto com estoque baixo</p>';
        return;
    }

    const table = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Produto</th>
                    <th>Categoria</th>
                    <th>Estoque</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${lowStock.map(p => `
                    <tr>
                        <td><strong>${p.nome}</strong></td>
                        <td>${getCategoryName(p.categoria)}</td>
                        <td><span class="badge badge-warning">${p.estoque} unidades</span></td>
                        <td>
                            <button class="btn-table btn-edit" onclick="editProduct('${p.id}')">
                                Atualizar Estoque
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    container.innerHTML = table;
}

// =====================================================
// CARREGAR CONTEÚDO DAS PÁGINAS
// =====================================================

async function loadPageContent(page) {
    switch (page) {
        case 'dashboard':
            await loadDashboard();
            break;
        case 'conteudo':
            await loadContentPage();
            break;
        case 'produtos':
            await loadProducts();
            break;
        case 'pedidos':
            await loadOrders();
            break;
        case 'cupons':
            await loadCoupons();
            break;
        case 'configuracoes':
            await loadSettings();
            break;
    }
}

// =====================================================
// PRODUTOS
// =====================================================

async function loadProducts() {
    const container = document.getElementById('productsTable');
    container.innerHTML = '<p class="loading-text">Carregando produtos...</p>';

    try {
        const { data, error } = await SupabaseHelper.getProdutos();

        if (error) throw error;

        produtos = data || [];

        if (produtos.length === 0) {
            container.innerHTML = '<p class="loading-text">Nenhum produto cadastrado</p>';
            return;
        }

        const table = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Categoria</th>
                        <th>Preço</th>
                        <th>Estoque</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${produtos.map(p => `
                        <tr>
                            <td>
                                <strong>${p.nome}</strong>
                                ${p.badge ? `<span class="badge badge-info">${p.badge}</span>` : ''}
                            </td>
                            <td>${getCategoryName(p.categoria)}</td>
                            <td>
                                €${p.preco.toFixed(2)}
                                ${p.preco_antigo ? `<br><small style="text-decoration: line-through;">€${p.preco_antigo.toFixed(2)}</small>` : ''}
                            </td>
                            <td>
                                <span class="badge ${p.estoque <= 5 ? 'badge-warning' : 'badge-success'}">
                                    ${p.estoque}
                                </span>
                            </td>
                            <td>
                                <span class="badge ${p.ativo ? 'badge-success' : 'badge-danger'}">
                                    ${p.ativo ? 'Ativo' : 'Inativo'}
                                </span>
                            </td>
                            <td class="table-actions">
                                <button class="btn-table btn-edit" onclick="editProduct('${p.id}')">Editar</button>
                                <button class="btn-table btn-delete" onclick="deleteProduct('${p.id}', '${p.nome.replace(/'/g, "\\'")}')">Deletar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = table;

    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        container.innerHTML = '<p class="loading-text" style="color: red;">Erro ao carregar produtos</p>';
    }
}

function openProductModal(product = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    form.reset();
    document.getElementById('imagePreview').className = 'image-preview';

    if (product) {
        document.getElementById('modalTitle').textContent = 'Editar Produto';
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.nome;
        document.getElementById('productDescription').value = product.descricao || '';
        document.getElementById('productCategory').value = product.categoria;
        document.getElementById('productPrice').value = product.preco;
        document.getElementById('productOldPrice').value = product.preco_antigo || '';
        document.getElementById('productStock').value = product.estoque;
        document.getElementById('productVolume').value = product.volume || '';
        document.getElementById('productBadge').value = product.badge || '';
        document.getElementById('productActive').value = product.ativo;

        if (product.imagem_url) {
            const preview = document.getElementById('imagePreview');
            preview.innerHTML = `<img src="${product.imagem_url}" alt="Preview">`;
            preview.className = 'image-preview show';
        }
    } else {
        document.getElementById('modalTitle').textContent = 'Novo Produto';
    }

    modal.classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

function previewImage(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('imagePreview');
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            preview.className = 'image-preview show';
        };
        reader.readAsDataURL(file);
    }
}

async function saveProduct(e) {
    e.preventDefault();

    const productId = document.getElementById('productId').value;
    const imageFile = document.getElementById('productImage').files[0];

    let imagemUrl = null;

    // Upload imagem se houver
    if (imageFile) {
        showNotification('Fazendo upload da imagem...', 'info');

        const { data, error } = await SupabaseHelper.uploadImagem(imageFile, 'produtos');

        if (error) {
            showNotification('Erro ao fazer upload da imagem: ' + error, 'error');
            return;
        }

        imagemUrl = data.url;
    }

    const produto = {
        nome: document.getElementById('productName').value,
        descricao: document.getElementById('productDescription').value,
        categoria: document.getElementById('productCategory').value,
        preco: parseFloat(document.getElementById('productPrice').value),
        preco_antigo: document.getElementById('productOldPrice').value ? parseFloat(document.getElementById('productOldPrice').value) : null,
        estoque: parseInt(document.getElementById('productStock').value),
        volume: document.getElementById('productVolume').value || null,
        badge: document.getElementById('productBadge').value || null,
        ativo: document.getElementById('productActive').value === 'true'
    };

    if (imagemUrl) {
        produto.imagem_url = imagemUrl;
    }

    try {
        if (productId) {
            // Atualizar
            const { error } = await SupabaseHelper.updateProduto(productId, produto);
            if (error) throw error;
            showNotification('Produto atualizado com sucesso!', 'success');
        } else {
            // Criar
            const { error } = await SupabaseHelper.createProduto(produto);
            if (error) throw error;
            showNotification('Produto criado com sucesso!', 'success');
        }

        closeModal('productModal');
        await loadProducts();

    } catch (error) {
        console.error('Erro ao salvar produto:', error);
        showNotification('Erro ao salvar produto: ' + error.message, 'error');
    }
}

async function editProduct(id) {
    const product = produtos.find(p => p.id === id);
    if (product) {
        currentEditingProduct = product;
        openProductModal(product);
    }
}

async function deleteProduct(id, nome) {
    if (!confirm(`Deseja realmente deletar o produto "${nome}"?`)) {
        return;
    }

    try {
        const { error } = await SupabaseHelper.deleteProduto(id);
        if (error) throw error;

        showNotification('Produto deletado com sucesso!', 'success');
        await loadProducts();

    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        showNotification('Erro ao deletar produto: ' + error.message, 'error');
    }
}

// =====================================================
// PEDIDOS
// =====================================================

async function loadOrders() {
    const container = document.getElementById('ordersTable');
    container.innerHTML = '<p class="loading-text">Em breve: Gerenciamento de pedidos</p>';

    // Implementação futura quando houver pedidos reais
}

function filterOrders() {
    // Implementação futura
}

// =====================================================
// CUPONS
// =====================================================

async function loadCoupons() {
    const container = document.getElementById('couponsTable');
    container.innerHTML = '<p class="loading-text">Em breve: Gerenciamento de cupons</p>';

    // Implementação futura
}

// =====================================================
// CONFIGURAÇÕES
// =====================================================

async function loadSettings() {
    // Implementação futura
}

// =====================================================
// HELPERS
// =====================================================

function getCategoryName(slug) {
    const categories = {
        'oleos': 'Óleos Essenciais',
        'essencias': 'Essências Florais',
        'difusores': 'Difusores',
        'kits': 'Kits Especiais'
    };
    return categories[slug] || slug;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 350px;
        font-weight: 500;
    `;

    const colors = {
        success: { bg: '#d4edda', color: '#155724', border: '#c3e6cb' },
        error: { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' },
        warning: { bg: '#fff3cd', color: '#856404', border: '#ffeaa7' },
        info: { bg: '#d1ecf1', color: '#0c5460', border: '#bee5eb' }
    };

    const style = colors[type] || colors.info;
    notification.style.backgroundColor = style.bg;
    notification.style.color = style.color;
    notification.style.border = `2px solid ${style.border}`;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Fechar modal clicando fora
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    });
};
