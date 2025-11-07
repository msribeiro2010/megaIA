# 🚀 Deploy na Hostinger - Guia Completo

## 📋 Pré-requisitos

- Conta Hostinger ativa
- Acesso ao painel hPanel
- Domínio configurado (opcional)

## 🔧 Passo a Passo - Deploy via FTP/Gerenciador de Arquivos

### Opção 1: Gerenciador de Arquivos (Mais Fácil)

1. **Acesse o hPanel da Hostinger**
   - Login: https://hpanel.hostinger.com

2. **Vá para Gerenciador de Arquivos**
   - hPanel → Arquivos → Gerenciador de Arquivos

3. **Navegue até a pasta public_html**
   - Esta é a pasta raiz do seu site

4. **Faça Upload dos Arquivos**
   - Selecione todos os arquivos do projeto (exceto .git, node_modules)
   - Arraste e solte ou use o botão "Upload"
   - Arquivos necessários:
     ```
     ├── index.html
     ├── produtos.html
     ├── admin-login.html
     ├── admin-dashboard.html
     ├── css/
     │   ├── style.css
     │   ├── theme-santalena.css
     │   └── admin.css
     ├── js/
     │   ├── main.js
     │   ├── supabase-config.js
     │   ├── load-site-config.js
     │   ├── site-config.js
     │   ├── produtos.js
     │   └── produtos-supabase.js
     └── images/
         └── (suas imagens)
     ```

5. **Configure as Permissões**
   - Arquivos: 644
   - Pastas: 755

### Opção 2: Deploy via FTP (FileZilla)

1. **Obtenha as Credenciais FTP**
   - hPanel → Arquivos → Contas FTP
   - Anote: Host, Usuário, Senha, Porta

2. **Configure o FileZilla**
   - Host: `ftp.seudominio.com` ou IP fornecido
   - Usuário: `usuario@seudominio.com`
   - Senha: sua senha FTP
   - Porta: 21 (ou 22 para SFTP)

3. **Conecte e Faça Upload**
   - Conecte ao servidor
   - Navegue até `/public_html`
   - Arraste os arquivos do projeto

### Opção 3: Deploy via Git (Avançado)

1. **Habilite Git no hPanel**
   - hPanel → Avançado → Git
   - Crie um novo repositório

2. **Clone e Configure**
   ```bash
   cd /home/usuario/public_html
   git clone https://github.com/msribeiro2010/pri-santalena.git .
   ```

## ⚙️ Configuração do Supabase

### 1. Atualize as Credenciais

Edite o arquivo `js/supabase-config.js`:

```javascript
const SUPABASE_URL = 'SUA_URL_SUPABASE';
const SUPABASE_ANON_KEY = 'SUA_CHAVE_PUBLICA';
```

### 2. Execute os Scripts SQL

No painel do Supabase (https://supabase.com):

1. Vá em **SQL Editor**
2. Execute na ordem:
   - `supabase-schema.sql`
   - `supabase-site-config.sql`
   - `supabase-storage-policies.sql`
   - `fix-rls-policies.sql`

### 3. Configure o Storage

1. Vá em **Storage** no Supabase
2. Crie os buckets:
   - `hero-images` (público)
   - `logos` (público)
   - `about` (público)
   - `produtos` (público)

3. Configure as políticas de acesso público para cada bucket

## 🌐 Configuração de Domínio

### Se usar domínio próprio:

1. **DNS**
   - hPanel → Domínios → Gerenciar
   - Configure os nameservers se necessário

2. **SSL/HTTPS**
   - hPanel → Segurança → SSL
   - Ative o certificado SSL gratuito

## 📝 Arquivos de Configuração (Opcional)

### .htaccess (para melhor performance)

Crie um arquivo `.htaccess` na raiz:

```apache
# Habilitar compressão GZIP
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Cache de arquivos estáticos
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/html "access plus 1 hour"
</IfModule>

# Redirecionar para HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Redirecionar para www (opcional)
# RewriteCond %{HTTP_HOST} !^www\.
# RewriteRule ^(.*)$ https://www.%{HTTP_HOST}/$1 [R=301,L]
```

## 🧪 Teste o Site

1. Acesse seu domínio ou IP temporário
2. Teste todas as páginas:
   - ✅ `index.html` - Página inicial
   - ✅ `produtos.html` - Catálogo de produtos
   - ✅ `admin-login.html` - Painel admin
   - ✅ `admin-dashboard.html` - Dashboard admin

3. Verifique responsividade:
   - Desktop
   - Tablet
   - Mobile

## 🔒 Segurança

### Proteger o Painel Admin

Adicione ao `.htaccess`:

```apache
# Proteger pasta admin
<Files "admin-*.html">
  AuthType Basic
  AuthName "Área Restrita"
  AuthUserFile /caminho/completo/.htpasswd
  Require valid-user
</Files>
```

Crie o arquivo `.htpasswd` usando: https://hostingcanada.org/htpasswd-generator/

## 📊 Monitoramento

### Google Analytics (Opcional)

Adicione antes do `</head>` em todas as páginas:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🆘 Resolução de Problemas

### Site não carrega
- Verifique se os arquivos estão em `/public_html`
- Confirme permissões (644 para arquivos, 755 para pastas)

### Imagens não aparecem
- Verifique caminhos relativos
- Confirme que as imagens foram enviadas
- Verifique permissões dos arquivos

### Supabase não conecta
- Confirme credenciais em `supabase-config.js`
- Verifique políticas RLS no Supabase
- Ative CORS no Supabase se necessário

### SSL/HTTPS
- Aguarde até 24h para ativação do SSL
- Force HTTPS via `.htaccess`

## 📞 Suporte

- **Hostinger**: https://www.hostinger.com.br/suporte
- **Supabase**: https://supabase.com/docs
- **Repositório**: https://github.com/msribeiro2010/pri-santalena

---

✅ **Pronto!** Seu site estará online e funcionando perfeitamente na Hostinger!
