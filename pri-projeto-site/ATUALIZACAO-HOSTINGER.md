# 🔄 Guia de Atualização do Site na Hostinger

## 📋 Opções de Atualização

### ⭐ Opção 1: Upload Manual (Arquivos Específicos)

**Melhor para:** 1-3 arquivos alterados

#### Passo a Passo:
1. Login: https://hpanel.hostinger.com
2. **Arquivos** → **Gerenciador de Arquivos**
3. Navegue até a pasta do arquivo
4. Clique em **Upload**
5. Selecione o arquivo modificado
6. Confirme **Sobrescrever**

#### Exemplos:
```
Mudou CSS?
→ Upload: css/style.css

Mudou JavaScript?
→ Upload: js/main.js

Mudou HTML?
→ Upload: index.html
```

---

### ⭐⭐ Opção 2: FTP com FileZilla (RECOMENDADO)

**Melhor para:** Múltiplas alterações frequentes

#### 1. Instalar FileZilla
- Download: https://filezilla-project.org
- Instalar e abrir

#### 2. Obter Credenciais FTP
No hPanel da Hostinger:
1. Menu → **Arquivos** → **Contas FTP**
2. Clique em **Configurar conta FTP**
3. Anote as credenciais:
   ```
   Host: ftp.seudominio.com (ou IP)
   Usuário: usuario@seudominio.com
   Senha: sua-senha-ftp
   Porta: 21
   ```

#### 3. Conectar no FileZilla
1. Abra o FileZilla
2. Preencha no topo:
   - **Host:** ftp.seudominio.com
   - **Usuário:** seu-usuario
   - **Senha:** sua-senha
   - **Porta:** 21
3. Clique **Conexão Rápida**

#### 4. Sincronizar Arquivos (Automático)
1. **Local** (esquerda): Pasta do seu projeto
2. **Remoto** (direita): `/public_html`
3. Menu → **Arquivo** → **Sincronizar Diretórios**
4. Configurar:
   ```
   ✅ Upload de arquivos modificados
   ✅ Excluir arquivos locais inexistentes
   ⬜ Baixar arquivos
   ```
5. Clique **OK**
6. FileZilla mostra APENAS arquivos alterados!
7. Confirme upload

#### 5. Upload Manual no FileZilla
- Arraste arquivos da **esquerda** (local) para **direita** (servidor)
- Pronto! ✅

---

### ⭐⭐⭐ Opção 3: Git Deploy Automático

**Melhor para:** Desenvolvimento profissional com controle de versão

#### Método A: GitHub → Hostinger (Via SSH)

**Pré-requisitos:**
- Acesso SSH habilitado na Hostinger
- Git instalado localmente

#### 1. Habilitar SSH na Hostinger
1. hPanel → **Avançado** → **SSH Access**
2. Ativar acesso SSH
3. Anotar: Host, Porta, Usuário

#### 2. Conectar via SSH
```bash
ssh usuario@host -p porta
```

#### 3. Clonar Repositório
```bash
cd /home/usuario/public_html
git clone https://github.com/msribeiro2010/pri-santalena.git .
```

#### 4. Script de Deploy Automático

Criar arquivo `deploy.sh` na Hostinger:

```bash
#!/bin/bash
cd /home/usuario/public_html
git pull origin main
echo "✅ Deploy concluído!"
```

Dar permissão:
```bash
chmod +x deploy.sh
```

#### 5. Atualizar Site
Sempre que alterar no GitHub:
```bash
ssh usuario@host -p porta
cd /home/usuario/public_html
./deploy.sh
```

**Ou configurar Webhook do GitHub para deploy automático!**

#### Método B: Deploy Local → GitHub → Hostinger

**Workflow Completo:**

```bash
# 1. Fazer alterações localmente
# 2. Testar localmente

# 3. Commit e push para GitHub
git add .
git commit -m "Descrição das mudanças"
git push origin main

# 4. SSH na Hostinger e pull
ssh usuario@host -p porta
cd /home/usuario/public_html
git pull origin main
```

---

## 🎯 Qual Opção Usar?

