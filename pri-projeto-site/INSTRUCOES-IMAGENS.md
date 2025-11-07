# 📸 Instruções para Adicionar Imagens

Este documento explica onde e como adicionar as imagens necessárias para o site.

## 📁 Estrutura de Pastas para Imagens

```
pri-projeto-site/
├── images/
│   ├── priscilla.jpg                    # Foto de perfil da terapeuta
│   ├── hero-background.jpg              # Imagem de fundo do hero (opcional)
│   └── produtos/
│       ├── oleo-lavanda.jpg
│       ├── oleo-hortelapimenta.jpg
│       ├── oleo-eucalipto.jpg
│       ├── essencia-rescue.jpg
│       ├── essencia-menopausa.jpg
│       ├── difusor-ceramica.jpg
│       ├── difusor-ultrassonico.jpg
│       ├── kit-relaxamento.jpg
│       └── kit-menopausa.jpg
```

## 🖼️ Imagens Necessárias

### 1. Página Principal

#### Foto de Perfil (priscilla.jpg)
- **Localização**: `images/priscilla.jpg`
- **Tamanho recomendado**: 800x800px
- **Formato**: JPG ou PNG
- **Peso máximo**: 500KB
- **Descrição**: Foto profissional da Priscilla Santalena para a seção "Sobre Mim"

#### Hero Background (opcional)
- **Localização**: `images/hero-background.jpg`
- **Tamanho recomendado**: 1920x1080px
- **Formato**: JPG
- **Peso máximo**: 300KB
- **Descrição**: Imagem de fundo para a seção hero (atualmente usa gradient)

### 2. Produtos

Todas as imagens de produtos devem estar em `images/produtos/`

#### Óleos Essenciais

**oleo-lavanda.jpg**
- Tamanho: 600x600px
- Frasco de óleo essencial de lavanda

**oleo-hortelapimenta.jpg**
- Tamanho: 600x600px
- Frasco de óleo essencial de hortelã-pimenta

**oleo-eucalipto.jpg**
- Tamanho: 600x600px
- Frasco de óleo essencial de eucalipto

#### Essências Florais

**essencia-rescue.jpg**
- Tamanho: 600x600px
- Frasco da essência floral Rescue

**essencia-menopausa.jpg**
- Tamanho: 600x600px
- Frasco do mix especial para menopausa

#### Difusores

**difusor-ceramica.jpg**
- Tamanho: 600x600px
- Difusor cerâmico com LED

**difusor-ultrassonico.jpg**
- Tamanho: 600x600px
- Difusor ultrassônico moderno

#### Kits

**kit-relaxamento.jpg**
- Tamanho: 600x600px
- Conjunto completo do kit de relaxamento

**kit-menopausa.jpg**
- Tamanho: 600x600px
- Conjunto completo do kit especial menopausa

## 🎨 Especificações Técnicas

### Dimensões Recomendadas
- **Produtos**: 600x600px (quadrado, 1:1)
- **Perfil**: 800x800px (quadrado, 1:1)
- **Hero**: 1920x1080px (retangular, 16:9)

### Formatos Aceitos
- **Primário**: JPG (melhor compressão para fotos)
- **Alternativo**: PNG (se precisar transparência)
- **Moderno**: WebP (melhor otimização, mas requer conversão)

### Otimização
- **Resolução**: 72 DPI (para web)
- **Perfil de Cor**: sRGB
- **Compressão**: Média/Alta (manter qualidade visível)
- **Peso**: Máximo 500KB por imagem

## 🛠️ Ferramentas de Otimização

### Online (Grátis)
1. **TinyPNG** - https://tinypng.com/
   - Compressão inteligente de PNG e JPG
   - Reduz até 70% do tamanho sem perda visível

2. **Squoosh** - https://squoosh.app/
   - Ferramenta do Google
   - Comparação lado a lado
   - Múltiplos formatos

3. **Compressor.io** - https://compressor.io/
   - Compressão rápida
   - Suporta JPG, PNG, SVG, GIF

### Desktop
1. **GIMP** (Grátis)
   - Editor completo
   - Redimensionar e exportar otimizado

2. **Adobe Photoshop**
   - Save for Web (Legacy)
   - Export As...

3. **ImageOptim** (Mac, Grátis)
   - Arraste e solte
   - Otimização automática

## 📋 Checklist de Imagens

- [ ] Foto de perfil (priscilla.jpg)
- [ ] Óleo de Lavanda
- [ ] Óleo de Hortelã-Pimenta
- [ ] Óleo de Eucalipto
- [ ] Essência Rescue
- [ ] Essência Menopausa
- [ ] Difusor Cerâmico
- [ ] Difusor Ultrassônico
- [ ] Kit Relaxamento
- [ ] Kit Menopausa

## 🚀 Como Adicionar as Imagens

### Passo a Passo:

1. **Prepare as imagens**
   - Renomeie seguindo os nomes exatos acima
   - Otimize usando uma das ferramentas sugeridas
   - Verifique as dimensões

2. **Crie as pastas** (se ainda não existirem)
   ```bash
   mkdir -p images/produtos
   ```

3. **Copie as imagens**
   - Coloque `priscilla.jpg` em `images/`
   - Coloque as imagens dos produtos em `images/produtos/`

4. **Teste no navegador**
   - Abra `index.html`
   - Abra `produtos.html`
   - Verifique se todas as imagens aparecem

## 💡 Dicas Importantes

### Para Fotos de Produtos:
- ✅ Use fundo branco ou neutro
- ✅ Boa iluminação natural ou profissional
- ✅ Produto centralizado
- ✅ Foco nítido
- ✅ Ângulo que mostre o produto claramente

### Para Foto de Perfil:
- ✅ Foto profissional e atual
- ✅ Boa iluminação
- ✅ Expressão amigável e confiante
- ✅ Fundo neutro ou desfocado
- ✅ Enquadramento do busto

## 🎨 Alternativas Temporárias

Se ainda não tiver as imagens prontas, você pode usar:

### 1. Placeholder.com
```html
<img src="https://via.placeholder.com/600x600/8B6F47/FFFFFF?text=Produto">
```

### 2. Unsplash (fotos stock gratuitas)
- https://unsplash.com/s/photos/essential-oils
- https://unsplash.com/s/photos/aromatherapy
- Crédito ao fotógrafo é apreciado

### 3. Pexels (fotos stock gratuitas)
- https://www.pexels.com/search/essential%20oils/

## ❓ Precisa de Ajuda?

Se precisar de ajuda para:
- Redimensionar imagens
- Otimizar para web
- Criar composições
- Editar fotos

Entre em contato: contato@santalena.nl

---

**Lembre-se**: Imagens de qualidade aumentam a confiança do cliente e melhoram as conversões! 📈
