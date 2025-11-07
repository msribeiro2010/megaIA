# 🔐 Como Acessar o Painel Admin

## ✅ 3 FORMAS DE ACESSAR:

### 1️⃣ **Pelo Footer do Site (NOVO!)**
No rodapé de qualquer página, procure o link **"Admin"** em dourado:

```
© 2024 Priscilla Santalena. Todos os direitos reservados. | Admin
                                                              ↑↑↑↑↑
```

Páginas com o link:
- ✅ http://localhost:8000/ (Home)
- ✅ http://localhost:8000/produtos.html

---

### 2️⃣ **Diretamente pela URL**
Digite no navegador:
```
http://localhost:8000/admin-login.html
```

---

### 3️⃣ **URL Memorável (Opcional)**
Você pode criar um bookmark/favorito com o nome "Admin" apontando para:
```
http://localhost:8000/admin-login.html
```

---

## 🔑 CREDENCIAIS DE LOGIN:

### Você precisa ter criado no Supabase:
1. Acesse: https://supabase.com/dashboard
2. Seu projeto → **Authentication** → **Users**
3. **Add user** → **Create new user**
4. Email: `admin@santalena.nl` (ou qualquer email)
5. Senha: (escolha uma senha forte)
6. ✅ Marcar: **Auto Confirm User**
7. **Create user**

---

## 📊 APÓS LOGIN:

Você terá acesso ao painel com:
- ✅ Dashboard (estatísticas)
- ✅ Gerenciar Produtos
- ✅ Gerenciar Pedidos
- ✅ Cupons Promocionais
- ✅ Configurações
- ⏳ Visual (próxima sessão)

---

## 🎨 LINK ADMIN NO FOOTER:

O link aparece discretamente no footer com:
- Cor dourada (#d4a574)
- Sem sublinhado
- Discreto mas acessível

### Estilo aplicado:
```html
<a href="admin-login.html"
   style="color: var(--cor-destaque); text-decoration: none;">
   Admin
</a>
```

---

## 🔒 SEGURANÇA:

### O link é discreto porque:
1. Está no footer (pouco visível para visitantes)
2. Requer autenticação (Supabase)
3. Protegido por RLS (Row Level Security)
4. Apenas usuários cadastrados têm acesso

### Alternativa mais segura:
Se quiser esconder completamente, pode:
1. Remover o link do footer
2. Criar um caminho secreto tipo: `admin-secret-xyz123.html`
3. Ou manter apenas acesso via URL direta

---

## 🚀 TESTE AGORA:

1. Abra: http://localhost:8000/
2. Role até o final da página (footer)
3. Veja o link **"Admin"** em dourado
4. Clique para ir ao login
5. Faça login com suas credenciais

---

**Pronto! Agora você pode acessar o admin facilmente!** 🎉