### Uso Ocasional (1x por semana):
✅ **Opção 1** - Upload Manual
- Rápido
- Simples
- Sem configuração

### Uso Frequente (várias vezes por semana):
✅ **Opção 2** - FileZilla
- Sincronização automática
- Vê o que mudou
- Mais organizado

### Uso Profissional (diário, múltiplos devs):
✅ **Opção 3** - Git Deploy
- Controle de versão
- Deploy automático
- Histórico completo
- Rollback fácil

---

## 📝 Workflow Recomendado

### Para Você (Solo):

**Desenvolvimento:**
1. Trabalhe localmente
2. Teste no navegador (localhost)
3. Commit no Git quando funcionar

**Deploy:**
- **Mudanças pequenas**: FileZilla (Opção 2)
- **Mudanças grandes**: Git SSH (Opção 3)

### Estrutura Sugerida:
```
Trabalho Local → GitHub → Hostinger
     ↓              ↓           ↓
   Edita        Backup      Produção
```

---

## 🔧 Ferramentas Úteis

### VS Code + SFTP Extension

**Alternativa ao FileZilla:**

1. Instalar extensão: **SFTP** (by Natizyskunk)
2. Configurar `.vscode/sftp.json`:
```json
{
    "name": "Hostinger",
    "host": "ftp.seudominio.com",
    "protocol": "ftp",
    "port": 21,
    "username": "usuario@seudominio.com",
    "password": "sua-senha",
    "remotePath": "/public_html",
    "uploadOnSave": true
}
```

3. **Upload automático ao salvar arquivo!** 🚀

---

## 🆘 Problemas Comuns

### ❌ "Arquivo não atualiza no site"

**Causa:** Cache do navegador

**Solução:**
1. Ctrl + Shift + R (hard refresh)
2. Ou limpar cache do navegador
3. Ou adicionar `?v=2` na URL do arquivo CSS/JS

Exemplo no HTML:
```html
<link rel="stylesheet" href="css/style.css?v=2">
```

### ❌ "Mudanças sumem após upload"

**Causa:** Editou arquivo errado ou pasta errada

**Solução:**
1. Confirme que está em `/public_html`
2. Não em `/public_html/site/` ou outra subpasta
3. Use FileZilla para ver estrutura completa

### ❌ "FTP não conecta"

**Solução:**
1. Verifique credenciais no hPanel
2. Tente porta 21 ou 22 (SFTP)
3. Desative firewall temporariamente
4. Use modo passivo no FileZilla

---

## 📊 Comparação Rápida

| Método | Velocidade | Facilidade | Controle | Recomendado Para |
|--------|-----------|-----------|----------|------------------|
| Upload Manual | ⭐⭐ | ⭐⭐⭐ | ⭐ | Mudanças raras |
| FileZilla | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ | Uso frequente |
| Git SSH | ⭐⭐⭐ | ⭐ | ⭐⭐⭐ | Profissional |
| VS Code SFTP | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | Desenvolvedores |

---

## ✅ Checklist de Atualização

Antes de fazer upload:

- [ ] Testei localmente?
- [ ] Código funciona sem erros?
- [ ] Fiz backup do arquivo original?
- [ ] Sei qual arquivo mudou?
- [ ] Anotei a versão atual?

Após upload:

- [ ] Testei no site online?
- [ ] Hard refresh (Ctrl + Shift + R)?
- [ ] Funciona em mobile?
- [ ] Sem erros no console?

---

## 🎓 Dica Pro

**Crie um arquivo `CHANGELOG.md` para registrar mudanças:**

```markdown
# Changelog

## [1.1.0] - 2025-11-08
### Alterado
- Design modernizado com gradientes
- Header transparente
- Responsividade melhorada

### Arquivos modificados
- css/style.css
- css/theme-santalena.css
- index.html

## [1.0.0] - 2025-11-07
### Inicial
- Lançamento do site
```

Isso ajuda a saber o que mudou em cada versão!

---

**Precisa de ajuda? Consulte:**
- Hostinger Suporte: https://www.hostinger.com.br/tutoriais
- FileZilla Guide: https://wiki.filezilla-project.org
