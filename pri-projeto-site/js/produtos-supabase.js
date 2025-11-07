// =====================================================
// INTEGRAÇÃO PRODUTOS COM SUPABASE
// =====================================================

// Substituir dados estáticos por dados do Supabase
let produtosFromSupabase = [];
let categoriasFromSupabase = [];

// Carregar produtos do Supabase ao iniciar a página
window.addEventListener('DOMContentLoaded', async () => {
    await loadProdutosFromSupabase();
});

// =====================================================
// CARREGAR PRODUTOS DO SUPABASE
// =====================================================

async function loadProdutosFromSupabase() {
    try {
        // Carregar produtos
        const { data: produtos, error: produtosError } = await SupabaseHelper.getProdutos();

        if (produtosError) {
            console.error('Erro ao carregar produtos:', produtosError);
            // Manter produtos estáticos como fallback
            return;
        }

        produtosFromSupabase = produtos || [];

        // Carregar categorias
        const { data: categorias, error: categoriasError } = await SupabaseHelper.getCategorias();

        if (!categoriasError) {
            categoriasFromSupabase = categorias || [];
        }

        // Renderizar produtos na página
        renderProdutosFromSupabase();

        // Atualizar dados do carrinho se necessário
        updateCartWithSupabaseData();

        console.log('✅ Produtos carregados do Supabase:', produtosFromSupabase.length);

    } catch (error) {
        console.error('Erro ao carregar dados do Supabase:', error);
    }
}

// =====================================================
// RENDERIZAR PRODUTOS
// =====================================================

function renderProdutosFromSupabase() {
    const productsGrid = document.querySelector('.products-grid');

    if (!productsGrid || produtosFromSupabase.length === 0) {
        return;
    }

    // Limpar produtos existentes
    productsGrid.innerHTML = '';

    // Renderizar cada produto
    produtosFromSupabase.forEach(produto => {
        const productCard = createProductCard(produto);
        productsGrid.appendChild(productCard);
    });

    // Re-inicializar animações e eventos
    initializeProductCards();
}

function createProductCard(produto) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-category', produto.categoria);

    // Badge
    let badgeHTML = '';
    if (produto.badge) {
        badgeHTML = `<div class="product-badge">${produto.badge}</div>`;
    }

    // Preço antigo
    let oldPriceHTML = '';
    if (produto.preco_antigo && produto.preco_antigo > produto.preco) {
        oldPriceHTML = `<span class="product-price-old">€${produto.preco_antigo.toFixed(2)}</span>`;
    }

    // Imagem
    const imagemUrl = produto.imagem_url || 'images/produtos/placeholder.jpg';

    card.innerHTML = `
        <div class="product-image">
            <img src="${imagemUrl}" alt="${produto.nome}" onerror="this.src='https://via.placeholder.com/600x600/8B6F47/FFFFFF?text=${encodeURIComponent(produto.nome)}'">
            ${badgeHTML}
        </div>
        <div class="product-info">
            <h3>${produto.nome}</h3>
            <p class="product-description">${produto.descricao || ''}</p>
            <div class="product-footer">
                ${oldPriceHTML}
                <span class="product-price">€${produto.preco.toFixed(2)}</span>
                <button class="btn-add-cart" data-product-id="${produto.id}">Adicionar</button>
            </div>
        </div>
    `;

    return card;
}

function initializeProductCards() {
    // Animações de entrada
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.product-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Re-adicionar event listeners aos botões
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const productId = e.target.dataset.productId;
            console.log('🛒 Tentando adicionar produto ao carrinho:', productId);
            await addToCartFromSupabase(productId);
        });
    });
}

// =====================================================
// ADICIONAR AO CARRINHO
// =====================================================

async function addToCartFromSupabase(productId) {
    console.log('🔍 Procurando produto:', productId);
    console.log('📦 Produtos disponíveis:', produtosFromSupabase.length);

    const produto = produtosFromSupabase.find(p => p.id === productId);

    if (!produto) {
        console.error('❌ Produto não encontrado:', productId);
        console.log('IDs disponíveis:', produtosFromSupabase.map(p => p.id));
        alert('Produto não encontrado!');
        return;
    }

    console.log('✅ Produto encontrado:', produto);

    // Verificar estoque
    if (produto.estoque <= 0) {
        console.warn('⚠️ Produto fora de estoque:', produto.nome);
        alert('Produto fora de estoque!');
        return;
    }

    // Usar o sistema de carrinho existente
    if (window.cart) {
        console.log('🛒 Adicionando ao carrinho:', produto.nome);
        cart.addItem(
            productId,
            produto.nome,
            produto.preco
        );
    } else {
        console.error('❌ Sistema de carrinho não está disponível!');
        alert('Erro ao adicionar ao carrinho. Por favor, recarregue a página.');
    }
}

