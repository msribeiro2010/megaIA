# 🎉 Bem-vinda ao seu novo site!

## 👋 Olá!

Seu site profissional está pronto! Este projeto foi criado especialmente para o negócio de terapias holísticas da Priscilla Santalena.

## 📁 Estrutura do Projeto

```
pri-projeto-site/
├── 📄 index.html              # Página principal
├── 📄 produtos.html           # Loja de produtos
├── 📄 pagamento.html          # Página de checkout
│
├── 📁 css/
│   └── style.css              # Todos os estilos do site
│
├── 📁 js/
│   ├── main.js                # Scripts gerais
│   ├── produtos.js            # Sistema de carrinho
│   ├── pagamento.js           # Sistema de checkout
│   └── produtos-data.json     # Dados dos produtos
│
├── 📁 images/                 # ⚠️ ADICIONE SUAS IMAGENS AQUI
│   ├── priscilla.jpg          # Sua foto de perfil
│   └── produtos/              # Fotos dos produtos
│
├── 📁 assets/                 # Recursos adicionais
│
├── 📖 README.md               # Documentação completa
├── 📖 INSTRUCOES-IMAGENS.md   # Guia para adicionar imagens
├── 📖 PROXIMOS-PASSOS.md      # Próximas etapas
└── 📖 COMECE-AQUI.md          # Este arquivo
```

## 🚀 Como Começar?

### 1️⃣ Visualizar o Site

**Opção A: Abrir diretamente**
- Navegue até a pasta `pri-projeto-site`
- Dê um duplo clique em `index.html`

**Opção B: Usar servidor local** (recomendado)
```bash
cd pri-projeto-site
python3 -m http.server 8000
```
Depois abra: `http://localhost:8000`

### 2️⃣ Adicionar suas Imagens

📸 **IMPORTANTE**: O site precisa das suas imagens!

1. Leia o arquivo: `INSTRUCOES-IMAGENS.md`
2. Prepare 10 imagens:
   - 1 foto sua (priscilla.jpg)
   - 9 fotos de produtos
3. Coloque em `images/` e `images/produtos/`

### 3️⃣ Personalizar Informações

Edite os seguintes arquivos para adicionar suas informações reais:

#### `index.html` - Atualizar:
- ✏️ Telefone (linha ~83)
- ✏️ Email (linha ~87)
- ✏️ Textos da seção "Sobre Mim"
- ✏️ Descrições dos serviços
- ✏️ Depoimentos (opcional)

#### `produtos.html` - Verificar:
- ✏️ Descrições dos produtos
- ✏️ Preços
- ✏️ Informações de contato no footer

#### `js/produtos-data.json` - Atualizar:
- ✏️ Dados completos dos produtos
- ✏️ Preços e estoques
- ✏️ WhatsApp e email

## ✨ Funcionalidades Disponíveis

### ✅ Já Funcionando:

1. **Página Principal**
   - Hero section com chamadas para ação
   - Seção "Sobre Mim"
   - Serviços oferecidos
   - Depoimentos
   - Formulário de contato
   - Design responsivo (mobile-friendly)

2. **Loja de Produtos**
   - 9 produtos cadastrados
   - Filtros por categoria
   - Carrinho de compras funcional
   - Persistência de dados (localStorage)
   - Contador de itens
   - Notificações

3. **Sistema de Pagamento**
   - Formulário completo de checkout
   - Opções de envio
   - Múltiplos métodos de pagamento
   - Validação de dados
   - Cálculo automático de totais
   - Sistema de cupons promocionais

### 🔧 Precisa Configurar:

1. **Email** (formulário de contato)
   - Integrar com EmailJS ou similar
   - Ver: `PROXIMOS-PASSOS.md`

2. **Pagamentos** (processar compras)
   - Integrar Mollie ou Stripe
   - Configurar webhook
   - Ver: `PROXIMOS-PASSOS.md`

3. **Hospedagem** (colocar online)
   - Escolher provedor (Netlify, Vercel, etc.)
   - Registrar domínio
   - Configurar SSL
   - Ver: `PROXIMOS-PASSOS.md`

