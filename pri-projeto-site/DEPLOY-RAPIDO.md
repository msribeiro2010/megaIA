# 🚀 Deploy Rápido na Hostinger - 5 Minutos

## 📋 Checklist Antes de Começar

- [ ] Login na Hostinger (https://hpanel.hostinger.com)
- [ ] Conta Supabase criada (https://supabase.com)
- [ ] Repositório GitHub atualizado ✅

## 🎯 PASSO 1: Upload dos Arquivos (5 min)

### Método 1: Gerenciador de Arquivos (MAIS FÁCIL)

1. **Login no hPanel da Hostinger**
   - https://hpanel.hostinger.com

2. **Gerenciador de Arquivos**
   - Menu lateral → **Arquivos** → **Gerenciador de Arquivos**

3. **Limpe a pasta public_html** (se houver arquivos antigos)
   - Selecione todos os arquivos
   - Botão **Deletar**

4. **Faça Upload**
   - Clique em **Upload**
   - Selecione TODOS estes arquivos do projeto:
     ```
     ✅ index.html
     ✅ produtos.html
     ✅ admin-login.html
     ✅ admin-dashboard.html
     ✅ test-supabase.html
     ✅ Pasta css/ (completa)
     ✅ Pasta js/ (completa)
     ✅ Pasta images/ (completa)
     ✅ Pasta sql/ (completa - para referência)
     ```

5. **Aguarde o upload completar** ⏳

## 🎯 PASSO 2: Configurar Supabase (10 min)

### 2.1 - Criar Projeto no Supabase

1. **Acesse**: https://supabase.com
2. **New Project**
3. Anote:
   - `Project URL` (ex: https://xxxxx.supabase.co)
   - `Anon/Public Key` (chave pública)

### 2.2 - Executar Scripts SQL

No Supabase:
1. Menu lateral → **SQL Editor**
2. Execute os scripts **NA ORDEM**:

**Script 1:** `supabase-schema.sql`
```sql
-- Cole todo o conteúdo do arquivo
-- Clique RUN
```

**Script 2:** `supabase-site-config.sql`
```sql
-- Cole todo o conteúdo do arquivo
-- Clique RUN
```

**Script 3:** `supabase-storage-policies.sql`
```sql
-- Cole todo o conteúdo do arquivo
-- Clique RUN
```

**Script 4:** `fix-rls-policies.sql`
```sql
-- Cole todo o conteúdo do arquivo
-- Clique RUN
```

### 2.3 - Criar Buckets de Storage

No Supabase:
1. Menu lateral → **Storage**
2. **New bucket** (criar 4 buckets):
   - Nome: `hero-images` → ✅ Public bucket
   - Nome: `logos` → ✅ Public bucket
   - Nome: `about` → ✅ Public bucket
   - Nome: `produtos` → ✅ Public bucket

## 🎯 PASSO 3: Atualizar Credenciais (2 min)

### 3.1 - Editar arquivo JS na Hostinger

1. **No Gerenciador de Arquivos da Hostinger**
2. Navegue para: `public_html/js/supabase-config.js`
3. Clique direito → **Edit**
4. Localize as linhas:
   ```javascript
   const SUPABASE_URL = 'https://...';
   const SUPABASE_ANON_KEY = 'eyJ...';
   ```

5. **Substitua** pelos seus valores do Supabase:
   ```javascript
   const SUPABASE_URL = 'https://SEU-PROJETO.supabase.co';
   const SUPABASE_ANON_KEY = 'SUA-CHAVE-PUBLICA-AQUI';
   ```

6. **Salvar** (Ctrl+S ou botão Save)

## 🎯 PASSO 4: Ativar SSL/HTTPS (1 min)

1. **No hPanel da Hostinger**
2. Menu → **Segurança** → **SSL**
3. Ative o **SSL gratuito** (Let's Encrypt)
4. Aguarde alguns minutos para ativação

## 🎯 PASSO 5: Testar o Site! 🎉

### 5.1 - Acesse seu site

Abra no navegador:
- `http://seudominio.com` ou
- `http://seu-ip-temporario` (fornecido pela Hostinger)

### 5.2 - Teste estas páginas:

- [ ] **Página inicial** - `index.html`
  - Hero carrega?
  - Seções aparecem?

- [ ] **Produtos** - `produtos.html`
  - Cards de produtos aparecem?
  - Carrinho funciona?

- [ ] **Admin** - `admin-login.html`
  - Página carrega?
  - Consegue logar no painel?

- [ ] **Dashboard Admin** - `admin-dashboard.html`
  - Consegue editar configurações?
  - Upload de imagens funciona?

## 🆘 Problemas Comuns?

### ❌ Site não carrega
**Solução**: Verifique se os arquivos estão em `/public_html` (não em subpasta)

### ❌ Imagens não aparecem
**Solução**:
- Verifique se a pasta `images/` foi enviada
- Confirme permissões: arquivos `644`, pastas `755`

### ❌ Supabase não conecta
**Solução**:
1. Verifique credenciais em `js/supabase-config.js`
2. Confirme que executou todos os 4 scripts SQL
3. Confirme que os buckets foram criados como **públicos**

### ❌ Admin não funciona
**Solução**:
1. Verifique o script `fix-rls-policies.sql` foi executado
2. Teste com: `test-supabase.html`

## 📊 Otimizações (Opcional)

### .htaccess para Performance

Crie arquivo `.htaccess` em `/public_html`:

```apache
# Redirecionar para HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Cache de arquivos estáticos
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Compressão GZIP
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript
</IfModule>
```

## ✅ Checklist Final

- [ ] Arquivos enviados para `/public_html`
- [ ] Scripts SQL executados no Supabase
- [ ] Buckets de storage criados (públicos)
- [ ] Credenciais atualizadas em `supabase-config.js`
- [ ] SSL ativado
- [ ] Site testado e funcionando
- [ ] Admin testado e funcionando

## 🎉 Pronto!

Seu site está ONLINE na Hostinger! 🚀

**URL do seu site**: https://seudominio.com

---

**Precisa de ajuda?**
- Suporte Hostinger: https://www.hostinger.com.br/suporte
- Documentação Supabase: https://supabase.com/docs
