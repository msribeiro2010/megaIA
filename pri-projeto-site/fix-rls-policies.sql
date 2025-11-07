-- =====================================================
-- CORRIGIR POLÍTICAS RLS PARA SITE_CONFIG
-- Execute este SQL no Supabase SQL Editor
-- =====================================================

-- Remover políticas antigas
DROP POLICY IF EXISTS "Permitir insert para usuários autenticados" ON site_config;
DROP POLICY IF EXISTS "Permitir update para usuários autenticados" ON site_config;
DROP POLICY IF EXISTS "Permitir leitura pública de configurações" ON site_config;

-- Criar novas políticas que permitem acesso sem autenticação
-- ATENÇÃO: Isso é apropriado apenas para sites de demonstração
-- Para produção, recomenda-se usar autenticação adequada

-- Permitir leitura pública
CREATE POLICY "Permitir leitura pública"
    ON site_config FOR SELECT
    USING (true);

-- Permitir INSERT para todos
CREATE POLICY "Permitir insert público"
    ON site_config FOR INSERT
    WITH CHECK (true);

-- Permitir UPDATE para todos
CREATE POLICY "Permitir update público"
    ON site_config FOR UPDATE
    USING (true);

-- Permitir DELETE para todos (opcional)
CREATE POLICY "Permitir delete público"
    ON site_config FOR DELETE
    USING (true);