// =====================================================
// ATUALIZAR CARRINHO COM DADOS DO SUPABASE
// =====================================================

function updateCartWithSupabaseData() {
    // Se o carrinho já tem itens, validar com dados do Supabase
    if (window.cart && cart.items.length > 0) {
        cart.items.forEach(item => {
            const produtoAtualizado = produtosFromSupabase.find(p => p.id === item.id);

            if (produtoAtualizado) {
                // Atualizar preço se mudou
                if (item.price !== produtoAtualizado.preco) {
                    item.price = produtoAtualizado.preco;
                    console.log(`Preço atualizado: ${item.name} - €${produtoAtualizado.preco}`);
                }

                // Verificar estoque
                if (item.quantity > produtoAtualizado.estoque) {
                    item.quantity = produtoAtualizado.estoque;
                    console.warn(`Quantidade ajustada: ${item.name} - ${produtoAtualizado.estoque}`);
                }
            }
        });

        // Salvar alterações
        cart.saveCart();
        cart.updateCartUI();
    }
}

// =====================================================
// FILTROS COM SUPABASE
// =====================================================

// Sobrescrever filtro para usar categorias do Supabase
if (categoriasFromSupabase.length > 0) {
    const filterButtons = document.querySelector('.filter-buttons');

    if (filterButtons) {
        filterButtons.innerHTML = `
            <button class="filter-btn active" data-filter="todos">Todos</button>
            ${categoriasFromSupabase.map(cat => `
                <button class="filter-btn" data-filter="${cat.slug}">${cat.nome}</button>
            `).join('')}
        `;

        // Re-adicionar event listeners
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;
                const products = document.querySelectorAll('.product-card');

                products.forEach(product => {
                    if (filter === 'todos' || product.dataset.category === filter) {
                        product.style.display = 'block';
                        product.style.animation = 'fadeIn 0.5s ease';
                    } else {
                        product.style.display = 'none';
                    }
                });
            });
        });
    }
}

// =====================================================
// BUSCAR PRODUTOS (SEARCH)
// =====================================================

function searchProducts(query) {
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) {
        // Mostrar todos os produtos
        document.querySelectorAll('.product-card').forEach(card => {
            card.style.display = 'block';
        });
        return;
    }

    document.querySelectorAll('.product-card').forEach(card => {
        const productName = card.querySelector('h3').textContent.toLowerCase();
        const productDescription = card.querySelector('.product-description').textContent.toLowerCase();

        if (productName.includes(normalizedQuery) || productDescription.includes(normalizedQuery)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Adicionar barra de busca (opcional)
function addSearchBar() {
    const filtersBar = document.querySelector('.products-filters .container');

    if (filtersBar && !document.getElementById('productSearch')) {
        const searchHTML = `
            <div style="margin-top: 1rem;">
                <input
                    type="text"
                    id="productSearch"
                    placeholder="🔍 Buscar produtos..."
                    style="
                        width: 100%;
                        max-width: 400px;
                        padding: 10px 15px;
                        border: 2px solid var(--border-color);
                        border-radius: 25px;
                        font-family: 'Montserrat', sans-serif;
                        font-size: 1rem;
                    "
                >
            </div>
        `;

        filtersBar.insertAdjacentHTML('beforeend', searchHTML);

        document.getElementById('productSearch').addEventListener('input', (e) => {
            searchProducts(e.target.value);
        });
    }
}

// Adicionar busca após carregar produtos
setTimeout(() => {
    if (produtosFromSupabase.length > 0) {
        addSearchBar();
    }
}, 500);

// =====================================================
// VALIDAR CÓDIGOS PROMOCIONAIS COM SUPABASE
// =====================================================

async function validarCodigoPromocional(codigo) {
    const { data, error } = await SupabaseHelper.getCodigoPromocional(codigo);

    if (error) {
        return { valido: false, mensagem: error };
    }

    if (!data) {
        return { valido: false, mensagem: 'Cupom inválido' };
    }

    return {
        valido: true,
        tipo: data.tipo,
        valor: data.valor,
        descricao: data.descricao
    };
}

// Exportar funções para uso global
window.loadProdutosFromSupabase = loadProdutosFromSupabase;
window.validarCodigoPromocional = validarCodigoPromocional;
window.searchProducts = searchProducts;
