# Documento Técnico — Arquitetura de Dados e Conexões

> **App-Study** · Versão de schema: `1` · Atualizado em: março 2026

---

## 1. Visão Geral

O app opera atualmente **100% client-side**. Não existe servidor de banco de dados ativo — toda a persistência é feita via **`localStorage`** do browser, organizada sob o namespace `app-study:*`.

A camada de dados é composta por três responsáveis distintos:

| Camada | Arquivo | Responsabilidade |
|---|---|---|
| **Storage** | `src/shared/lib/storage.js` | Abstração sobre `localStorage`: read/write com parse defensivo, TTL, migrate e purgeExpired |
| **Backup** | `src/shared/lib/backup.js` | Export/import de todo o estado como `.json` assinado |
| **HTTP Client** | `src/shared/api/httpClient.js` | Cliente HTTP com timeout e retry — **preparado, mas inativo** (aguarda `VITE_API_BASE_URL`) |

---

## 2. Mapa de Chaves do `localStorage`

Todas as chaves são prefixadas com `app-study:` pelo `storage.js`. Abaixo, as chaves por domínio, com o formato esperado do valor.

### 2.1 Preferências de Aparência (`AppShell`)

| Chave interna | `localStorage` real | Tipo | Exemplo |
|---|---|---|---|
| `themeKey` | `app-study:themeKey` | `string` | `"zinc"` |
| `videoId` | `app-study:videoId` | `string` | `"dQw4w9WgXcQ"` |
| `darkMode` | `app-study:darkMode` | `boolean` | `true` |
| `sidebar:collapsed` | `app-study:sidebar:collapsed` | `boolean` | `false` |
| `accentGradient` | `app-study:accentGradient` | `string` | `"sunset"` ou `""` |
| `customAccent` | `app-study:customAccent` | `string` | `"#a78bfa"` ou `""` |
| `shadowLevel` | `app-study:shadowLevel` | `string` | `"md"` |

---

### 2.2 Autenticação (`features/auth`)

> Estado: **implementado, desativado na UI** — reativação via comentário em `AppShell.jsx`.

| Chave interna | `localStorage` real | Tipo | Formato |
|---|---|---|---|
| `auth:userProfile` | `app-study:auth:userProfile` | `object` | Ver schema abaixo |
| `app_study_users` | `app-study:app_study_users` | `array<object>` | Ver schema abaixo |

**Schema — UserProfile:**
```json
{
  "id": "1741872000000",
  "name": "Jonas",
  "email": "jonas@email.com",
  "password": "senhaPlain"
}
```

> ⚠️ **Segurança futura:** a senha está em texto plano (mock). Antes de ativar em produção, substituir por hash com `bcrypt` no backend ou `crypto.subtle` no front.

---

### 2.3 Onboarding (`features/onboarding`)

| Chave interna | `localStorage` real | Tipo | Formato |
|---|---|---|---|
| `onboarding:completed` | `app-study:onboarding:completed` | `boolean` | `true` |
| `onboarding:profile` | `app-study:onboarding:profile` | `object` | Ver schema abaixo |

**Schema — OnboardingProfile:**
```json
{
  "goal": "concurso",
  "dailyHours": 4,
  "examDate": "2026-11-01"
}
```

---

### 2.4 Pomodoro (`features/pomodoro`)

| Chave interna | `localStorage` real | Tipo | Exemplo |
|---|---|---|---|
| `pomodoro_work` | `app-study:pomodoro_work` | `number` | `25` (minutos) |
| `pomodoro_break` | `app-study:pomodoro_break` | `number` | `5` |
| `pomodoro_sound` | `app-study:pomodoro_sound` | `boolean` | `true` |
| `pomodoro_cycles` | `app-study:pomodoro_cycles` | `number` | `4` |
| `pomodoro_timeLeft` | `app-study:pomodoro_timeLeft` | `number` | `1500` (segundos) |
| `pomodoro_isActive` | `app-study:pomodoro_isActive` | `boolean` | `false` |
| `pomodoro_isBreak` | `app-study:pomodoro_isBreak` | `boolean` | `false` |

---

### 2.5 Trilha de Estudos — Syllabus (`features/syllabus`)

| Chave interna | `localStorage` real | Tipo | Formato |
|---|---|---|---|
| `syllabus_topics` | `app-study:syllabus_topics` | `array<Topic>` | Ver schema abaixo |
| `syllabus_checked` | `app-study:syllabus_checked` | `Record<id, boolean>` | `{"topic-1": true}` |

**Schema — Topic:**
```json
{
  "id": "topic-1",
  "subject": "Matemática",
  "name": "Frações",
  "done": false
}
```

---

### 2.6 Redações (`features/writing`)

| Chave interna | `localStorage` real | Tipo | Formato |
|---|---|---|---|
| `essays` | `app-study:essays` | `array<Essay>` | Ver schema abaixo |

**Schema — Essay:**
```json
{
  "id": "1741872000000",
  "title": "A Importância da Educação",
  "body": "Texto da redação...",
  "createdAt": "2026-03-13T10:00:00.000Z",
  "grade": 800
}
```

---

### 2.7 Rastreador de Erros (`features/errors`)

| Chave interna | `localStorage` real | Tipo | Formato |
|---|---|---|---|
| `errors` | `app-study:errors` | `array<ErrorEntry>` | Ver schema abaixo |

**Schema — ErrorEntry:**
```json
{
  "id": "1741872000000",
  "subject": "Português",
  "topic": "Concordância Verbal",
  "description": "Confundi sujeito composto pós-verbo.",
  "createdAt": "2026-03-13T10:00:00.000Z"
}
```

