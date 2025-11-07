// Sistema de Pagamento

class CheckoutSystem {
    constructor() {
        this.cart = this.loadCart();
        this.selectedShipping = 5.90;
        this.selectedPayment = 'cartao';
        this.discountCode = null;
        this.discountAmount = 0;

        this.initializeCheckout();
        this.setupEventListeners();
        this.updateOrderSummary();
    }

    loadCart() {
        const savedCart = localStorage.getItem('shoppingCart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    initializeCheckout() {
        // Redirecionar se carrinho vazio
        if (this.cart.length === 0) {
            alert('Seu carrinho está vazio!');
            window.location.href = 'produtos.html';
            return;
        }

        this.renderOrderItems();
    }

    renderOrderItems() {
        const orderItems = document.getElementById('orderItems');
        orderItems.innerHTML = this.cart.map(item => `
            <div class="summary-item" style="flex-direction: column; align-items: flex-start; padding: 1rem 0;">
                <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 0.5rem;">
                    <strong>${item.name}</strong>
                    <span>€${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <div style="color: var(--text-light); font-size: 0.9rem;">
                    Quantidade: ${item.quantity} × €${item.price.toFixed(2)}
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Métodos de envio
        document.querySelectorAll('.shipping-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.shipping-option').forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                this.selectedShipping = parseFloat(option.dataset.price);
                this.updateOrderSummary();
            });
        });

        // Métodos de pagamento
        document.querySelectorAll('.payment-method').forEach(method => {
            method.addEventListener('click', (e) => {
                document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
                method.classList.add('active');
                this.selectedPayment = method.dataset.method;
                this.togglePaymentFields();
            });
        });

        // Aplicar código promocional
        document.getElementById('applyPromo').addEventListener('click', () => {
            this.applyPromoCode();
        });

        // Finalizar pedido
        document.getElementById('finalizarPedido').addEventListener('click', () => {
            this.processOrder();
        });

        // Auto-preencher endereço via CEP (simulado)
        document.getElementById('cep').addEventListener('blur', (e) => {
            this.fetchAddress(e.target.value);
        });
    }

    togglePaymentFields() {
        const cartaoFields = document.getElementById('cartaoFields');
        if (this.selectedPayment === 'cartao') {
            cartaoFields.style.display = 'block';
        } else {
            cartaoFields.style.display = 'none';
        }
    }

    getSubtotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getTotal() {
        return this.getSubtotal() + this.selectedShipping - this.discountAmount;
    }

    updateOrderSummary() {
        const subtotal = this.getSubtotal();
        const total = this.getTotal();

        document.getElementById('subtotal').textContent = `€${subtotal.toFixed(2)}`;
        document.getElementById('shipping').textContent = this.selectedShipping === 0 ? 'Grátis' : `€${this.selectedShipping.toFixed(2)}`;
        document.getElementById('total').textContent = `€${total.toFixed(2)}`;

        if (this.discountAmount > 0) {
            document.getElementById('discountRow').style.display = 'flex';
            document.getElementById('discount').textContent = `-€${this.discountAmount.toFixed(2)}`;
        }
    }

    applyPromoCode() {
        const code = document.getElementById('promoCode').value.toUpperCase().trim();

        // Códigos promocionais de exemplo
        const promoCodes = {
            'PRIMEIRACOMPRA': { type: 'percentage', value: 10, description: '10% de desconto' },
            'BEMVINDA': { type: 'fixed', value: 5, description: '€5 de desconto' },
            'MENOPAUSA20': { type: 'percentage', value: 20, description: '20% de desconto' },
            'FRETEGRATIS': { type: 'shipping', value: 0, description: 'Frete grátis' }
        };

        if (promoCodes[code]) {
            const promo = promoCodes[code];

            if (promo.type === 'percentage') {
                this.discountAmount = (this.getSubtotal() * promo.value) / 100;
            } else if (promo.type === 'fixed') {
                this.discountAmount = promo.value;
            } else if (promo.type === 'shipping') {
                this.selectedShipping = 0;
                // Atualizar UI do frete
                document.querySelectorAll('.shipping-option').forEach(o => o.classList.remove('active'));
            }

            this.discountCode = code;
            this.updateOrderSummary();
            this.showNotification(`✓ Cupom aplicado: ${promo.description}`, 'success');
        } else {
            this.showNotification('✗ Código promocional inválido', 'error');
        }
    }

    async fetchAddress(cep) {
        // Simulação de busca de endereço
        // Em produção, use uma API real como ViaCEP ou PostNL
        if (cep.length >= 6) {
            // Simular delay de API
            setTimeout(() => {
                document.getElementById('endereco').value = 'Rua Exemplo, 123';
                document.getElementById('cidade').value = 'Lichtenvoorde';
                document.getElementById('estado').value = 'Gelderland';
            }, 500);
        }
    }

    validateForm() {
        const requiredFields = [
            'nome', 'email', 'telefone',
            'cep', 'numero', 'endereco', 'cidade', 'estado'
        ];

        for (const field of requiredFields) {
            const input = document.getElementById(field);
            if (!input || !input.value.trim()) {
                this.showNotification(`Por favor, preencha o campo: ${input.previousElementSibling.textContent}`, 'error');
                input.focus();
                return false;
            }
        }

        // Validar campos do cartão se necessário
        if (this.selectedPayment === 'cartao') {
            const cardFields = ['numeroCartao', 'validade', 'cvv', 'nomeCartao'];
            for (const field of cardFields) {
                const input = document.getElementById(field);
                if (!input || !input.value.trim()) {
                    this.showNotification('Por favor, complete os dados do cartão', 'error');
                    input.focus();
                    return false;
                }
            }
        }

        // Validar email
        const email = document.getElementById('email').value;
        if (!this.validateEmail(email)) {
            this.showNotification('Por favor, insira um email válido', 'error');
            return false;
        }

        return true;
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    async processOrder() {
        // Validar formulário
        if (!this.validateForm()) {
            return;
        }

        // Coletar dados do pedido
        const orderData = {
            customer: {
                nome: document.getElementById('nome').value,
                email: document.getElementById('email').value,
                telefone: document.getElementById('telefone').value,
                cpf: document.getElementById('cpf').value
            },
            address: {
                cep: document.getElementById('cep').value,
                endereco: document.getElementById('endereco').value,
                numero: document.getElementById('numero').value,
                complemento: document.getElementById('complemento').value,
                cidade: document.getElementById('cidade').value,
                estado: document.getElementById('estado').value
            },
            items: this.cart,
            shipping: {
                method: document.querySelector('.shipping-option.active h4').textContent,
                price: this.selectedShipping
            },
            payment: {
                method: this.selectedPayment
            },
            totals: {
                subtotal: this.getSubtotal(),
                shipping: this.selectedShipping,
                discount: this.discountAmount,
                total: this.getTotal()
            },
            promoCode: this.discountCode,
            timestamp: new Date().toISOString()
        };

        // Simular processamento
        this.showLoadingModal();

        // Em produção, enviar para API de pagamento
        setTimeout(() => {
            this.hideLoadingModal();
            this.showSuccessPage(orderData);
        }, 2000);

        // Log para desenvolvimento
        console.log('Pedido processado:', orderData);
    }

    showLoadingModal() {
        const modal = document.createElement('div');
        modal.id = 'loadingModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        modal.innerHTML = `
            <div style="background: white; padding: 3rem; border-radius: 10px; text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⏳</div>
                <h3 style="color: var(--primary-color); margin-bottom: 0.5rem;">Processando seu pedido...</h3>
                <p style="color: var(--text-light);">Aguarde um momento</p>
            </div>
        `;
        document.body.appendChild(modal);
    }

    hideLoadingModal() {
        const modal = document.getElementById('loadingModal');
        if (modal) modal.remove();
    }

    showSuccessPage(orderData) {
        // Limpar carrinho
        localStorage.removeItem('shoppingCart');

        // Criar página de sucesso
        const successPage = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <title>Pedido Confirmado!</title>
                <style>
                    body {
                        font-family: 'Montserrat', sans-serif;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        margin: 0;
                        background: linear-gradient(135deg, #8B6F47, #A88F6C);
                    }
                    .success-container {
                        background: white;
                        padding: 3rem;
                        border-radius: 15px;
                        text-align: center;
                        max-width: 600px;
                        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                    }
                    .success-icon {
                        font-size: 5rem;
                        margin-bottom: 1rem;
                    }
                    h1 {
                        color: #8B6F47;
                        margin-bottom: 1rem;
                    }
                    p {
                        color: #666;
                        line-height: 1.6;
                        margin-bottom: 2rem;
                    }
                    .btn {
                        display: inline-block;
                        padding: 12px 30px;
                        background: #D4AF37;
                        color: #2C2C2C;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: 500;
                        margin: 0.5rem;
                    }
                    .order-number {
                        background: #F8F6F3;
                        padding: 1rem;
                        border-radius: 8px;
                        margin: 2rem 0;
                    }
                </style>
            </head>
            <body>
                <div class="success-container">
                    <div class="success-icon">✓</div>
                    <h1>Pedido Confirmado!</h1>
                    <p>Obrigada por sua compra! Seu pedido foi recebido e está sendo processado.</p>
                    <div class="order-number">
                        <strong>Número do Pedido:</strong> #${Math.floor(Math.random() * 100000)}
                    </div>
                    <p>Enviamos um email de confirmação para <strong>${orderData.customer.email}</strong> com os detalhes do seu pedido.</p>
                    <div>
                        <a href="index.html" class="btn">Voltar ao Início</a>
                        <a href="produtos.html" class="btn">Continuar Comprando</a>
                    </div>
                </div>
            </body>
            </html>
        `;

        document.open();
        document.write(successPage);
        document.close();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'checkout-notification';
        notification.textContent = message;

        const colors = {
            success: '#4CAF50',
            error: '#e74c3c',
            info: '#3498db'
        };

        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            background-color: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 3000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Inicializar sistema de checkout
const checkout = new CheckoutSystem();

// Formatação de campos
document.getElementById('telefone')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) {
        value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (value.length > 5) {
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (value.length > 2) {
        value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else {
        value = value.replace(/^(\d*)/, '($1');
    }
    e.target.value = value;
});

document.getElementById('numeroCartao')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    e.target.value = value;
});

document.getElementById('validade')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
});

document.getElementById('cvv')?.addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
});
