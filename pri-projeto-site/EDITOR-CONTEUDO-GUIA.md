# 📝 Guia do Editor de Conteúdo

## ✅ Implementação Completa - Fase 1

Foram implementadas as seguintes funcionalidades no painel admin:

### 1. **Editor de Seção Hero**
### 2. **Editor de Seção Sobre Mim**
### 3. **Upload e Gerenciamento de Logo**

---

## 🚀 Como Usar

### **Passo 1: Executar SQL no Supabase**

1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Vá em **SQL Editor**
3. Copie e execute o conteúdo do arquivo: `supabase-site-config.sql`
4. Isso criará:
   - Tabela `site_config`
   - Políticas de segurança (RLS)
   - Dados padrão para Hero, Sobre e Logo

---

### **Passo 2: Acessar o Painel Admin**

1. Abra: `admin-login.html`
2. Faça login com suas credenciais
3. No menu lateral, clique em: **📝 Conteúdo do Site**

---

## 📋 Funcionalidades Implementadas

### **🖼️ Tab 1: Logo**

**Opções disponíveis:**
- ☑️ **Usar imagem como logo**: Checkbox para escolher entre logo em imagem ou texto
- 📤 **Upload do Logo**: Formatos PNG, JPG, SVG (recomendado: PNG transparente)
- ✍️ **Texto do Logo**: Campo para texto alternativo (quando não usar imagem)
- 🏷️ **Tagline**: Subtítulo abaixo do logo

**Como funciona:**
1. Marque "Usar imagem como logo" para fazer upload
2. Selecione a imagem do seu computador
3. Veja o preview antes de salvar
4. Clique em "💾 Salvar Logo"

---

### **🎯 Tab 2: Seção Hero (Banner Principal)**

**Campos editáveis:**
- **Título Principal**: Texto grande do banner
- **Subtítulo**: Descrição abaixo do título
- **Botão Primário**: Texto e link do botão de ação principal
- **Botão Secundário**: Texto e link do botão secundário
- **Imagem de Fundo**: Upload de imagem para background (mínimo 1920x1080px)
- **Opacidade do Overlay**: Controle de escurecimento da imagem (0.0 a 1.0)

**Exemplo de uso:**
```
Título: "Bem-vinda ao Equilíbrio e Energia"
Subtítulo: "Ajudo mulheres na (peri)menopausa..."
Botão Primário: "Agende sua Consulta" → #contato
Botão Secundário: "Conheça os Serviços" → #servicos
Overlay: 0.7 (70% de escurecimento)
```

---

### **👤 Tab 3: Seção Sobre Mim**

**Campos editáveis:**
- **Nome**: Seu nome completo
- **Texto em Destaque**: Informação destacada (ex: nascimento, formação)
- **Introdução da Biografia**: Primeiro parágrafo sobre você
- **Texto antes da lista**: Frase antes das especializações
- **Especializações**: Uma por linha (será convertida em lista com ✓)
- **Texto Final**: Rodapé da biografia (registros, certificações)
- **Foto de Perfil**: Upload de imagem quadrada (mínimo 500x500px)

**Exemplo de especializações:**
```
Essencioterapia
Aromaterapia
Reiki (Níveis I, II e Mestre)
```

Será exibido como:
```
✓ Essencioterapia
✓ Aromaterapia
✓ Reiki (Níveis I, II e Mestre)
```

---

## 🎨 Preview e Atualização em Tempo Real

### **Como ver as mudanças:**

1. Edite o conteúdo no painel admin
2. Clique em "💾 Salvar"
3. Abra o site em outra aba (`index.html`)
4. Recarregue a página (F5)
5. As alterações aparecerão automaticamente!

### **Sistema de Preview:**
- Ao fazer upload de imagens, você vê o preview antes de salvar
- Todas as imagens são armazenadas no Supabase Storage
- URLs públicas são geradas automaticamente

---

## 🔒 Segurança e Permissões

### **Quem pode editar:**
- ✅ Apenas usuários autenticados (admin)
- ✅ RLS (Row Level Security) ativado no Supabase

### **Quem pode ver:**
- ✅ Qualquer visitante do site (leitura pública)

---

## 📦 Estrutura de Arquivos Criados

```
/pri-projeto-site/
├── supabase-site-config.sql      # Schema SQL
├── js/
│   ├── site-config.js            # Funções de gerenciamento (Admin)
│   └── load-site-config.js       # Carregador para o site público
├── admin-dashboard.html          # Atualizado com nova aba "Conteúdo"
└── index.html                    # Atualizado para carregar configs dinamicamente
```

---

## 🐛 Solução de Problemas

### **Problema: Mudanças não aparecem no site**
**Solução:**
1. Verifique se executou o SQL no Supabase
2. Limpe o cache do navegador (Ctrl+Shift+Del)
3. Verifique o console do navegador (F12) para erros
4. Confirme que o Supabase está configurado corretamente

### **Problema: Erro ao fazer upload de imagem**
**Solução:**
1. Verifique se o bucket existe no Supabase Storage
2. Execute: `supabase-storage-policies.sql`
3. Confirme que as políticas de upload estão ativas
4. Tamanho máximo: 5MB por imagem

### **Problema: Página "Conteúdo" não aparece**
**Solução:**
1. Limpe o cache do navegador
2. Faça logout e login novamente
3. Verifique se todos os arquivos JS estão carregando

---

## 🎯 Próximos Passos (Fase 2)

Funcionalidades ainda não implementadas:

### **4. Upload de Carrossel de Imagens**
- Gerenciar múltiplas imagens
- Ordenar por drag-and-drop
- Preview antes de publicar

### **5. Editor Visual de Cores**
- Color pickers para tema
- Preview em tempo real
- Gerenciar gradientes
- Salvar variações de tema

---

## 💡 Dicas de Uso

### **Imagens otimizadas:**
- **Logo**: PNG transparente, máx 200KB
- **Hero**: JPG/PNG 1920x1080px, máx 500KB
- **Perfil**: JPG/PNG 500x500px, máx 300KB

### **Boas práticas:**
- Sempre faça backup antes de grandes mudanças
- Teste em dispositivos móveis após editar
- Use textos concisos e diretos
- Mantenha consistência visual

### **Acessibilidade:**
- Use descrições claras nos botões
- Contraste adequado (overlay 0.6 a 0.8)
- Evite textos muito longos

---

## 📞 Suporte

Se precisar de ajuda:
1. Verifique este guia
2. Consulte a documentação do Supabase
3. Cheque o console do navegador para erros específicos

**Arquivos SQL importantes:**
- `supabase-site-config.sql` - Configurações do site
- `supabase-storage-policies.sql` - Permissões de upload
- `supabase-schema.sql` - Tabelas principais

---

## ✅ Checklist de Implementação

- [x] Criar tabela `site_config`
- [x] Implementar Editor Hero
- [x] Implementar Editor Sobre
- [x] Implementar Upload Logo
- [x] Sistema de tabs
- [x] Preview de imagens
- [x] Integração com Supabase
- [x] Atualização dinâmica do site
- [ ] Upload Carrossel (Fase 2)
- [ ] Editor de Cores (Fase 2)

---

**Versão:** 1.0
**Data:** Novembro 2024
**Status:** ✅ Fase 1 Completa
