# Auth vs Onboarding — Análise e Plano de Integração

## 1. O que é cada um

### Autenticação (`src/features/auth/`)
**Propósito:** Decidir *quem* pode usar o app.

| Arquivo | Responsabilidade |
|---|---|
| `AuthContext.jsx` | Provedor com estado `user`, login/logout/signup |
| `authContext.js` | Criação do contexto React (separado do provedor) |
| `AuthView.jsx` | Tela de login/cadastro (e-mail + senha) |
| `hooks/useAuth.js` | Hook consumidor do contexto |

**Como funciona:**
- Armazena lista de usuários em `localStorage` (`app_study_users`)
- Persiste sessão ativa em `auth:userProfile`
- Bloqueia acesso ao app inteiro enquanto `isAuthenticated === false`
- É 100% **client-side** (sem backend real) — senhas armazenadas em texto puro no localStorage

**Status atual:** Desativado. AuthProvider removido do App.jsx; guard comentado no AppShell.

---

### Onboarding (`src/features/onboarding/`)
**Propósito:** Coletar *configurações iniciais* de um usuário já autenticado (ou anônimo).

| Dado coletado | Chave no localStorage |
|---|---|
| Nome | `onboarding:profile` |
| Data da prova | `onboarding:profile` |
| Matérias prioritárias | `onboarding:profile` |
| Tema visual | `themeKey` |
| Modo escuro | `darkMode` |

**Como funciona:**
- Wizard de 3 passos (nome + data → matérias → tema)
- Salva `onboarding:completed = true` ao finalizar
- Bloqueia o app enquanto `onboardingDone === false`
- Dados ficam anônimos — não vinculados a nenhum usuário

**Status atual:** Bypassed. Default do estado trocado para `true`, fazendo o wizard nunca aparecer.

---

## 2. Diferença fundamental

| Dimensão | Autenticação | Onboarding |
|---|---|---|
| Pergunta que responde | "Você pode entrar?" | "Como você quer que o app funcione?" |
| Dados que coleta | E-mail + Senha | Nome, data de prova, matérias, tema |
| Momento de execução | Antes de qualquer coisa | Após autenticação (ou 1x para usuário anônimo) |
| Repetição | Toda sessão (login) | Apenas na primeira vez |
| Bloqueio | Acesso total ao app | Acesso total ao app |
| Dado vinculado a usuário | Sim | Não (hoje) |

**Problema atual:** como os dados do onboarding são salvos de forma anônima no localStorage, 
se dois usuários usarem o mesmo navegador eles vão compartilhar perfil, progresso e configurações.

---

## 3. O que pode ser feito — opções

### Opção A — Remover auth permanentemente (app local/anônimo)
> App funciona sem conta, como um diário de estudos local.

- [ ] Confirmar que o produto é single-user por design
- [ ] Remover arquivos de auth (`src/features/auth/`) do repositório
- [ ] Simplificar o onboarding (nome vira só personalização, não identidade)
- [ ] Garantir que backup/export de dados funcione sem conta

**Prós:** Simples, sem fricção, sem problema de segurança de senha no localStorage  
**Contras:** Não é possível sincronizar entre dispositivos, sem multi-usuário

---

### Opção B — Integrar onboarding dentro do fluxo de auth
> Usuário cria conta → em seguida faz onboarding → entra no app.

- [ ] Após `signup` bem-sucedido, redirecionar para `OnboardingWizard`
- [ ] Vincular `onboarding:profile` ao `userId` (ex: `onboarding:profile:${userId}`)
- [ ] Após `login`, verificar se onboarding daquele usuário já foi feito
- [ ] Tornar o `AuthProvider` consciente do estado de onboarding (ou criar um `AppFlowProvider`)

**Prós:** Multi-usuário funcional, dados isolados por conta  
**Contras:** Aumentaria complexidade; auth atual com senhas em localStorage ainda seria inseguro

---

### Opção C — Auth real com backend (longo prazo)
> Substituir o auth localStorage por um provider real (Supabase, Firebase Auth, etc.)

- [ ] Escolher provider (Supabase recomendado — open-source, PostgreSQL, auth integrado)
- [ ] Migrar `loginWithCredentials` e `signup` para chamadas de API
- [ ] Mover dados de onboarding para banco de dados vinculado ao `user.id`
- [ ] Implementar refresh de token / sessão segura
- [ ] Remover senhas do localStorage completamente

**Prós:** Seguro, multi-dispositivo, escalável  
**Contras:** Requer infraestrutura, setup inicial mais longo

---

## 4. Recomendação

Para o momento de desenvolvimento/teste → **Opção A** ou **manter desativado**.

Para uma v1 funcional de produto → **Opção B** é o menor esforço para ter multi-usuário sem backend.

Para uma v1 seria → **Opção C** com Supabase (auth + DB gratuito no tier free).

---

## 5. Riscos de segurança do auth atual (se reativado sem mudanças)

> ⚠️ O sistema de auth atual **não deve ser usado em produção** sem as correções abaixo.

- **Senhas em texto puro no localStorage** — qualquer extensão de browser ou XSS consegue ler
- **Sem hash de senha** — mínimo seria usar `bcrypt` ou `argon2` (no front, use um backend)
- **Sem token de sessão real** — o objeto `user` inteiro fica exposto no localStorage
- **Sem expiração de sessão** — login persiste indefinidamente

Se a Opção B for seguida, ao menos adicionar hash da senha no client com `crypto.subtle` (PBKDF2) antes de armazenar.
