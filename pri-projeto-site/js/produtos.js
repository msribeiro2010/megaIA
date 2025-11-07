// Sistema de Carrinho de Compras

class ShoppingCart {
    constructor() {
        this.items = [];
        this.loadCart();
        this.initEventListeners();
        this.updateCartUI();
    }

    // Carregar carrinho do localStorage
    loadCart() {
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
        }
    }

    // Salvar carrinho no localStorage
    saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(this.items));
    }

    // Adicionar item ao carrinho
    addItem(productId, name, price) {
        const existingItem = this.items.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: productId,
                name: name,
                price: price,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartUI();
        this.showNotification(`${name} adicionado ao carrinho!`);
    }

    // Remover item do carrinho
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
    }

    // Atualizar quantidade
    updateQuantity(productId, change) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
                this.updateCartUI();
            }
        }
    }

    // Calcular total
    getTotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    // Atualizar interface do carrinho
    updateCartUI() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const cartCount = document.getElementById('cartCount');

        // Verificar se os elementos existem antes de atualizar
        if (!cartItems || !cartTotal || !cartCount) {
            console.warn('⚠️ Elementos do carrinho não encontrados no DOM');
            return;
        }

        // Atualizar contador
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        // Atualizar total
        cartTotal.textContent = `€${this.getTotal().toFixed(2)}`;

        // Atualizar lista de items
        if (this.items.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Seu carrinho está vazio</p>';
        } else {
            cartItems.innerHTML = this.items.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image"></div>
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">€${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', 1)">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" onclick="cart.removeItem('${item.id}')">×</button>
                </div>
            `).join('');
        }
    }

    // Mostrar notificação
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            background-color: #4CAF50;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // Inicializar event listeners
    initEventListeners() {
        // Botões adicionar ao carrinho
        // Nota: Os event listeners serão adicionados pelo produtos-supabase.js
        // quando os produtos forem carregados do banco de dados

        // Abrir/fechar carrinho
        const cartFloatBtn = document.getElementById('cartFloatBtn');
        const cartSidebar = document.getElementById('cartSidebar');
        const closeCart = document.getElementById('closeCart');

        if (cartFloatBtn) {
            cartFloatBtn.addEventListener('click', () => {
                cartSidebar.classList.add('open');
            });
        }

        if (closeCart) {
            closeCart.addEventListener('click', () => {
                cartSidebar.classList.remove('open');
            });
        }

        // Fechar carrinho clicando fora
        document.addEventListener('click', (e) => {
            if (cartSidebar && cartFloatBtn) {
                if (!cartSidebar.contains(e.target) && !cartFloatBtn.contains(e.target)) {
                    cartSidebar.classList.remove('open');
                }
            }
        });

        // Botão checkout
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.items.length === 0) {
                    alert('Seu carrinho está vazio!');
                    return;
                }
                this.checkout();
            });
        }
    }

    // Finalizar compra
    checkout() {
        if (this.items.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }

        // Redirecionar para página de pagamento
        window.location.href = 'pagamento.html';
    }
}

// Sistema de Filtros de Produtos
class ProductFilter {
    constructor() {
        this.initFilters();
    }

    initFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const products = document.querySelectorAll('.product-card');

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remover active de todos os botões
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;

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

// Animações CSS adicionais
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);

// Inicializar sistemas
const cart = new ShoppingCart();
const productFilter = new ProductFilter();

// Dados dos produtos (pode ser movido para um arquivo JSON separado)
const productsData = {
    'oleo-lavanda': {
        name: 'Óleo Essencial de Lavanda',
        price: 18.50,
        description: 'Pureza 100%. Ideal para relaxamento e qualidade do sono.',
        category: 'oleos'
    },
    'oleo-hortela': {
        name: 'Óleo Essencial de Hortelã-Pimenta',
        price: 15.90,
        description: 'Energizante e refrescante. Ajuda na concentração.',
        category: 'oleos'
    },
    'oleo-eucalipto': {
        name: 'Óleo Essencial de Eucalipto',
        price: 16.50,
        description: 'Purificador e revigorante. Auxilia na respiração.',
        category: 'oleos'
    },
    'essencia-rescue': {
        name: 'Essência Floral Rescue',
        price: 12.90,
        description: 'Fórmula de emergência para momentos de estresse.',
        category: 'essencias'
    },
    'essencia-menopausa': {
        name: 'Mix Essencial Menopausa',
        price: 24.90,
        description: 'Combinação especial para sintomas da menopausa.',
        category: 'essencias'
    },
    'difusor-ceramica': {
        name: 'Difusor Cerâmico',
        price: 35.00,
        description: 'Design elegante com iluminação LED.',
        category: 'difusores'
    },
    'difusor-ultrassonico': {
        name: 'Difusor Ultrassônico',
        price: 45.00,
        description: 'Tecnologia silenciosa com 7 cores de LED.',
        category: 'difusores'
    },
    'kit-relaxamento': {
        name: 'Kit Relaxamento Completo',
        price: 69.90,
        description: '3 óleos essenciais + difusor + guia de uso.',
        category: 'kits'
    },
    'kit-menopausa': {
        name: 'Kit Especial Menopausa',
        price: 79.90,
        description: 'Seleção exclusiva para equilíbrio hormonal.',
        category: 'kits'
    }
};
