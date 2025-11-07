-- =====================================================
-- SCHEMA DO BANCO DE DADOS - PRISCILLA SANTALENA
-- =====================================================
-- Execute este SQL no Supabase SQL Editor
-- =====================================================

-- 1. Criar tabela de produtos
CREATE TABLE IF NOT EXISTS produtos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    preco_antigo DECIMAL(10, 2),
    categoria VARCHAR(50) NOT NULL,
    estoque INTEGER DEFAULT 0,
    volume VARCHAR(50),
    badge VARCHAR(50),
    imagem_url TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Criar tabela de categorias
CREATE TABLE IF NOT EXISTS categorias (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    ordem INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Criar tabela de imagens de produtos
CREATE TABLE IF NOT EXISTS produto_imagens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    produto_id UUID REFERENCES produtos(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    ordem INTEGER DEFAULT 0,
    principal BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. Criar tabela de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    numero_pedido VARCHAR(20) UNIQUE NOT NULL,
    cliente_nome VARCHAR(255) NOT NULL,
    cliente_email VARCHAR(255) NOT NULL,
    cliente_telefone VARCHAR(50),
    endereco_cep VARCHAR(20),
    endereco_rua TEXT,
    endereco_numero VARCHAR(20),
    endereco_complemento TEXT,
    endereco_cidade VARCHAR(100),
    endereco_estado VARCHAR(50),
    metodo_envio VARCHAR(50),
    valor_envio DECIMAL(10, 2),
    metodo_pagamento VARCHAR(50),
    subtotal DECIMAL(10, 2) NOT NULL,
    desconto DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pendente',
    codigo_promocional VARCHAR(50),
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 5. Criar tabela de itens do pedido
CREATE TABLE IF NOT EXISTS pedido_itens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
    produto_id UUID REFERENCES produtos(id),
    produto_nome VARCHAR(255) NOT NULL,
    quantidade INTEGER NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 6. Criar tabela de códigos promocionais
CREATE TABLE IF NOT EXISTS codigos_promocionais (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    tipo VARCHAR(20) NOT NULL, -- 'percentage', 'fixed', 'shipping'
    valor DECIMAL(10, 2) NOT NULL,
    descricao TEXT,
    data_inicio TIMESTAMP WITH TIME ZONE,
    data_fim TIMESTAMP WITH TIME ZONE,
    limite_uso INTEGER,
    vezes_usado INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 7. Criar tabela de configurações do site
CREATE TABLE IF NOT EXISTS configuracoes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT,
    tipo VARCHAR(50) DEFAULT 'text', -- 'text', 'number', 'boolean', 'json'
    descricao TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================================================
-- INSERIR CATEGORIAS PADRÃO
-- =====================================================

INSERT INTO categorias (nome, slug, descricao, ordem) VALUES
    ('Óleos Essenciais', 'oleos', 'Óleos essenciais puros e de alta qualidade', 1),
    ('Essências Florais', 'essencias', 'Essências florais para equilíbrio emocional', 2),
    ('Difusores', 'difusores', 'Difusores para aromaterapia', 3),
    ('Kits Especiais', 'kits', 'Kits completos para diferentes necessidades', 4)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- INSERIR PRODUTOS PADRÃO
-- =====================================================

INSERT INTO produtos (nome, descricao, preco, categoria, estoque, volume, badge, imagem_url) VALUES
    ('Óleo Essencial de Lavanda', 'Pureza 100%. Ideal para relaxamento e qualidade do sono.', 18.50, 'oleos', 25, '10ml', 'Bestseller', 'images/produtos/oleo-lavanda.jpg'),
    ('Óleo Essencial de Hortelã-Pimenta', 'Energizante e refrescante. Ajuda na concentração.', 15.90, 'oleos', 30, '10ml', NULL, 'images/produtos/oleo-hortelapimenta.jpg'),
    ('Óleo Essencial de Eucalipto', 'Purificador e revigorante. Auxilia na respiração.', 16.50, 'oleos', 20, '10ml', NULL, 'images/produtos/oleo-eucalipto.jpg'),
    ('Essência Floral Rescue', 'Fórmula de emergência para momentos de estresse.', 12.90, 'essencias', 40, '30ml', 'Popular', 'images/produtos/essencia-rescue.jpg'),
    ('Mix Essencial Menopausa', 'Combinação especial para sintomas da menopausa.', 24.90, 'essencias', 15, '30ml', NULL, 'images/produtos/essencia-menopausa.jpg'),
    ('Difusor Cerâmico', 'Design elegante com iluminação LED.', 35.00, 'difusores', 10, NULL, NULL, 'images/produtos/difusor-ceramica.jpg'),
    ('Difusor Ultrassônico', 'Tecnologia silenciosa com 7 cores de LED.', 45.00, 'difusores', 8, NULL, 'Novo', 'images/produtos/difusor-ultrassonico.jpg'),
    ('Kit Relaxamento Completo', '3 óleos essenciais + difusor + guia de uso.', 69.90, 'kits', 12, NULL, 'Oferta', 'images/produtos/kit-relaxamento.jpg'),
    ('Kit Especial Menopausa', 'Seleção exclusiva para equilíbrio hormonal.', 79.90, 'kits', 8, NULL, NULL, 'images/produtos/kit-menopausa.jpg')
ON CONFLICT DO NOTHING;

-- Atualizar preço antigo do kit relaxamento
UPDATE produtos SET preco_antigo = 85.00 WHERE nome = 'Kit Relaxamento Completo';

-- =====================================================
-- INSERIR CÓDIGOS PROMOCIONAIS PADRÃO
-- =====================================================

INSERT INTO codigos_promocionais (codigo, tipo, valor, descricao, ativo) VALUES
    ('PRIMEIRACOMPRA', 'percentage', 10.00, '10% de desconto na primeira compra', true),
    ('BEMVINDA', 'fixed', 5.00, '€5 de desconto', true),
    ('MENOPAUSA20', 'percentage', 20.00, '20% de desconto em produtos para menopausa', true),
    ('FRETEGRATIS', 'shipping', 0.00, 'Frete grátis', true)
ON CONFLICT (codigo) DO NOTHING;

-- =====================================================
-- INSERIR CONFIGURAÇÕES PADRÃO
-- =====================================================

INSERT INTO configuracoes (chave, valor, tipo, descricao) VALUES
    ('site_nome', 'Priscilla Santalena', 'text', 'Nome do site'),
    ('site_email', 'contato@santalena.nl', 'text', 'Email de contato'),
    ('site_telefone', '+31 (0) XX XXX XXXX', 'text', 'Telefone de contato'),
    ('site_whatsapp', '+31XXXXXXXXX', 'text', 'Número do WhatsApp'),
    ('frete_gratis_valor', '50.00', 'number', 'Valor mínimo para frete grátis'),
    ('frete_padrao_valor', '5.90', 'number', 'Valor do frete padrão'),
    ('frete_expresso_valor', '12.50', 'number', 'Valor do frete expresso'),
    ('moeda', 'EUR', 'text', 'Moeda utilizada'),
    ('moeda_simbolo', '€', 'text', 'Símbolo da moeda')
ON CONFLICT (chave) DO NOTHING;

-- =====================================================
-- CRIAR ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria);
CREATE INDEX IF NOT EXISTS idx_produtos_ativo ON produtos(ativo);
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status);
CREATE INDEX IF NOT EXISTS idx_pedidos_email ON pedidos(cliente_email);
CREATE INDEX IF NOT EXISTS idx_produto_imagens_produto_id ON produto_imagens(produto_id);

-- =====================================================
-- CRIAR FUNÇÃO PARA ATUALIZAR updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- CRIAR TRIGGERS PARA updated_at
-- =====================================================

DROP TRIGGER IF EXISTS update_produtos_updated_at ON produtos;
CREATE TRIGGER update_produtos_updated_at
    BEFORE UPDATE ON produtos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pedidos_updated_at ON pedidos;
CREATE TRIGGER update_pedidos_updated_at
    BEFORE UPDATE ON pedidos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_configuracoes_updated_at ON configuracoes;
CREATE TRIGGER update_configuracoes_updated_at
    BEFORE UPDATE ON configuracoes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- CONFIGURAR STORAGE PARA IMAGENS
-- =====================================================

-- Criar bucket para imagens de produtos
-- EXECUTE MANUALMENTE NO SUPABASE DASHBOARD:
-- 1. Vá em Storage
-- 2. Clique em "Create a new bucket"
-- 3. Nome: "produtos"
-- 4. Public: true (para imagens serem acessíveis)

-- =====================================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- =====================================================

-- Habilitar RLS nas tabelas
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE produto_imagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedido_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE codigos_promocionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;

-- Políticas para produtos (público pode ler, apenas admin pode modificar)
CREATE POLICY "Produtos são visíveis para todos" ON produtos
    FOR SELECT USING (ativo = true);

CREATE POLICY "Admins podem inserir produtos" ON produtos
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins podem atualizar produtos" ON produtos
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins podem deletar produtos" ON produtos
    FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para categorias (público pode ler)
CREATE POLICY "Categorias são visíveis para todos" ON categorias
    FOR SELECT USING (ativo = true);

-- Políticas para imagens (público pode ler, apenas admin pode modificar)
CREATE POLICY "Imagens são visíveis para todos" ON produto_imagens
    FOR SELECT USING (true);

CREATE POLICY "Admins podem gerenciar imagens" ON produto_imagens
    FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para pedidos (apenas donos e admins podem ver)
CREATE POLICY "Usuários podem ver seus pedidos" ON pedidos
    FOR SELECT USING (
        cliente_email = auth.jwt() ->> 'email' OR
        auth.role() = 'authenticated'
    );

CREATE POLICY "Qualquer um pode criar pedidos" ON pedidos
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins podem atualizar pedidos" ON pedidos
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Políticas para códigos promocionais (público pode validar, apenas admin pode gerenciar)
CREATE POLICY "Códigos ativos são visíveis" ON codigos_promocionais
    FOR SELECT USING (ativo = true);

CREATE POLICY "Admins podem gerenciar códigos" ON codigos_promocionais
    FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para configurações (público pode ler, apenas admin pode modificar)
CREATE POLICY "Configurações são visíveis para todos" ON configuracoes
    FOR SELECT USING (true);

CREATE POLICY "Admins podem atualizar configurações" ON configuracoes
    FOR UPDATE USING (auth.role() = 'authenticated');

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View de produtos com contagem de imagens
CREATE OR REPLACE VIEW v_produtos_completos AS
SELECT
    p.*,
    COUNT(pi.id) as total_imagens,
    c.nome as categoria_nome
FROM produtos p
LEFT JOIN produto_imagens pi ON p.id = pi.produto_id
LEFT JOIN categorias c ON p.categoria = c.slug
GROUP BY p.id, c.nome;

-- View de estatísticas de vendas
CREATE OR REPLACE VIEW v_estatisticas_vendas AS
SELECT
    COUNT(*) as total_pedidos,
    SUM(total) as receita_total,
    AVG(total) as ticket_medio,
    COUNT(DISTINCT cliente_email) as total_clientes
FROM pedidos
WHERE status != 'cancelado';

-- =====================================================
-- FUNÇÃO PARA GERAR NÚMERO DE PEDIDO
-- =====================================================

CREATE OR REPLACE FUNCTION gerar_numero_pedido()
RETURNS TEXT AS $$
DECLARE
    novo_numero TEXT;
    existe BOOLEAN;
BEGIN
    LOOP
        -- Gerar número aleatório de 6 dígitos
        novo_numero := LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0');
        novo_numero := 'PED-' || novo_numero;

        -- Verificar se já existe
        SELECT EXISTS(SELECT 1 FROM pedidos WHERE numero_pedido = novo_numero) INTO existe;

        -- Se não existe, retornar
        IF NOT existe THEN
            RETURN novo_numero;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- CONCLUÍDO!
-- =====================================================
-- Próximos passos:
-- 1. Execute este SQL no Supabase SQL Editor
-- 2. Crie um bucket "produtos" no Storage
-- 3. Configure as policies do bucket para permitir upload
-- 4. Crie um usuário admin no Authentication
-- =====================================================
