# ⚡ Painel Admin - Início Rápido

Guia resumido para começar a usar o painel administrativo em minutos.

## 🚀 Início Rápido (5 minutos)

### 1️⃣ Configurar Supabase

```bash
1. Crie conta em: https://supabase.com
2. Crie novo projeto
3. Execute o SQL: copie/cole supabase-schema.sql no SQL Editor
4. Crie bucket "produtos" (público) no Storage
5. Crie usuário admin no Authentication
6. Copie URL e anon key do projeto
7. Cole em: js/supabase-config.js
```

**📖 Guia detalhado**: `CONFIGURACAO-SUPABASE.md`

### 2️⃣ Acessar o Painel

1. Abra: `admin-login.html`
2. Login com email/senha do usuário admin criado
3. ✅ Pronto!

---

## 📦 O que você pode fazer no Admin

### 🛒 Gerenciar Produtos

- ✅ Adicionar novos produtos
- ✅ Editar produtos existentes
- ✅ Fazer upload de imagens
- ✅ Controlar estoque
- ✅ Ativar/desativar produtos
- ✅ Adicionar badges (Bestseller, Novo, Oferta)
- ✅ Definir preços e preços promocionais

### 📊 Dashboard

- Ver total de produtos
- Estatísticas de vendas (em breve)
- Produtos com baixo estoque
- Ações rápidas

### 🎫 Cupons (em breve)

- Criar códigos promocionais
- Descontos percentuais ou fixos
- Frete grátis
- Controle de validade

### ⚙️ Configurações

- Informações de contato
- Valores de frete
- Configurações gerais do site

---

## 🎯 Como Adicionar um Produto

1. Acesse o **Painel Admin**
2. Clique em **"Produtos"** no menu lateral
3. Clique em **"➕ Novo Produto"**
4. Preencha:
   - Nome do produto
   - Descrição
   - Categoria
   - Preço
   - Estoque
   - Volume (opcional)
   - Badge (opcional)
5. Faça upload da **imagem**
6. Clique em **"Salvar Produto"**
7. ✅ Produto aparece automaticamente na loja!

---

## 📸 Como Fazer Upload de Imagens

### No formulário de produto:

1. Clique em **"Escolher arquivo"**
2. Selecione uma imagem (JPG, PNG, WebP)
3. Veja o preview da imagem
4. Salve o produto
5. ✅ Imagem é automaticamente enviada para o Supabase!

### Recomendações:

- **Tamanho**: 600x600px (quadrado)
- **Formato**: JPG ou PNG
- **Peso**: Máximo 2MB
- **Qualidade**: Alta resolução, boa iluminação

---

## 🔐 Segurança

### O que está protegido:

- ✅ Login obrigatório para acessar admin
- ✅ Row Level Security (RLS) ativo
- ✅ Apenas usuários autenticados podem modificar
- ✅ Loja pública (só leitura)
- ✅ Storage público para imagens

### Boas práticas:

- Use senha forte para o admin
- Não compartilhe credenciais
- Ative 2FA na conta Supabase
- Faça backups regulares

---

## 🐛 Problemas Comuns

### Não consigo fazer login

**Solução**: Verifique se:
- Configurou as credenciais em `supabase-config.js`
- Criou o usuário admin no Supabase
- Marcou "Auto Confirm User"

### Produtos não aparecem

**Solução**:
- Abra Console do navegador (F12)
- Veja se há erros
- Verifique se executou o `supabase-schema.sql`

### Erro ao fazer upload

**Solução**:
- Verifique se criou o bucket "produtos"
- Verifique se está marcado como PUBLIC
- Verifique as policies do storage

### CORS Error

**Solução**:
- Use servidor local: `python3 -m http.server 8000`
- Não abra arquivos diretamente (`file://`)

---

## 📁 Arquivos Importantes

```
pri-projeto-site/
├── admin-login.html          # Página de login
├── admin-dashboard.html      # Painel administrativo
├── supabase-schema.sql       # SQL para criar banco
├── css/admin.css             # Estilos do admin
├── js/
│   ├── supabase-config.js    # ⚠️ CONFIGURE AQUI
│   ├── admin.js              # Lógica do admin
│   └── produtos-supabase.js  # Integração loja
└── CONFIGURACAO-SUPABASE.md  # Guia detalhado
```

---

## 🎨 Estrutura do Banco de Dados

### Tabelas criadas:

1. **produtos** - Catálogo de produtos
2. **categorias** - Categorias dos produtos
3. **produto_imagens** - Múltiplas imagens por produto
4. **pedidos** - Pedidos realizados
5. **pedido_itens** - Itens de cada pedido
6. **codigos_promocionais** - Cupons de desconto
7. **configuracoes** - Configurações do site

### Dados iniciais:

- ✅ 4 categorias
- ✅ 9 produtos
- ✅ 4 códigos promocionais
- ✅ Configurações padrão

---

## 🌐 URLs do Sistema

### Frontend (Loja):
- **Home**: `index.html`
- **Produtos**: `produtos.html`
- **Checkout**: `pagamento.html`

### Admin:
- **Login**: `admin-login.html`
- **Dashboard**: `admin-dashboard.html`

---

## 💡 Dicas Úteis

### Performance:

- Otimize imagens antes do upload
- Use WebP quando possível
- Mantenha produtos inativos em vez de deletar

### Organização:

- Use badges para destacar produtos
- Mantenha estoque atualizado
- Use categorias consistentes

### Marketing:

- Crie cupons promocionais
- Destaque bestsellers
- Marque novidades
- Use ofertas limitadas

---

## 🚀 Próximos Passos

1. **Configure o Supabase** (5 min)
2. **Faça login no admin** (1 min)
3. **Adicione suas imagens** (10 min)
4. **Edite os produtos** (15 min)
5. **Teste a loja** (5 min)
6. **Configure informações** (5 min)

**Total: ~40 minutos para ter tudo funcionando!**

---

## 📞 Precisa de Ajuda?

1. Leia: `CONFIGURACAO-SUPABASE.md` (guia detalhado)
2. Veja: `PROXIMOS-PASSOS.md` (roadmap completo)
3. Confira: Troubleshooting acima

---

## ✅ Checklist de Início

- [ ] Conta Supabase criada
- [ ] Projeto criado
- [ ] SQL executado
- [ ] Storage configurado
- [ ] Usuário admin criado
- [ ] Credenciais configuradas
- [ ] Login admin funciona
- [ ] Primeiro produto adicionado
- [ ] Imagem enviada com sucesso
- [ ] Produto aparece na loja

---

**Tudo pronto! Comece a gerenciar seus produtos! 🎉**
