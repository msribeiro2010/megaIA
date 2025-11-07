# 🔧 FIX: Erro de Upload no Storage

## ❌ Erro Atual
```
StorageApiError: new row violates row-level security policy
```

## ✅ Solução Rápida

### Passo 1: Acessar Supabase SQL Editor

1. Vá para: https://supabase.com/dashboard
2. Selecione seu projeto
3. Menu lateral → **"SQL Editor"**
4. Clique em **"New query"**

### Passo 2: Executar SQL de Correção

1. Copie TODO o conteúdo do arquivo `supabase-storage-policies.sql`
2. Cole no SQL Editor
3. Clique em **"RUN"** (ou `Ctrl+Enter`)
4. Aguarde a mensagem de sucesso

### Passo 3: Verificar Policies

Execute esta query para verificar:

```sql
SELECT
    policyname,
    cmd,
    roles
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage'
ORDER BY policyname;
```

**Deve retornar 4 policies**:
- ✅ `Public Access - SELECT` (cmd: SELECT, roles: {})
- ✅ `Authenticated Upload - INSERT` (cmd: INSERT, roles: {authenticated})
- ✅ `Authenticated Update - UPDATE` (cmd: UPDATE, roles: {authenticated})
- ✅ `Authenticated Delete - DELETE` (cmd: DELETE, roles: {authenticated})

### Passo 4: Testar Upload

1. Faça login no painel admin: http://localhost:8000/admin-login.html
2. Vá em **"Produtos"**
3. Clique em **"➕ Novo Produto"**
4. Preencha os dados e faça upload de uma imagem
5. ✅ Deve funcionar agora!

---

## 🔍 O que foi corrigido?

### Problema Original
As policies antigas não estavam configuradas corretamente para permitir:
- Upload de arquivos (INSERT)
- Atualização de metadados (UPDATE)
- Deleção de arquivos (DELETE)

### Solução Aplicada
**4 Policies criadas**:

1. **SELECT (Pública)**: Qualquer pessoa pode ver as imagens
   - Necessário para exibir produtos na loja

2. **INSERT (Autenticados)**: Usuários logados podem fazer upload
   - Necessário para adicionar novos produtos com imagens

3. **UPDATE (Autenticados)**: Usuários logados podem atualizar
   - Necessário para editar metadados das imagens

4. **DELETE (Autenticados)**: Usuários logados podem deletar
   - Necessário para remover produtos

---

## 🚨 Troubleshooting

### Ainda dá erro após aplicar o SQL?

**1. Verificar se o bucket existe:**
```sql
SELECT * FROM storage.buckets WHERE id = 'produtos';
```

Se não existir, criar:
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('produtos', 'produtos', true);
```

**2. Verificar se o bucket é público:**
```sql
UPDATE storage.buckets
SET public = true
WHERE id = 'produtos';
```

**3. Verificar autenticação:**
- Certifique-se de estar logado no painel admin
- Verifique se o token JWT está válido
- Tente fazer logout e login novamente

**4. Verificar RLS está habilitado:**
```sql
-- Verificar se RLS está ativo na tabela storage.objects
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'storage' AND tablename = 'objects';
```

Deve retornar `rowsecurity = true`

---

## 📝 Notas Importantes

### Segurança
- ✅ Apenas usuários **autenticados** podem fazer upload
- ✅ Leitura é **pública** (necessário para exibir na loja)
- ✅ Apenas admins logados podem deletar imagens

### Limites
- Tamanho máximo: **50MB** por arquivo (padrão Supabase)
- Formatos aceitos: **JPG, PNG, GIF, WEBP**
- Storage gratuito: **1GB** no plano free

---

## ✅ Checklist Final

- [ ] SQL executado com sucesso no Supabase
- [ ] 4 policies criadas e verificadas
- [ ] Bucket "produtos" existe e é público
- [ ] Login no painel admin funciona
- [ ] Upload de imagem funciona sem erros
- [ ] Imagens aparecem na loja pública

---

## 🎉 Pronto!

Agora você pode fazer upload de imagens sem problemas!

Se ainda tiver erros, verifique:
1. Se está logado no painel admin
2. Se as credenciais em `js/supabase-config.js` estão corretas
3. Se o token de autenticação está válido
