# Instruções para Corrigir Erro RLS no Supabase

## Problema
Erro: `new row violates row-level security policy for table "site_config"`

## Causa
As políticas RLS (Row-Level Security) estão configuradas para exigir autenticação, mas o painel admin não está usando autenticação.

## Solução

### Opção 1: Executar SQL no Supabase (Recomendado)

1. Acesse o Supabase Dashboard: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor** (ícone de código na barra lateral)
4. Cole o conteúdo do arquivo `fix-rls-policies.sql`
5. Clique em **Run** para executar

### Opção 2: Desabilitar RLS Temporariamente (Apenas para Desenvolvimento)

Execute este SQL no Supabase SQL Editor:

```sql
ALTER TABLE site_config DISABLE ROW LEVEL SECURITY;
```

**⚠️ ATENÇÃO**: Isso remove toda a proteção. Use apenas em ambiente de desenvolvimento!

### Opção 3: Implementar Autenticação (Produção)

Para um ambiente de produção, implemente autenticação adequada:

1. Configure Supabase Auth no painel admin
2. Adicione login/logout no `admin-login.html`
3. Mantenha as políticas RLS que requerem autenticação

## Verificação

Após executar uma das soluções, teste salvando a configuração do logo no painel admin.

## Políticas Atuais Aplicadas

Após executar `fix-rls-policies.sql`, as políticas permitem:
- ✅ SELECT público (leitura)
- ✅ INSERT público (criação)
- ✅ UPDATE público (atualização)
- ✅ DELETE público (exclusão)

**Nota**: Esta configuração é apropriada para demonstração, mas não para produção com dados sensíveis.
