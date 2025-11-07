# 🗄️ Configuração do Supabase - Guia Completo

Este guia orienta você passo a passo na configuração do Supabase para o painel administrativo.

## 📋 Índice

1. [Criar Conta no Supabase](#1-criar-conta-no-supabase)
2. [Criar Novo Projeto](#2-criar-novo-projeto)
3. [Executar Schema SQL](#3-executar-schema-sql)
4. [Configurar Storage](#4-configurar-storage)
5. [Criar Usuário Admin](#5-criar-usuário-admin)
6. [Configurar Credenciais](#6-configurar-credenciais)
7. [Testar Conexão](#7-testar-conexão)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Criar Conta no Supabase

### Passo a Passo:

1. Acesse: https://supabase.com
2. Clique em **"Start your project"**
3. Escolha uma das opções:
   - **GitHub** (recomendado)
   - **Email/Senha**
4. Complete o cadastro

**✅ Gratuito até 500MB de banco de dados e 1GB de storage**

---

## 2. Criar Novo Projeto

### Passo a Passo:

1. No Dashboard, clique em **"New Project"**

2. Preencha os dados:
   - **Name**: `priscilla-santalena` (ou outro nome)
   - **Database Password**: Crie uma senha forte
   - **Region**: Escolha a mais próxima (ex: Europe - West)
   - **Pricing Plan**: **Free** (suficiente para começar)

3. Clique em **"Create new project"**

4. **⏰ Aguarde ~2 minutos** enquanto o projeto é criado

**💡 Dica**: Salve a senha do banco de dados em um local seguro!

---

## 3. Executar Schema SQL

### Passo a Passo:

1. No menu lateral, clique em **"SQL Editor"**

2. Clique em **"New query"**

3. Abra o arquivo `supabase-schema.sql` na pasta do projeto

4. **Copie TODO o conteúdo** do arquivo

5. **Cole** no SQL Editor do Supabase

6. Clique em **"RUN"** (ou pressione `Ctrl+Enter`)

7. **Aguarde** a execução completar

8. ✅ Você deve ver: **"Success. No rows returned"**

### O que foi criado:

- ✅ 7 tabelas (produtos, categorias, pedidos, etc.)
- ✅ Índices para performance
- ✅ Triggers automáticos
- ✅ Políticas de segurança (RLS)
- ✅ Dados iniciais:
  - 4 categorias
  - 9 produtos
  - 4 códigos promocionais
  - Configurações padrão

---

## 4. Configurar Storage

O Storage é onde as imagens dos produtos serão armazenadas.

### Passo a Passo:

1. No menu lateral, clique em **"Storage"**

2. Clique em **"Create a new bucket"**

3. Preencha:
   - **Name**: `produtos`
   - **Public bucket**: ✅ **Marcar como PUBLIC**
   - (Deixe as outras opções como padrão)

4. Clique em **"Create bucket"**

5. Clique no bucket `produtos` criado

6. Clique em **"Policies"**

7. Clique em **"New Policy"**

8. Selecione **"For full customization"**

9. Configure as policies:

**Policy 1: Permitir SELECT (leitura pública)**
```sql
CREATE POLICY "Qualquer um pode ver imagens"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'produtos');
```

**Policy 2: Permitir INSERT (apenas autenticados)**
```sql
CREATE POLICY "Usuários autenticados podem fazer upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'produtos');
```

**Policy 3: Permitir DELETE (apenas autenticados)**
```sql
CREATE POLICY "Usuários autenticados podem deletar"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'produtos');
```

10. Clique em **"Save policy"** para cada uma

---

## 5. Criar Usuário Admin

### Passo a Passo:

1. No menu lateral, clique em **"Authentication"**

2. Clique em **"Users"**

3. Clique em **"Add user"** → **"Create new user"**

4. Preencha:
   - **Email**: seu email de admin (ex: `admin@santalena.nl`)
   - **Password**: senha forte para o admin
   - **Auto Confirm User**: ✅ **Marcar**

5. Clique em **"Create user"**

6. ✅ Usuário admin criado!

**🔐 Importante**: Este será o usuário para acessar o painel administrativo.

---

## 6. Configurar Credenciais

Agora você precisa conectar o site ao Supabase.

### Passo a Passo:

1. No menu lateral, clique em **"Project Settings"** (ícone de engrenagem)

2. Clique em **"API"**

3. **Copie** as seguintes informações:

```
Project URL: https://xyzcompany.supabase.co
anon/public key: eyJhbGc...muito.longa
```

4. Abra o arquivo `js/supabase-config.js` no seu projeto

5. **Substitua** as credenciais:

```javascript
const SUPABASE_CONFIG = {
    url: 'SUA_URL_DO_SUPABASE',  // Cole aqui o Project URL
    anonKey: 'SUA_ANON_KEY_DO_SUPABASE'  // Cole aqui o anon public key
};
```

**Por exemplo:**
```javascript
const SUPABASE_CONFIG = {
    url: 'https://xyzcompany.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emNvbXBhbnkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY4...'
};
```

6. **Salve** o arquivo

---

## 7. Testar Conexão

### Teste 1: Verificar Console do Navegador

1. Abra o arquivo `produtos.html` no navegador

2. Pressione `F12` para abrir o Console

3. Procure por:
   - ✅ `"✅ Supabase inicializado com sucesso"`
   - ✅ `"✅ Produtos carregados do Supabase: 9"`

4. Se ver erros, veja [Troubleshooting](#8-troubleshooting)

### Teste 2: Fazer Login no Admin

1. Abra `admin-login.html` no navegador

2. Digite o email e senha do usuário admin criado

3. Clique em **"Entrar"**

4. ✅ Se funcionar, você será redirecionado para o dashboard!

### Teste 3: Adicionar um Produto

1. No dashboard, vá em **"Produtos"**

2. Clique em **"➕ Novo Produto"**

3. Preencha os dados de um produto de teste

4. Faça upload de uma imagem

5. Clique em **"Salvar Produto"**

6. ✅ Se aparecer "Produto criado com sucesso!", está funcionando!

---

## 8. Troubleshooting

### ❌ Erro: "Supabase não inicializado"

**Solução**:
- Verifique se copiou corretamente a URL e a Key
- Verifique se não há espaços antes/depois das strings
- Verifique se salvou o arquivo `supabase-config.js`

### ❌ Erro: "Invalid login credentials"

**Solução**:
- Verifique se o email e senha estão corretos
- Verifique se marcou "Auto Confirm User" ao criar o usuário
- Tente criar um novo usuário

### ❌ Erro: "Row Level Security"

**Solução**:
- Verifique se executou TODO o `supabase-schema.sql`
- No Supabase, vá em **"Authentication"** → **"Policies"**
- Verifique se as policies foram criadas corretamente

### ❌ Produtos não aparecem na loja

**Solução**:
- Abra o Console do navegador (F12)
- Veja se há erros
- Verifique se os produtos foram inseridos no banco:
  - Vá em **"Table Editor"** → **"produtos"**
  - Deve haver 9 produtos

### ❌ Erro ao fazer upload de imagem

**Solução**:
- Verifique se criou o bucket "produtos"
- Verifique se o bucket está marcado como PUBLIC
- Verifique se criou as 3 policies do storage

### ❌ CORS Error

**Solução**:
- Use um servidor local: `python3 -m http.server 8000`
- Não abra os arquivos diretamente (`file://`)

---

## 📊 Verificar Se Tudo Está Certo

### Checklist Final:

- [ ] Projeto criado no Supabase
- [ ] Schema SQL executado com sucesso
- [ ] Bucket "produtos" criado e público
- [ ] 3 policies do storage criadas
- [ ] Usuário admin criado
- [ ] Credenciais configuradas em `supabase-config.js`
- [ ] Login no painel admin funciona
- [ ] Produtos aparecem na loja
- [ ] Upload de imagem funciona

---

## 🎓 Próximos Passos

Agora que tudo está configurado:

1. **Personalize os produtos**:
   - Edite os 9 produtos iniciais
   - Adicione imagens reais
   - Ajuste preços e descrições

2. **Adicione mais produtos**:
   - Use o painel admin
   - Crie novos produtos com fotos

3. **Configure as informações do site**:
   - Vá em **"Configurações"** no admin
   - Atualize email, telefone, WhatsApp

4. **Teste o fluxo completo**:
   - Adicione produto ao carrinho
   - Vá até o checkout
   - Simule um pedido

---

## 📚 Recursos Adicionais

### Documentação Oficial:
- Supabase Docs: https://supabase.com/docs
- Supabase Storage: https://supabase.com/docs/guides/storage
- Row Level Security: https://supabase.com/docs/guides/auth/row-level-security

### Vídeos Tutoriais:
- Supabase Crash Course: https://www.youtube.com/watch?v=7uKQBl9uZ00

### Comunidade:
- Supabase Discord: https://discord.supabase.com/

---

## 💡 Dicas Importantes

1. **Backups**: O Supabase faz backup automático, mas exporte seu banco regularmente

2. **Limites do Plano Gratuito**:
   - 500MB de banco de dados
   - 1GB de storage
   - 50.000 requisições por mês
   - (Suficiente para um site pequeno)

3. **Monitoramento**:
   - Veja estatísticas em **"Reports"**
   - Monitore uso de storage em **"Storage"**

4. **Segurança**:
   - Nunca compartilhe a **service_role key** (só use a anon key)
   - Use senhas fortes para usuários admin
   - Ative 2FA na sua conta Supabase

---

## ✅ Tudo Pronto!

Parabéns! Seu site agora está integrado com o Supabase! 🎉

Você agora pode:
- ✅ Gerenciar produtos pelo painel admin
- ✅ Fazer upload de imagens
- ✅ Ver estatísticas de vendas
- ✅ Produtos são carregados dinamicamente

**Próximo passo**: Adicione suas fotos reais e comece a vender! 🚀