## 📚 Documentação

Leia estes arquivos na ordem:

1. **README.md** - Visão geral completa do projeto
2. **INSTRUCOES-IMAGENS.md** - Como adicionar suas fotos
3. **PROXIMOS-PASSOS.md** - Roteiro para deixar tudo funcionando

## 🎨 Personalização

### Cores do Site:

As cores foram escolhidas para transmitir naturalidade e confiança:

- **Primária**: `#8B6F47` (marrom terroso)
- **Secundária**: `#A88F6C` (marrom claro)
- **Destaque**: `#D4AF37` (dourado)
- **Fundo**: `#F8F6F3` (bege claro)

Para mudar, edite as variáveis em `css/style.css` (linhas 2-11).

### Fontes:

Usando **Montserrat** do Google Fonts (elegante e profissional).

## 🛠️ Editar o Site

### Recomendações de Editores:

1. **Visual Studio Code** (Grátis, recomendado)
   - Download: https://code.visualstudio.com/
   - Extensões úteis:
     - Live Server
     - Prettier
     - HTML CSS Support

2. **Sublime Text** (Alternativa)
   - Download: https://www.sublimetext.com/

3. **Notepad++** (Windows)
   - Download: https://notepad-plus-plus.org/

### Dica: Live Preview

Com VS Code + Live Server:
1. Abra a pasta do projeto
2. Clique direito em `index.html`
3. Selecione "Open with Live Server"
4. Site abre automaticamente e atualiza ao salvar!

## 🆘 Precisa de Ajuda?

### Problemas Comuns:

**❓ Imagens não aparecem**
- Verifique os nomes dos arquivos (exatos!)
- Certifique-se que estão nas pastas corretas
- Veja: `INSTRUCOES-IMAGENS.md`

**❓ Site não abre no navegador**
- Use servidor local (não abra diretamente)
- Veja instruções em "Como Começar"

**❓ Carrinho não funciona**
- Limpe o cache do navegador
- Use servidor local (não arquivo:// direto)

**❓ Formulário não envia**
- Normal! Precisa configurar backend
- Veja: `PROXIMOS-PASSOS.md` → Sistema de Email

### Recursos de Aprendizado:

- **HTML**: https://www.w3schools.com/html/
- **CSS**: https://www.w3schools.com/css/
- **JavaScript**: https://javascript.info/

## 📱 Teste em Dispositivos

Não esqueça de testar em:

- ✅ Desktop (Chrome, Firefox, Safari)
- ✅ Tablet (iPad, Android tablets)
- ✅ Celular (iPhone, Android phones)

**Dica**: Use as Ferramentas de Desenvolvedor do Chrome (F12) → Toggle Device Toolbar.

## 🎯 Próximos Passos Rápidos

**Semana 1:**
- [ ] Adicionar todas as imagens
- [ ] Atualizar textos e informações
- [ ] Testar em diferentes dispositivos

**Semana 2:**
- [ ] Configurar sistema de email
- [ ] Configurar pagamentos
- [ ] Adicionar WhatsApp Business

**Semana 3:**
- [ ] Escolher e configurar hospedagem
- [ ] Comprar domínio
- [ ] Fazer testes finais
- [ ] **LANÇAR!** 🚀

## 💡 Dicas Importantes

1. **Backup Regular**: Sempre faça cópias de segurança
2. **Teste Tudo**: Antes de colocar online, teste cada funcionalidade
3. **Mobile First**: Maioria dos acessos será mobile
4. **Imagens Leves**: Otimize para carregar rápido
5. **Textos Claros**: Seja direta e objetiva

## 🌟 Sucesso!

Você tem em mãos um site profissional e funcional!

Com dedicação e seguindo os próximos passos, em poucas semanas você terá uma presença online completa para seu negócio de terapias holísticas.

**Boa sorte e muito sucesso! 🎉**

---

**Dúvidas ou problemas?**
Documente suas perguntas e busque ajuda em:
- Stack Overflow
- Comunidades de desenvolvimento web
- Fóruns de HTML/CSS/JavaScript

**Este é apenas o começo! 🚀**
