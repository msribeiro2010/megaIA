# 🎨 Setup: Gerenciamento Visual do Admin

## 📋 O que está sendo criado:

### ✅ Funcionalidades do Painel Admin:

1. **Gerenciamento de Seções**:
   - 🏠 Hero (Carrossel de imagens)
   - 👤 Sobre Mim (Foto + texto)
   - 💼 Serviços
   - 💬 Depoimentos

2. **Configurações Visuais**:
   - 🎨 Logo e Favicon
   - 🌈 Paleta de Cores (tema verde Santalena)
   - 📝 Tipografia (fontes elegantes)
   - ⏰ Relógio e Data

3. **Upload de Imagens**:
   - Carrossel Hero (múltiplas imagens)
   - Foto Sobre Mim
   - Logo do site
   - Favicon

---

## 🚀 Passo 1: Executar SQL no Supabase

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Clique em **New query**
5. Copie TODO o conteúdo de `supabase-visual-config.sql`
6. Cole e clique em **RUN**

### ✅ Deve criar:
- 2 novas tabelas: `secoes_site` e `config_visual`
- 4 seções padrão (Hero, Sobre, Serviços, Depoimentos)
- 25+ configurações visuais (cores, fontes, layout)

---

## 🎨 Tema Aplicado: Santalena

### Paleta de Cores:
```
Verde Escuro:    #031e1e (Principal)
Verde Médio:     #1a3232 (Secundária)
Verde Claro:     #2d4a4a (Terciária)
Terracota:       #8B6F47 (Destaque)
Bege Creme:      #fcf5ee (Fundo)
Bege Escuro:     #eee7dc (Fundo Alt)
```

### Gradiente Hero:
```css
linear-gradient(135deg, #031e1e 0%, #1a3232 50%, #2d4a4a 100%)
```

### Tipografia:
- **Títulos**: Lora (serifada, elegante)
- **Corpo**: Montserrat (moderna, legível)

---

## 📊 Estrutura das Tabelas:

### `secoes_site`
```
- id (UUID)
- secao (hero, sobre, servicos, etc.)
- titulo
- subtitulo
- descricao
- imagem_url
- imagens_carrossel (array JSON)
- conteudo_html
- cta_texto / cta_link
- ativo, ordem
```

### `config_visual`
```
- id (UUID)
- chave (cor_primaria, site_logo, etc.)
- valor
- tipo (imagem, cor, texto)
- categoria (branding, cores, tipografia)
```

---

## 🔧 Próximos Passos (em desenvolvimento):

- [ ] Interface Admin para gerenciar seções
- [ ] Editor de carrossel Hero
- [ ] Upload de logo e favicon
- [ ] Seletor de cores visual
- [ ] Preview em tempo real
- [ ] Aplicar tema no site principal
- [ ] Adicionar relógio/data

---

## 📝 Uso no Admin:

### Editar Hero:
1. Admin → **Visual** → **Hero**
2. Upload múltiplas imagens
3. Editar título e subtitulo
4. Salvar

### Editar Sobre Mim:
1. Admin → **Visual** → **Sobre**
2. Upload foto
3. Editar biografia
4. Salvar

### Personalizar Cores:
1. Admin → **Visual** → **Tema**
2. Selecionar cores
3. Aplicar

---

**Status**: 🚧 Em desenvolvimento
**Próxima atualização**: Interfaces admin + CSS tema
