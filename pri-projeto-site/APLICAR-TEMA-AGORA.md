# 🚀 Aplicar Tema Santalena AGORA - Guia Rápido

## ✅ PASSO 1: Executar SQL no Supabase (2 minutos)

### Execute ESTE código no Supabase SQL Editor:

```sql
-- Copie e cole TODO este bloco no SQL Editor do Supabase

-- Criar tabela secoes_site
CREATE TABLE IF NOT EXISTS secoes_site (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    secao VARCHAR(50) NOT NULL UNIQUE,
    titulo TEXT,
    subtitulo TEXT,
    descricao TEXT,
    imagem_url TEXT,
    imagens_carrossel JSONB,
    conteudo_html TEXT,
    cta_texto VARCHAR(100),
    cta_link VARCHAR(255),
    ativo BOOLEAN DEFAULT true,
    ordem INTEGER DEFAULT 0,
    config_extra JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela config_visual
CREATE TABLE IF NOT EXISTS config_visual (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chave VARCHAR(100) NOT NULL UNIQUE,
    valor TEXT,
    tipo VARCHAR(50),
    categoria VARCHAR(50),
    descricao TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Inserir seções padrão
INSERT INTO secoes_site (secao, titulo, subtitulo, descricao, ordem, ativo) VALUES
('hero', 'Bem-vindo à Terapia Holística', 'Encontre seu equilíbrio e bem-estar', 'Descubra o poder da aromaterapia e essencioterapia para transformar sua vida', 1, true),
('sobre', 'Sobre Priscilla Santalena', 'Terapeuta Holística Certificada', 'Com mais de 10 anos de experiência em terapias complementares, ajudo pessoas a encontrarem equilíbrio emocional e bem-estar através de técnicas naturais.', 2, true),
('servicos', 'Serviços', 'Terapias Personalizadas', 'Oferecemos uma variedade de serviços holísticos para atender suas necessidades específicas', 3, true)
ON CONFLICT (secao) DO NOTHING;

-- Inserir configurações visuais (cores Santalena)
INSERT INTO config_visual (chave, valor, tipo, categoria, descricao) VALUES
('cor_primaria', '#031e1e', 'cor', 'cores', 'Verde escuro principal'),
('cor_secundaria', '#1a3232', 'cor', 'cores', 'Verde médio'),
('cor_destaque', '#8B6F47', 'cor', 'cores', 'Terracota destaque'),
('mostrar_relogio', 'true', 'texto', 'recursos', 'Mostrar relógio'),
('mostrar_data', 'true', 'texto', 'recursos', 'Mostrar data')
ON CONFLICT (chave) DO NOTHING;

-- Habilitar RLS
ALTER TABLE secoes_site ENABLE ROW LEVEL SECURITY;
ALTER TABLE config_visual ENABLE ROW LEVEL SECURITY;

-- Remover policies antigas (se existirem)
DROP POLICY IF EXISTS "Leitura pública secoes" ON secoes_site;
DROP POLICY IF EXISTS "Leitura pública config" ON config_visual;
DROP POLICY IF EXISTS "Admin total secoes" ON secoes_site;
DROP POLICY IF EXISTS "Admin total config" ON config_visual;

-- Criar políticas novas
CREATE POLICY "Leitura pública secoes" ON secoes_site FOR SELECT USING (ativo = true);
CREATE POLICY "Leitura pública config" ON config_visual FOR SELECT USING (true);
CREATE POLICY "Admin total secoes" ON secoes_site FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin total config" ON config_visual FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

### Como executar:
1. Abra: https://supabase.com/dashboard
2. Selecione seu projeto
3. Menu → **SQL Editor**
4. **New query**
5. Cole TODO o código acima
6. Clique em **RUN** ▶️
7. ✅ Deve aparecer "Success" ou "completed successfully"

---

## ✅ PASSO 2: Ver as Mudanças (IMEDIATAMENTE!)

### Recarregue a página:
```
http://localhost:8000/
```

Pressione `Ctrl + Shift + R` para limpar cache

---

## 🎨 O QUE VOCÊ VERÁ:

### ✅ Mudanças Visuais Imediatas:

1. **Header com gradiente verde escuro**
   - Fundo: Verde #031e1e → #1a3232 → #2d4a4a
   - Links com efeito hover elegante

2. **Hero Section estilizado**
   - Gradiente verde de fundo
   - Ondas decorativas
   - Tipografia elegante (Lora + Montserrat)

3. **Rel\u00f3gio e Data** (canto superior direito)
   - Horário em tempo real
   - Data formatada em português
   - Fuso horário: Amsterdam

4. **Cores aplicadas em todo o site**:
   - Verde escuro: #031e1e
   - Verde médio: #1a3232
   - Terracota: #8B6F47
   - Fundos bege: #fcf5ee

5. **Fontes elegantes**:
   - Títulos: Lora (serifada)
   - Corpo: Montserrat (sans-serif)

---

## 🔍 Verificar se Funcionou:

### No Console do Navegador (F12):
Deve aparecer:
```
✅ Supabase inicializado com sucesso
✅ Relógio inicializado com configurações do Supabase
```

### Visualmente:
- ✅ Header verde escuro gradiente
- ✅ Relógio no canto superior direito
- ✅ Hero section com gradiente
- ✅ Botões com cor terracota (#8B6F47)
- ✅ Fontes mais elegantes

---

## 🚨 Se NÃO Aparecer:

### 1. Limpar Cache do Navegador:
```
Ctrl + Shift + Delete
→ Marcar "Imagens e arquivos em cache"
→ Limpar dados
```

### 2. Recarregar com força:
```
Ctrl + Shift + R (ou Cmd + Shift + R no Mac)
```

### 3. Verificar Console (F12):
- Se houver erros em vermelho, me avise

---

## 📊 Verificar Tabelas no Supabase:

1. Supabase → **Table Editor**
2. Deve ver:
   - ✅ `secoes_site` (3 registros)
   - ✅ `config_visual` (5+ registros)

---

## 💡 Próximo Passo:

Depois que confirmar que o tema está aplicado, posso:

1. ✅ Criar interface admin para editar seções
2. ✅ Sistema de upload de imagens (Hero carrossel, Logo)
3. ✅ Editor visual de cores
4. ✅ Gerenciar conteúdo dinamicamente

---

**Execute o SQL AGORA e me diga o resultado!** 🚀

O tema já está conectado ao `index.html`, só falta criar as tabelas no Supabase!
