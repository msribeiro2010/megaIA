# 🔐 Painel Administrativo - Documentação Completa

Sistema completo de administração integrado com Supabase para gerenciamento de produtos, imagens e pedidos.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Instalação](#instalação)
- [Uso](#uso)
- [API Supabase](#api-supabase)
- [Segurança](#segurança)
- [Troubleshooting](#troubleshooting)

---

## Visão Geral

Sistema administrativo completo com:

- ✅ Login/Logout seguro
- ✅ Dashboard com estatísticas
- ✅ CRUD completo de produtos
- ✅ Upload de imagens para Supabase Storage
- ✅ Controle de estoque
- ✅ Gerenciamento de categorias
- ✅ Integração em tempo real com a loja
- ✅ Design responsivo

---

## Arquitetura

### Frontend

```
admin-login.html         → Página de login
admin-dashboard.html     → Painel principal
css/admin.css           → Estilos do admin
```

### JavaScript

```
js/supabase-config.js    → Configuração e helpers
js/admin.js              → Lógica do painel
js/produtos-supabase.js  → Integração loja
```

### Backend (Supabase)

```
Banco de Dados PostgreSQL
Storage para imagens
Authentication
Row Level Security (RLS)
```

---

## Funcionalidades

### 1. Dashboard

**Estatísticas em Tempo Real:**
- Total de produtos cadastrados
- Total de pedidos realizados
- Receita total acumulada
- Total de clientes únicos

**Alertas:**
- Produtos com estoque baixo (≤5 unidades)
- Produtos inativos
- Ações rápidas

### 2. Gerenciamento de Produtos

**CRUD Completo:**
- ✅ Criar novos produtos
- ✅ Editar produtos existentes
- ✅ Deletar produtos
- ✅ Ativar/Desativar produtos

**Campos do Produto:**
- Nome
- Descrição
- Categoria (dropdown)
- Preço atual
- Preço antigo (opcional)
- Estoque
- Volume (ex: 10ml, 30ml)
- Badge (Bestseller, Novo, Oferta, Popular)
- Imagem
- Status (Ativo/Inativo)

**Validações:**
- Nome obrigatório
- Preço obrigatório (> 0)
- Estoque obrigatório (≥ 0)
- Categoria obrigatória
- Imagem com preview antes de salvar

### 3. Upload de Imagens

**Sistema de Upload:**
- ✅ Upload direto para Supabase Storage
- ✅ Preview da imagem antes de salvar
- ✅ Compressão automática
- ✅ Validação de tipo de arquivo
- ✅ URL pública gerada automaticamente

**Formatos Aceitos:**
- JPG/JPEG
- PNG
- WebP
- GIF

**Limites:**
- Tamanho máximo: 5MB por imagem
- Dimensões recomendadas: 600x600px

### 4. Filtros e Busca

**Na loja pública:**
- ✅ Filtro por categoria
- ✅ Busca por nome
- ✅ Busca por descrição
- ✅ Ordenação (em breve)

### 5. Integração em Tempo Real

**Sincronização Automática:**
- Produtos adicionados aparecem instantaneamente na loja
- Preços atualizados em tempo real
- Estoque sincronizado
- Imagens carregadas do Supabase

---

## Instalação

### Pré-requisitos

- Conta no Supabase (grátis)
- Navegador moderno
- Servidor local (para testes)

### Passo a Passo

1. **Configure o Supabase**
   ```bash
   # Siga o guia: CONFIGURACAO-SUPABASE.md
   ```

2. **Configure as credenciais**
   ```javascript
   // Edite: js/supabase-config.js
   const SUPABASE_CONFIG = {
       url: 'sua_url_aqui',
       anonKey: 'sua_key_aqui'
   };
   ```

3. **Execute o Schema SQL**
   - Copie `supabase-schema.sql`
   - Cole no SQL Editor do Supabase
   - Execute (RUN)

4. **Crie o bucket de storage**
   - Nome: `produtos`
   - Tipo: PUBLIC

5. **Crie usuário admin**
   - Authentication → Users → Add User
   - Email e senha
   - Auto Confirm: ✅

6. **Teste o login**
   - Abra `admin-login.html`
   - Faça login

---

## Uso

### Fazer Login

```javascript
// admin-login.html
Email: seu@email.com
Senha: SuaSenhaForte123
```

### Adicionar Produto

```javascript
// No dashboard → Produtos → Novo Produto

{
  nome: "Óleo de Lavanda",
  descricao: "100% puro...",
  categoria: "oleos",
  preco: 18.50,
  preco_antigo: 22.00,  // opcional
  estoque: 25,
  volume: "10ml",
  badge: "Bestseller",
  imagem: File,
  ativo: true
}
```

### Editar Produto

```javascript
// Clique em "Editar" na linha do produto
// Modifique os campos desejados
// Salve
```

### Upload de Imagem

```javascript
// No formulário de produto
// Selecione arquivo → Preview → Salve

// Resultado:
{
  path: "produtos/1234567890_produto.jpg",
  url: "https://...supabase.co/storage/.../produtos/..."
}
```

### Deletar Produto

```javascript
// Clique em "Deletar" na linha do produto
// Confirme a ação
// ⚠️ Ação irreversível!
```

---

## API Supabase

### Helper Functions

Todas disponíveis via `SupabaseHelper`:

#### Autenticação

```javascript
// Login
await SupabaseHelper.signIn(email, password);

// Logout
await SupabaseHelper.signOut();

// Verificar autenticação
await SupabaseHelper.isAuthenticated();

// Obter usuário atual
await SupabaseHelper.getCurrentUser();
```

#### Produtos

```javascript
// Buscar todos
const { data, error } = await SupabaseHelper.getProdutos();

// Buscar por ID
const { data, error } = await SupabaseHelper.getProdutoById(id);

// Criar
const { data, error } = await SupabaseHelper.createProduto(produto);

// Atualizar
const { data, error } = await SupabaseHelper.updateProduto(id, produto);

// Deletar
const { error } = await SupabaseHelper.deleteProduto(id);
```

#### Upload

```javascript
// Upload de imagem
const { data, error } = await SupabaseHelper.uploadImagem(file, 'produtos');

// Deletar imagem
const { error } = await SupabaseHelper.deleteImagem(path);
```

#### Categorias

```javascript
// Buscar categorias
const { data, error } = await SupabaseHelper.getCategorias();
```

#### Cupons

```javascript
// Validar código promocional
const { data, error } = await SupabaseHelper.getCodigoPromocional(codigo);
```

---

## Segurança

### Row Level Security (RLS)

**Políticas Implementadas:**

#### Produtos
- ✅ **SELECT**: Público (apenas produtos ativos)
- ✅ **INSERT**: Apenas autenticados
- ✅ **UPDATE**: Apenas autenticados
- ✅ **DELETE**: Apenas autenticados

#### Storage (Imagens)
- ✅ **SELECT**: Público (leitura de imagens)
- ✅ **INSERT**: Apenas autenticados
- ✅ **DELETE**: Apenas autenticados

#### Pedidos
- ✅ **SELECT**: Apenas dono do pedido ou admin
- ✅ **INSERT**: Qualquer pessoa (checkout público)
- ✅ **UPDATE**: Apenas admin

### Boas Práticas

1. **Nunca compartilhe**:
   - Service Role Key
   - Senha de admin
   - Database password

2. **Use apenas**:
   - Anon/Public Key (no frontend)
   - HTTPS sempre

3. **Ative**:
   - 2FA na conta Supabase
   - Senhas fortes
   - Expiração de sessão

### Auditoria

```sql
-- Ver atividades recentes
SELECT * FROM auth.audit_log_entries
ORDER BY created_at DESC
LIMIT 50;

-- Ver usuários autenticados
SELECT * FROM auth.users;
```

---

## Troubleshooting

### Erro: "Supabase não inicializado"

**Causa**: Credenciais não configuradas

**Solução**:
```javascript
// Edite js/supabase-config.js
const SUPABASE_CONFIG = {
    url: 'https://seu-projeto.supabase.co',  // ✅
    anonKey: 'eyJ...'  // ✅
};
```

### Erro: "Invalid login credentials"

**Causa**: Email/senha incorretos ou usuário não confirmado

**Solução**:
1. Verifique email e senha
2. No Supabase: Authentication → Users
3. Confirme que o usuário existe
4. Recrie usuário com "Auto Confirm" ✅

### Erro: "Row Level Security"

**Causa**: Policies não criadas

**Solução**:
1. Execute TODO o `supabase-schema.sql`
2. Verifique policies em: Database → Policies
3. Habilite RLS em todas as tabelas

### Erro ao Upload: "The resource already exists"

**Causa**: Arquivo com mesmo nome já existe

**Solução**:
- O sistema adiciona timestamp automático
- Se persistir, limpe o storage
- Verifique permissões do bucket

### Produtos não aparecem na loja

**Causa**: Produtos inativos ou erro na query

**Solução**:
1. Verifique se produtos estão ativos
2. Abra Console (F12) e veja erros
3. Verifique se `produtos-supabase.js` está carregado

### CORS Error

**Causa**: Abrindo arquivo localmente (`file://`)

**Solução**:
```bash
# Use servidor local
python3 -m http.server 8000

# Ou
npx serve .
```

---

## Performance

### Otimizações Implementadas

1. **Índices no Banco**:
   - `categoria` (produtos)
   - `ativo` (produtos)
   - `status` (pedidos)

2. **Caching**:
   - Produtos carregados uma vez
   - Categorias em memória
   - Imagens cacheadas pelo browser

3. **Lazy Loading**:
   - Imagens carregadas sob demanda
   - Páginas carregadas ao navegar

4. **Compressão**:
   - CSS e JS minificados (produção)
   - Imagens otimizadas

### Limites do Plano Gratuito

- **Banco de dados**: 500MB
- **Storage**: 1GB
- **Requisições**: 50.000/mês
- **Bandwidth**: 2GB/mês

---

## Backup

### Manual

```bash
# No Supabase Dashboard → Settings → Database
# Download backup (SQL dump)
```

### Automático

O Supabase faz backup diário automático (mantém 7 dias).

### Exportar Dados

```sql
-- Exportar produtos
COPY produtos TO '/tmp/produtos.csv' CSV HEADER;

-- Exportar pedidos
COPY pedidos TO '/tmp/pedidos.csv' CSV HEADER;
```

---

## Roadmap

### Em Desenvolvimento:

- [ ] Gerenciamento completo de pedidos
- [ ] Dashboard de cupons
- [ ] Relatórios de vendas
- [ ] Notificações por email
- [ ] Múltiplas imagens por produto
- [ ] Exportação de dados (CSV/Excel)
- [ ] Filtros avançados
- [ ] Log de atividades
- [ ] Configurações de frete por região
- [ ] Integração com pagamentos

### Futuro:

- [ ] App mobile do admin
- [ ] Push notifications
- [ ] Analytics avançado
- [ ] A/B testing
- [ ] Automação de marketing
- [ ] Integrações (Mailchimp, etc)

---

## Suporte

### Documentação:
- `CONFIGURACAO-SUPABASE.md` - Setup completo
- `ADMIN-QUICKSTART.md` - Início rápido
- `PROXIMOS-PASSOS.md` - Roadmap geral

### Recursos:
- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com/

---

## Licença

© 2024 Priscilla Santalena. Todos os direitos reservados.

---

**Desenvolvido com ❤️ usando Supabase, JavaScript e muito café ☕**
