-- =====================================================
-- SUPABASE STORAGE POLICIES FIX
-- Execute este SQL no Supabase SQL Editor
-- =====================================================

-- IMPORTANTE: Primeiro, delete as policies antigas se existirem
DROP POLICY IF EXISTS "Qualquer um pode ver imagens" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem fazer upload" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar" ON storage.objects;

-- =====================================================
-- POLICY 1: Permitir SELECT (leitura pública)
-- =====================================================
CREATE POLICY "Public Access - SELECT"
ON storage.objects FOR SELECT
USING (bucket_id = 'produtos');

-- =====================================================
-- POLICY 2: Permitir INSERT (upload - autenticados)
-- =====================================================
CREATE POLICY "Authenticated Upload - INSERT"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'produtos');

-- =====================================================
-- POLICY 3: Permitir UPDATE (atualização - autenticados)
-- =====================================================
CREATE POLICY "Authenticated Update - UPDATE"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'produtos')
WITH CHECK (bucket_id = 'produtos');

-- =====================================================
-- POLICY 4: Permitir DELETE (remoção - autenticados)
-- =====================================================
CREATE POLICY "Authenticated Delete - DELETE"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'produtos');

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================
-- Execute esta query para verificar se as policies foram criadas:
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage'
ORDER BY policyname;