---

### 2.8 Metas (`features/goals`)

| Chave interna | `localStorage` real | Tipo | Formato |
|---|---|---|---|
| `goals:log` | `app-study:goals:log` | `array<GoalEntry>` | Ver schema abaixo |

**Schema — GoalEntry:**
```json
{
  "id": "1741872000000",
  "date": "2026-03-13",
  "minutesStudied": 120,
  "sessions": 3
}
```

---

### 2.9 Dashboard — Canvas (`features/dashboard`)

| Chave interna | `localStorage` real | Tipo | Formato |
|---|---|---|---|
| `dashboard:canvas` | `app-study:dashboard:canvas` | `array<Card>` | Ver schema abaixo |

**Schema — Card (polimórfico por `type`):**
```json
{
  "id": "card-1741872000000",
  "type": "text",
  "x": 120,
  "y": 80,
  "w": 300,
  "h": 200,
  "content": "Minha anotação"
}
```

Tipos disponíveis: `text` · `link` · `checklist`

---

### 2.10 Cronograma (`features/schedule`)

| Chave interna | `localStorage` real | Tipo | Formato |
|---|---|---|---|
| `schedule:week` | `app-study:schedule:week` | `Record<day, array<Slot>>` | Ver schema abaixo |

**Schema:**
```json
{
  "monday": [
    { "start": "08:00", "end": "10:00", "subject": "Matemática" }
  ],
  "tuesday": []
}
```

---

### 2.11 Checklist de Prova (`features/checklist`)

| Chave interna | `localStorage` real | Tipo | Formato |
|---|---|---|---|
| `exam_checklist` | `app-study:exam_checklist` | `array<CheckItem>` | Ver schema abaixo |

**Schema — CheckItem:**
```json
{
  "id": "item-1",
  "label": "Levar caneta preta",
  "checked": false
}
```

---

### 2.12 Sistema (`shared/lib/storage`)

| Chave interna | `localStorage` real | Tipo | Exemplo |
|---|---|---|---|
| `schema:version` | `app-study:schema:version` | `number` | `1` |
| `daily:reminder:date` | `app-study:daily:reminder:date` | `string` | `"2026-03-13"` |

---

## 3. Camada de Serviços

### 3.1 `storage.js` — API de Persistência Local

```
storage.get(key, fallback, parser?)   → leitura defensiva com parse e validação
storage.set(key, value)               → escrita com stringify
storage.remove(key)                   → remoção
storage.setWithTTL(key, value, ttlMs) → escrita com expiração
storage.getWithTTL(key, fallback)     → leitura com verificação de TTL
storage.migrate()                     → executa migrações de schema (chamado no boot)
storage.purgeExpired()                → remove chaves expiradas (chamado no boot)
```

**Namespace:** todas as chaves são prefixadas com `app-study:` automaticamente.

---

### 3.2 `backup.js` — Export / Import de Dados

```
exportData()            → serializa todas as chaves app-study:* em JSON assinado
importData(jsonString)  → valida, limpa e restaura o estado completo
triggerDownload(json)   → dispara download do arquivo .json no browser
```

**Envelope do backup:**
```json
{
  "__version": 1,
  "__exported": "2026-03-13T10:00:00.000Z",
  "__app": "app-study",
  "data": { "chave": "valor" }
}
```

---

### 3.3 `httpClient.js` — Cliente HTTP (Preparado / Inativo)

```
httpRequest(path, options?) → GET/POST/PUT/DELETE com timeout e retry automático
```

**Variáveis de ambiente necessárias para ativar:**
```env
VITE_API_BASE_URL=https://api.exemplo.com
VITE_API_TIMEOUT_MS=8000   # opcional, default: 8000ms
```

O cliente **não é chamado por nenhuma feature** atualmente — foi projetado para ser usado quando a sincronização em nuvem for implementada (item #6 do backlog).

---

## 4. Diagrama de Dependências de Dados

```
App.jsx
└── AuthProvider (AuthContext)
    └── AppShell
        ├── storage.get/set ──► localStorage
        ├── PomodoroView    ──► storage (7 chaves)
        ├── SyllabusView    ──► storage (2 chaves)
        ├── WritingView     ──► storage (1 chave)
        ├── ErrorTrackerView──► storage (1 chave)
        ├── GoalsView       ──► storage (1 chave)
        ├── DashboardView   ──► storage (1 chave)
        ├── ScheduleView    ──► storage (1 chave)
        ├── ExamChecklistView─► storage (1 chave)
        └── OnboardingWizard──► storage (2 chaves)

AuthContext
└── storage (2 chaves: auth:userProfile, app_study_users)

main.jsx (boot)
├── storage.migrate()      → garante schema atualizado
└── storage.purgeExpired() → limpa dados expirados
```

---

## 5. Roadmap de Evolução de Dados

| Fase | O que muda |
|---|---|
| **Atual (v1)** | 100% localStorage, sem backend |
| **Auth ativada** | `auth:userProfile` entra em uso como sessão de usuário; senha deve ser hashada |
| **Sync em nuvem** | `httpClient.js` começa a ser usado; chaves críticas (`essays`, `goals:log`, `dashboard:canvas`) sincronizadas via API REST ou Supabase |
| **v2 de schema** | `storage.migrate()` executa transformações nos dados legados ao detectar `schema:version < 2` |

---

> Gerado automaticamente a partir da análise estática do código-fonte em março de 2026.
