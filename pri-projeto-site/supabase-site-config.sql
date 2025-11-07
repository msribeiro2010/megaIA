-- =====================================================
-- TABELA DE CONFIGURAÇÕES DO SITE
-- =====================================================

CREATE TABLE IF NOT EXISTS site_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    config_key TEXT UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índice para busca rápida por chave
CREATE INDEX idx_site_config_key ON site_config(config_key);

-- RLS Policies
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública
CREATE POLICY "Permitir leitura pública de configurações"
    ON site_config FOR SELECT
    USING (true);

-- Permitir apenas admins autenticados para inserir/atualizar
CREATE POLICY "Permitir insert para usuários autenticados"
    ON site_config FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir update para usuários autenticados"
    ON site_config FOR UPDATE
    USING (auth.role() = 'authenticated');

-- =====================================================
-- INSERIR CONFIGURAÇÕES PADRÃO
-- =====================================================

-- Configuração da Seção Hero
INSERT INTO site_config (config_key, config_value) VALUES
('hero_section', '{
    "title": "Bem-vinda ao Equilíbrio e Energia",
    "subtitle": "Ajudo mulheres na (peri)menopausa a se sentirem energizadas, equilibradas e confiantes com uma abordagem holística e pessoal.",
    "button_primary_text": "Agende sua Consulta",
    "button_primary_link": "#contato",
    "button_secondary_text": "Conheça os Serviços",
    "button_secondary_link": "#servicos",
    "background_image": "",
    "overlay_opacity": 0.7
}'::jsonb)
ON CONFLICT (config_key) DO NOTHING;

-- Configuração da Seção Sobre
INSERT INTO site_config (config_key, config_value) VALUES
('about_section', '{
    "name": "Priscilla Santalena",
    "highlight": "Nascida em São Paulo, Brasil (1976)",
    "bio_intro": "Com formação em Serviço Social e experiência na Reclassering Nederland, dedico-me agora à terapia holística, ajudando mulheres a encontrarem equilíbrio e bem-estar em todas as fases da vida.",
    "bio_journey": "Minha jornada me levou a especializar-me em:",
    "services": [
        "Essencioterapia",
        "Aromaterapia",
        "Reiki (Níveis I, II e Mestre)"
    ],
    "bio_footer": "Estou registrada no CAT e GAT-geschillen, garantindo um atendimento profissional e ético.",
    "profile_image": "images/priscilla.jpg"
}'::jsonb)
ON CONFLICT (config_key) DO NOTHING;

-- Configuração do Logo
INSERT INTO site_config (config_key, config_value) VALUES
('site_logo', '{
    "logo_url": "",
    "logo_text": "Priscilla Santalena",
    "tagline": "Terapeuta Holística",
    "use_image": false
}'::jsonb)
ON CONFLICT (config_key) DO NOTHING;

-- Função para atualizar timestamp automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_site_config_updated_at
    BEFORE UPDATE ON site_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
