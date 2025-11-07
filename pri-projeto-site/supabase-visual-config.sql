-- =====================================================
-- CONFIGURAÇÕES VISUAIS E CONTEÚDO DO SITE
-- Execute este SQL no Supabase SQL Editor
-- =====================================================

-- =====================================================
-- TABELA: secoes_site (Hero, Sobre, etc.)
-- =====================================================
CREATE TABLE IF NOT EXISTS secoes_site (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    secao VARCHAR(50) NOT NULL UNIQUE, -- 'hero', 'sobre', 'servicos', etc.
    titulo TEXT,
    subtitulo TEXT,
    descricao TEXT,
    imagem_url TEXT,
    imagens_carrossel JSONB, -- Array de URLs para carrossel
    conteudo_html TEXT, -- Conteúdo rico em HTML
    cta_texto VARCHAR(100), -- Texto do botão (Call to Action)
    cta_link VARCHAR(255), -- Link do botão
    ativo BOOLEAN DEFAULT true,
    ordem INTEGER DEFAULT 0,
    config_extra JSONB, -- Configurações adicionais
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- TABELA: config_visual (Logo, Cores, Fontes)
-- =====================================================
CREATE TABLE IF NOT EXISTS config_visual (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chave VARCHAR(100) NOT NULL UNIQUE,
    valor TEXT,
    tipo VARCHAR(50), -- 'imagem', 'cor', 'texto', 'numero', 'json'
    categoria VARCHAR(50), -- 'branding', 'cores', 'tipografia', 'layout'
    descricao TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- INSERIR CONFIGURAÇÕES PADRÃO
-- =====================================================

-- Seções do site
INSERT INTO secoes_site (secao, titulo, subtitulo, descricao, ordem, ativo) VALUES
('hero', 'Bem-vindo à Terapia Holística', 'Encontre seu equilíbrio e bem-estar', 'Descubra o poder da aromaterapia e essencioterapia para transformar sua vida', 1, true),
('sobre', 'Sobre Priscilla Santalena', 'Terapeuta Holística Certificada', 'Com mais de 10 anos de experiência em terapias complementares, ajudo pessoas a encontrarem equilíbrio emocional e bem-estar através de técnicas naturais.', 2, true),
('servicos', 'Serviços', 'Terapias Personalizadas', 'Oferecemos uma variedade de serviços holísticos para atender suas necessidades específicas', 3, true),
('depoimentos', 'Depoimentos', 'O que dizem nossos clientes', 'Histórias reais de transformação e cura', 4, true)
ON CONFLICT (secao) DO UPDATE SET
    titulo = EXCLUDED.titulo,
    subtitulo = EXCLUDED.subtitulo,
    descricao = EXCLUDED.descricao;

-- Configurações visuais padrão (Tema Santalena)
INSERT INTO config_visual (chave, valor, tipo, categoria, descricao) VALUES
-- Branding
('site_logo', '', 'imagem', 'branding', 'Logo principal do site'),
('site_favicon', '', 'imagem', 'branding', 'Ícone do site (favicon)'),
('site_nome', 'Priscilla Santalena', 'texto', 'branding', 'Nome do site'),
('site_tagline', 'Terapeuta Holística', 'texto', 'branding', 'Slogan/tagline'),

-- Cores (Tema Santalena)
('cor_primaria', '#031e1e', 'cor', 'cores', 'Verde escuro/teal principal'),
('cor_secundaria', '#1a3232', 'cor', 'cores', 'Verde médio secundário'),
('cor_terciaria', '#2d4a4a', 'cor', 'cores', 'Verde mais claro'),
('cor_destaque', '#8B6F47', 'cor', 'cores', 'Marrom/terracota para destaques'),
('cor_fundo_primaria', '#fcf5ee', 'cor', 'cores', 'Bege creme claro'),
('cor_fundo_secundaria', '#eee7dc', 'cor', 'cores', 'Bege creme escuro'),
('cor_texto_principal', '#000000', 'cor', 'cores', 'Preto para textos'),
('cor_texto_secundario', '#666666', 'cor', 'cores', 'Cinza para textos secundários'),
('cor_branco', '#ffffff', 'cor', 'cores', 'Branco'),

-- Gradientes
('gradiente_hero', 'linear-gradient(135deg, #031e1e 0%, #1a3232 50%, #2d4a4a 100%)', 'texto', 'cores', 'Gradiente do Hero'),
('gradiente_secundario', 'linear-gradient(to right, #eee7dc, #fcf5ee)', 'texto', 'cores', 'Gradiente secundário'),

-- Tipografia
('fonte_primaria', 'Lora, serif', 'texto', 'tipografia', 'Fonte elegante para títulos'),
('fonte_secundaria', 'Montserrat, sans-serif', 'texto', 'tipografia', 'Fonte para corpo de texto'),
('fonte_tamanho_base', '16px', 'texto', 'tipografia', 'Tamanho base da fonte'),

-- Layout
('largura_maxima', '1200px', 'texto', 'layout', 'Largura máxima do container'),
('espacamento_secoes', '80px', 'texto', 'layout', 'Espaçamento entre seções'),
('border_radius', '10px', 'texto', 'layout', 'Raio das bordas arredondadas'),

-- Recursos extras
('mostrar_relogio', 'true', 'texto', 'recursos', 'Mostrar relógio na página'),
('mostrar_data', 'true', 'texto', 'recursos', 'Mostrar data na página'),
('formato_data', 'dd/MM/yyyy', 'texto', 'recursos', 'Formato da data'),
('fuso_horario', 'Europe/Amsterdam', 'texto', 'recursos', 'Fuso horário')
ON CONFLICT (chave) DO NOTHING;

-- =====================================================
-- TRIGGERS PARA UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_secoes_site_updated_at ON secoes_site;
CREATE TRIGGER update_secoes_site_updated_at
    BEFORE UPDATE ON secoes_site
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_config_visual_updated_at ON config_visual;
CREATE TRIGGER update_config_visual_updated_at
    BEFORE UPDATE ON config_visual
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- =====================================================

-- Habilitar RLS
ALTER TABLE secoes_site ENABLE ROW LEVEL SECURITY;
ALTER TABLE config_visual ENABLE ROW LEVEL SECURITY;

-- Políticas para secoes_site
DROP POLICY IF EXISTS "Permitir leitura pública de secoes_site" ON secoes_site;
CREATE POLICY "Permitir leitura pública de secoes_site"
    ON secoes_site FOR SELECT
    USING (ativo = true);

DROP POLICY IF EXISTS "Permitir todas operações para autenticados em secoes_site" ON secoes_site;
CREATE POLICY "Permitir todas operações para autenticados em secoes_site"
    ON secoes_site FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Políticas para config_visual
DROP POLICY IF EXISTS "Permitir leitura pública de config_visual" ON config_visual;
CREATE POLICY "Permitir leitura pública de config_visual"
    ON config_visual FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Permitir todas operações para autenticados em config_visual" ON config_visual;
CREATE POLICY "Permitir todas operações para autenticados em config_visual"
    ON config_visual FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Verificar tabelas criadas
SELECT
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
    AND table_name IN ('secoes_site', 'config_visual')
ORDER BY table_name;

-- Verificar dados inseridos
SELECT 'secoes_site' as tabela, COUNT(*) as registros FROM secoes_site
UNION ALL
SELECT 'config_visual', COUNT(*) FROM config_visual;
