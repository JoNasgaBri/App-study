# Plano de Reestruturação — App Study

## Objetivo
Reestruturar o projeto para um padrão moderno de engenharia de software, com baixo acoplamento, maior testabilidade, segurança básica no front-end e preparação para futuras integrações.

## Escopo
- Quebrar o monólito em módulos por domínio (`features`) e camadas compartilhadas (`shared`).
- Centralizar constantes, dados estáticos e utilitários.
- Introduzir gerenciamento de estado de UI em hooks reutilizáveis.
- Organizar persistência local com namespace, fallback seguro e validação defensiva.
- Melhorar configuração de projeto para qualidade (`lint`) e build previsível.
- Ajustar base HTML para metadados e políticas defensivas de navegador.

## Arquitetura alvo
- `src/app`: bootstrap, composição de layout e shell da aplicação.
- `src/features`: módulos de negócio (pomodoro, trilha, redação, erros, dashboard, etc).
- `src/shared`: utilitários, serviços, constantes e tipos do domínio.
- `src/styles`: estilos globais/utilitários visuais.

## Critérios de aceite (checkável)
- [x] Nenhum componente acima de ~250 linhas.
- [x] `src/App.jsx` atua apenas como orquestrador de alto nível.
- [x] Persistência em LocalStorage centralizada e sem repetição de chaves mágicas.
- [x] Build de produção executa sem erro.
- [x] Lint executa sem erro.
- [x] Estrutura permite adicionar nova feature sem alterar módulos não relacionados.

## Plano de execução
1. Criar estrutura de pastas e contratos básicos de domínio.
2. Extrair serviços compartilhados (`storage`, `audio`, `notifications`, `constants`).
3. Refatorar componentes grandes em módulos por feature.
4. Criar `AppShell` para navegação e layout.
5. Ajustar scripts, configs e qualidade (ESLint).
6. Validar com `npm run lint` e `npm run build`.
7. Registrar revisão técnica e decisões.

## Riscos e mitigação
- **Risco:** regressão de comportamento em componentes extraídos.
  - **Mitigação:** manter assinatura de props compatível e validar build + smoke checks.
- **Risco:** perda de dados já salvos no localStorage por mudança de chaves.
  - **Mitigação:** manter compatibilidade retroativa e namespace estável.

## Review (preencher ao final)
- Status geral: Concluído com 1 pendência de refinamento
- Mudanças implementadas:
  - Monólito de `src/App.jsx` extraído para arquitetura em `src/app`, `src/features` e `src/shared`.
  - Criação de módulos de feature: `syllabus`, `schedule`, `pomodoro`, `writing`, `errors`, `dashboard`, `checklist`.
  - Persistência local reforçada com namespace e leitura defensiva em `src/shared/lib/storage.js`.
  - Sanitização e validação de entradas em `src/shared/lib/validation.js`.
  - Hardening front-end: `ErrorBoundary` e CSP/meta no `index.html`.
  - Pipeline de qualidade adicionado: `eslint.config.js` + script `npm run lint`.
- Evidências de verificação:
  - `npm run lint` executado com sucesso (sem erros).
  - `npm run build` executado com sucesso (`vite build` concluído).
- Pendências:
  - `src/app/AppShell.jsx` ainda está acima do limite ideal de ~250 linhas; recomenda-se dividir em componentes de layout (`Sidebar`, `MobileNav`, `ThemeControls`, `VideoBackdrop`) na próxima iteração.

---

## Plano de execução — Passo 2 (Refino de Layout)
1. Extrair `MobileBottomNav` sem alterar estado.
2. Extrair `BackgroundLayer` (camada visual de fundo).
3. Extrair `ContentArea` (container principal da view ativa).
4. Extrair `DesktopSidebar` com navegação e controles.
5. Simplificar `AppShell` para composição de alto nível.
6. Validar com `npm run lint` e `npm run build`.

### Critérios de aceite passo 2
- [x] `AppShell` reduzido e focado em orquestração.
- [x] Sem mudança funcional em navegação, tema, vídeo e dark mode.
- [x] `lint` e `build` verdes após extração.

## Review — Passo 2
- Status geral: Concluído
- Mudanças implementadas:
  - Extração de layout para `BackgroundLayer`, `DesktopSidebar`, `ContentArea` e `MobileBottomNav`.
  - Simplificação do `AppShell` para composição de estado + orquestração de views.
  - Correção de acoplamento de constantes de tema/vídeo nos componentes de layout.
- Evidências de verificação:
  - `wc -l src/app/AppShell.jsx` → 136 linhas.
  - `npm run lint` sem erros.
  - `npm run build` concluído com sucesso.
- Pendências:
  - Nenhuma pendência crítica aberta para o escopo atual.

---

## Backlog priorizado — Próximo lançamento (Impacto x Esforço)

| # | Feature | Impacto | Esforço | Risco | Dependências | MVP slice |
|---|---|---|---|---|---|---|
| 1 | Onboarding + checklist inicial personalizado | Alto | Baixo | Baixo | `features/checklist`, `features/syllabus` | Wizard de 3 passos + geração de plano de estudos base |
| 2 | Backup/restauração local (export/import JSON) | Alto | Baixo | Médio | `shared/lib/storage`, `shared/lib/validation` | Botões Exportar/Importar com validação de schema |
| 3 | Hardening de dados locais (TTL + limpeza + versionamento) | Alto | Médio | Médio | `shared/lib/storage` | Expiração de dados sensíveis, migração de versão e purge seguro |
| 4 | Histórico e métricas de estudo (dashboard real) | Alto | Médio | Baixo | `features/dashboard`, `features/pomodoro`, `features/writing` | Horas estudadas, sessões concluídas, streak semanal |
| 5 | Alertas e lembretes nativos (Web Notifications) | Médio | Baixo | Baixo | `shared/lib/audio`, permissões do navegador | Notificação de fim de pomodoro e lembrete diário |
| 6 | Sincronização em nuvem (integração futura: Supabase/Firebase) | Alto | Médio | Médio | camada `shared/services/api` (nova), auth mínima | Sync manual de progresso (push/pull) para 1 conta |
| 7 | Integração de calendário (Google Calendar/ICS) | Médio | Médio | Médio | OAuth (futuro), módulo `features/schedule` | Exportar cronograma para `.ics` + import básico |
| 8 | Monitoramento de erros em produção (Sentry/LogRocket) | Médio | Baixo | Baixo | `app/ErrorBoundary`, variáveis de ambiente | Captura de erro global + contexto da tela ativa |

---

## Plano de execução — Autenticação e Onboarding Personalizado

### Foco da Feature
Implementar a porta de entrada do usuário (Login/Cadastro mockado localmente) e direcioná-lo a um Onboarding que personaliza as configurações iniciais do app baseado no seu perfil de estudo.

### Tarefas (Checklist)
- [x] **1. Módulo de Autenticação (`features/auth`)**
  - [x] Criar `AuthView.jsx` contendo formulários independentes de Login e Cadastro (Visual simples e centralizado).
  - [x] Criar gerenciamento de estado global e persistência básica da sessão no `localStorage` (ex: `userProfile`, `isAuthenticated`).
  - [x] Proteger o `AppShell`: redirecionar usuários não autenticados para o `AuthView`.
- [ ] **2. Evolução do Onboarding (`features/onboarding`)**
  - [ ] Expandir `OnboardingWizard.jsx` para suportar fluxo de 3 passos: Perfil (Objetivo), Metas (Tempo) e Imersão (Cores e Vídeos).
  - [ ] Garantir que o Onboarding renderize logo após o cadastro, e só saia ao ser concluído (flag `hasCompletedOnboarding`).
- [ ] **3. Serviço de Personalização (`features/onboarding/personalizationService.js`)**
  - [ ] Criar regra de negócio para injetar `syllabus` e `checklist` customizados dependendo da área de estudo escolhida.
  - [ ] Injetar as metas de pomodoro/horas no estado do `goals`.
- [ ] **4. Tela Inicial Direcionada (Dashboard)**
  - [ ] Inserir saudação customizada no `StudentHeader.jsx`.
  - [ ] Gerar um `ChecklistCard` instrucional ("Primeiros Passos") que fica salvo no Dashboard no momento da criação da conta.

### Review (preencher ao final)
- Status geral: Não iniciado
- Mudanças implementadas: 
- Evidências de verificação: 
- Lições aprendidas: 


### Notas de lançamento
- Ordem sugerida para sprint curto: 1 → 2 → 4 → 8 (quick wins), depois 3 → 5, e fechar com 6 → 7.
- Segurança de dados mínima antes do release público: itens 2 e 3 obrigatórios.
- Integrações futuras priorizadas: sincronização em nuvem (6) e calendário (7).

---

## Plano de execução — Passo 3 (Base para novas features)
1. Criar contrato de ambiente com `.env.example` e validação em runtime.
2. Adicionar observabilidade mínima (logs e handlers globais de erro).
3. Criar cliente HTTP único com timeout/retry para integrações futuras.
4. Adicionar pipeline CI para quality gates (`lint` + `build`).
5. Documentar roadmap e checklist operacional de release.
6. Validar novamente com `npm run lint` e `npm run build`.

### Critérios de aceite passo 3
- [x] Contrato de ambiente criado e validado no boot.
- [x] Observabilidade global inicial implementada.
- [x] Cliente HTTP centralizado pronto para camada de API.
- [x] CI configurado para push/PR.
- [x] Documentação de roadmap/release adicionada.
- [x] Lint e build revalidados após todas as mudanças.

## Review — Passo 3
- Status geral: Concluído
- Mudanças implementadas:
  - `.env.example` criado.
  - `src/shared/config/env.js` adicionado com validação (estrita em produção).
  - `src/shared/observability/logger.js` adicionado com captura global.
  - `src/shared/api/httpClient.js` adicionado para integrações futuras.
  - CI criado em `.github/workflows/ci.yml`.
  - Documentação criada em `docs/roadmap.md`, `docs/release-checklist.md` e `README.md`.
- Evidências de verificação:
  - `npm run lint` sem erros.
  - `npm run build` concluído com sucesso (`vite build`).
- Pendências:
  - Nenhuma pendência crítica aberta para esta etapa.

---

## Passo 4 — Feature: Onboarding Guiado

### Objetivo
Exibir um wizard de 3 passos na primeira visita do usuário, colhendo nome, data da prova, matérias prioritárias e preferências visuais (tema + modo escuro), antes de liberar o acesso ao app.

### Critérios de aceite
- [x] Wizard só exibe na primeira visita (flag `onboarding:completed` via `storage.js`).
- [x] Passo 1: nome (sanitizado, máx. 80 chars) + data da prova — ambos obrigatórios para avançar.
- [x] Passo 2: seleção de matérias (mín. 1) com feedback visual de seleção.
- [x] Passo 3: seletor de tema + toggle de modo escuro.
- [x] Ao concluir, tema e darkMode escolhidos são aplicados imediatamente ao AppShell.
- [x] Perfil (`name`, `examDate`, `subjects`) salvo em `onboarding:profile`.
- [x] ESLint sem erros.
- [x] Build bem-sucedido.

## Review — Passo 4
- Status geral: Concluído
- Mudanças implementadas:
  - `src/features/onboarding/OnboardingWizard.jsx` criado com wizard de 3 passos.
  - `AppShell.jsx` atualizado: importa `OnboardingWizard`, lê `onboarding:completed`, exibe wizard se não finalizado, aplica preferências ao completar.
- Evidências de verificação:
  - `npm run lint` sem erros.
  - `npm run build` — 1767 módulos, 248.77 kB (gzip: 76.70 kB), em 1.96s.
- Pendências:
  - Nenhuma pendência crítica aberta para esta etapa.

---

## Passo 5 — Feature: Canvas Dashboard (Metas Diárias)

### Objetivo
Substituir o DashboardView estático por um painel canvas com blocos dinâmicos e drag-and-drop, exibindo o perfil do aluno e permitindo criação livre de cards (nota, checklist, link).

### Critérios de aceite
- [x] Dependências `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` instaladas.
- [x] `StudentHeader` exibe nome, dias restantes (via examDate do perfil) e matérias prioritárias.
- [x] Três tipos de card: `text` (nota livre), `checklist` (itens marcáveis com barra de progresso), `link` (URL + descrição + atalho clicável).
- [x] Cards persistidos em `localStorage` via `dashboard:canvas`.
- [x] `useCanvas` centraliza CRUD e `arrayMove` para reordenação.
- [x] Drag-and-drop sorter com sensor de distância mínima (6 px) via `PointerSensor`.
- [x] Layout em colunas masonry (`columns-1 sm:columns-2 lg:columns-3`).
- [x] Menu "Novo bloco" fecha ao clicar fora (via `useOnClickOutside`).
- [x] `useOnClickOutside` extraído em `src/shared/lib/useOnClickOutside.js`.
- [x] ESLint sem erros.
- [x] Build bem-sucedido.

## Review — Passo 5
- Status geral: Concluído
- Mudanças implementadas:
  - `src/features/dashboard/constants.js` — tipos de card, `buildCard`, `SUBJECT_LABELS`.
  - `src/features/dashboard/hooks/useCanvas.js` — hook com `addCard`, `updateCard`, `removeCard`, `reorderCards`.
  - `src/features/dashboard/components/cards/TextCard.jsx` — nota com título e corpo editáveis inline.
  - `src/features/dashboard/components/cards/ChecklistCard.jsx` — checklist com barra de progresso e remoção por item.
  - `src/features/dashboard/components/cards/LinkCard.jsx` — card com URL, rótulo, descrição e link externo.
  - `src/features/dashboard/components/CanvasCard.jsx` — wrapper sortable com drag handle, badge de tipo e botão deletar.
  - `src/features/dashboard/components/CanvasBoard.jsx` — `DndContext` + `SortableContext` com grid masonry.
  - `src/features/dashboard/components/StudentHeader.jsx` — perfil do aluno com dias restantes e matérias.
  - `src/features/dashboard/components/AddCardMenu.jsx` — menu flutuante com 3 opções de card.
  - `src/features/dashboard/DashboardView.jsx` — reescrito como orquestrador do canvas.
  - `src/shared/lib/useOnClickOutside.js` — hook reutilizável para fechar dropdowns.
- Evidências de verificação:
  - `npm run lint` — 0 erros, 0 warnings.
  - `npm run build` — 1782 módulos, 301.28 kB (gzip: 94.75 kB), em 2.33s.
- Pendências:
  - Nenhuma pendência crítica aberta para esta etapa (canvas substituído por abordagem correta no Passo 6).

---

## Passo 6 — Dashboard de Métricas Reais + Sistema de Metas Diárias

### Objetivo
Transformar o Dashboard em uma página de leitura de métricas reais do aluno e criar um sistema separado de metas diárias com monitoramento e streak.

### Critérios de aceite
- [x] Dashboard lê dados reais de todos os features (pomodoro, erros, redações, edital).
- [x] Perfil do aluno (nome, dias restantes, matérias) renderizado no topo do Dashboard.
- [x] 4 stat cards: Pomodoros, Progresso no Edital (%), Redações, Erros.
- [x] Atividade de hoje: redações e erros registrados no dia atual.
- [x] Barras de distribuição de erros (Teoria, Interpretação, Cálculo).
- [x] Progresso por área do edital em mini-barras.
- [x] Histórico de redações com média e nota máxima.
- [x] Feature "Metas Diárias" criada em `src/features/goals/`.
- [x] Metas têm categoria (Geral, Estudo, Revisão, Redação, Foco) e texto livre.
- [x] Toggle de concluído por meta; progresso do dia visível em barra.
- [x] Grade de 7 dias mostrando dias completos / parciais / sem metas.
- [x] Streak de dias com 100% das metas concluídas.
- [x] Metas persistidas por data em `goals:log` via `storage.js`.
- [x] Nova aba "Metas Diárias" (ícone Target, key 6) adicionada à navegação.
- [x] ESLint sem erros.
- [x] Build bem-sucedido.

## Review — Passo 6
- Status geral: Concluído
- Mudanças implementadas:
  - `src/features/dashboard/DashboardView.jsx` — reescrito como dashboard puro de leitura de métricas.
  - `src/features/goals/hooks/useGoals.js` — hook com CRUD de metas, streak, weekHistory.
  - `src/features/goals/components/GoalItem.jsx` — item de meta com checkbox, categoria, delete.
  - `src/features/goals/components/StreakBadge.jsx` — badge de série de dias com tema dinâmico.
  - `src/features/goals/GoalsView.jsx` — página completa de metas com formulário, grade semanal, seção de concluídas.
  - `src/shared/constants/navigation.js` — adicionada aba "Metas Diárias" (key 6, ícone Target). Checklist movida para key 8.
  - `src/app/AppShell.jsx` — importa GoalsView e roteia `activeTab === 'metas'`.
- Evidências de verificação:
  - `npm run lint` — 0 erros, 0 warnings.
  - `npm run build` — 1771 módulos, 261.81 kB (gzip: 80.02 kB), em 2.22s.
- Pendências:
  - Nenhuma pendência crítica aberta para esta etapa.

---

## Passo 7 — Correções de Modo Escuro + Cronograma Editável

### Objetivo
Corrigir todos os erros de modo escuro nas views já existentes e tornar o cronograma totalmente editável (clique para editar célula).

### Critérios de aceite
- [x] DesktopSidebar: ícones Moon/Sun corretos, daysLeft do perfil.
- [x] ExamChecklistView: data do exame dinâmica do perfil.
- [x] GoalItem + StreakBadge: prop darkMode passada e estilos corretos.
- [x] GoalsView: dayLabel via useState (pureza), darkMode completo.
- [x] AppShell: resolveTheme importado, effectiveTheme passado para todas as views e layouts.
- [x] ContentArea: glass escura em darkMode.
- [x] DashboardView: modo escuro completo.
- [x] ScheduleView: células clicáveis para edição inline, localStorage, botão reset.
- [x] `npm run lint` — 0 erros.
- [x] `npm run build` — 1771 módulos, 266.50 kB.

## Review — Passo 7
- Status geral: Concluído
- Mudanças implementadas:
  - AppShell: `resolveTheme`, `effectiveTheme`, `daysLeft` do perfil, `useCallback` nos handlers.
  - ScheduleView: clique em célula abre `<input>`, salvo em localStorage por chave única, botão Resetar.
  - Dashboard, Goals, GoalItem, StreakBadge, ContentArea: props darkMode e classes condicionais.
- Evidências de verificação:
  - `npm run lint` — 0 erros, 0 warnings.
  - `npm run build` — 1771 módulos, 266.50 kB (gzip: 81.6 kB).

---

## Passo 8 — Sistema de Temas Dark + Modal Moderno + Todas as Views

### Objetivo
Corrigir o sistema de cores em modo escuro em toda a interface, fixar temas coloridos que não funcionavam em dark, criar componente Modal moderno (padrão 2026) e aplicar darkMode às 5 views restantes.

### Critérios de aceite
- [x] `themes.js`: sub-objeto `dark` em todos os 4 temas (zinc/violet/blue/emerald).
- [x] `resolveTheme(themeObj, darkMode)` exportada — funde dark overrides automaticamente.
- [x] AppShell: `effectiveTheme` passado a todos as views e layouts.
- [x] `src/shared/components/Modal.jsx` criado — backdrop blur, Escape, click-outside, scroll lock.
- [x] PomodoroView: darkMode completo; configurações abertas via `<Modal>` (não mais full-page).
- [x] SyllabusView: darkMode em cards, checkboxes, barras de progresso, inputs.
- [x] WritingView: darkMode em caixa de aviso vermelha, formulário, lista de redações.
- [x] ErrorTrackerView: darkMode em form, selects, lista, delete buttons.
- [x] ExamChecklistView: cards coloridos (azul/vermelho/verde) com variantes dark (`*-950/20`).
- [x] DesktopSidebar: `border-t` corrigida no dark, borda do círculo de tema visível no dark, divisor interno condicional.
- [x] `npm run lint` — 0 erros.
- [x] `npm run build` — 1772 módulos, 270.83 kB.

## Review — Passo 8
- Status geral: Concluído
- Mudanças implementadas:
  - `themes.js`: 4 temas com `dark` sub-objetos + `resolveTheme`.
  - `Modal.jsx`: componente moderno com portal, backdrop blur, animação fade+zoom.
  - PomodoroView, SyllabusView, WritingView, ErrorTrackerView, ExamChecklistView: darkMode props + estilos condicionais.
  - DesktopSidebar: 3 correções de border no dark mode.
- Evidências de verificação:
  - `npm run lint` — 0 erros, 0 warnings.
  - `npm run build` — 1772 módulos, 270.83 kB (gzip: 81.85 kB).

---

## Passo 9 — Barra Lateral Zen Browser: Auto-Retrato + Personalização Avançada

### Objetivo
Implementar features inspiradas no Zen Browser: barra lateral com auto-retrair/revelar no hover, paleta de gradientes, cor personalizada por color picker nativo e controlo de relevo/sombra.

### Critérios de aceite
- [x] Barra lateral retrátil: colapsa para strip de ícones 56 px (`w-14`).
- [x] Hover revela barra completa (`w-64`) com animação cubic-bezier suave (300 ms).
- [x] Botão Brain ou chevron `PanelLeftClose/Open` alterna modo fixo/retrátil.
- [x] Estado `sidebarCollapsed` persistido em localStorage (`sidebar:collapsed`).
- [x] Quando colapsada: nav mostra apenas ícones centrados com `title` tooltip.
- [x] Footer colapsado: apenas ícone de dark mode visível.
- [x] Gradiente de Destaque: 6 presets (Aurora, Pôr do Sol, Oceano, Fogo, Noite, Floresta).
- [x] Gradiente aplicado ao indicador de aba ativa (via `style` inline).
- [x] Gradiente/cor custom persistidos em localStorage (`accentGradient`, `customAccent`).
- [x] Botão × limpa gradiente e cor personalizada.
- [x] Cor Personalizada: `<input type="color">` nativo — cor de destaque totalmente livre.
- [x] Cor personalizada exclusiva com gradiente (selecionar um limpa o outro).
- [x] Relevo: slider 0-3 (Nenhum / Suave / Médio / Intenso) aplica `shadow-*` na barra + rótulo ao lado.
- [x] Level de relevo persistido em localStorage (`shadowLevel`).
- [x] `GRADIENT_PRESETS` e `getAccentStyle` exportados de `themes.js`.
- [x] AppShell: `accentStyle` computado e passado para DesktopSidebar.
- [x] `npm run lint` — 0 erros.
- [x] `npm run build` — 1772 módulos, 277.21 kB.

## Review — Passo 9
- Status geral: Concluído
- Mudanças implementadas:
  - `themes.js`: `GRADIENT_PRESETS` (6 opções) + `getAccentStyle(gradient, custom)`.
  - `AppShell.jsx`: 4 novos estados (`sidebarCollapsed`, `accentGradient`, `customAccent`, `shadowLevel`) + 4 handlers; `SHADOW_CLASS` computado e aplicado ao `glassStyle`; `accentStyle` passado ao Sidebar.
  - `DesktopSidebar.jsx`: reescrito com `useState(hovering)`, `isExpanded`, transição `transition-[width] duration-300`, ícones-only quando colapsado, painel de personalização expansível com 6 seções numeradas.
- Evidências de verificação:
  - `npm run lint` — 0 erros, 0 warnings.
  - `npm run build` — 1772 módulos, 277.21 kB (gzip: 83.62 kB).
- Pendências:
  - Expandir `accentStyle` para os botões de submit em cada view (fase futura).

---

## Passo 10 — Release Readiness: Backup, Hardening, Lembrete Diário, Sentry

### Objetivo
Fechar todos os bloqueadores de release público identificados no backlog: backup/restore de dados locais, hardening de schema com versionamento e purge, lembrete diário via Web Notifications, integração Sentry opt-in e redução de todos os componentes ao limite de 250 linhas.

### Critérios de aceite
- [x] `PomodoroView.jsx` ≤ 250 linhas — lógica de settings extraída para `PomodoroSettings.jsx`.
- [x] `SidebarCustomizationPanel.jsx` criado — painel de personalização extraído do `DesktopSidebar.jsx`.
- [x] Nenhum componente acima de 250 linhas (máximo: DashboardView 241, PomodoroView 239).
- [x] `src/shared/lib/backup.js` criado — `exportData()`, `importData()`, `triggerDownload()`.
- [x] Botões Exportar / Importar na sidebar com feedback visual de estado.
- [x] Importação valida schema (`__app`, `__version`, `data`) e rejeita arquivos inválidos.
- [x] `storage.migrate()` — verifica `schema:version`, aplica migrações e grava versão atual.
- [x] `storage.purgeExpired()` — remove chaves com `__expiresAt` vencido.
- [x] `storage.setWithTTL()` / `storage.getWithTTL()` — API para dados com expiração.
- [x] `CURRENT_SCHEMA_VERSION = 1` exportado de `storage.js`.
- [x] `storage.migrate()` e `storage.purgeExpired()` chamados no boot em `main.jsx`.
- [x] Lembrete diário: dispara `Notification` uma vez por dia após 07:00 se permissão concedida.
- [x] Data do último lembrete salva em `daily:reminder:date` para evitar repetição.
- [x] `@sentry/react` instalado.
- [x] Sentry inicializado em `main.jsx` apenas se `VITE_SENTRY_DSN` estiver definido.
- [x] `.env.example` atualizado com `VITE_SENTRY_DSN` e `VITE_SENTRY_TRACES_SAMPLE_RATE`.
- [x] `npm run lint` — 0 erros.
- [x] `npm run build` — 2062 módulos, 282.12 kB.

## Review — Passo 10
- Status geral: Concluído
- Mudanças implementadas:
  - `src/features/pomodoro/PomodoroSettings.jsx` — Modal de configuração extraído do PomodoroView.
  - `src/app/layout/SidebarCustomizationPanel.jsx` — Painel de temas/gradientes/relevo extraído do DesktopSidebar.
  - `src/shared/lib/backup.js` — Export/import/download de JSON com validação de schema.
  - `src/shared/lib/storage.js` — Addicionados `migrate()`, `purgeExpired()`, `setWithTTL()`, `getWithTTL()`, `CURRENT_SCHEMA_VERSION`.
  - `src/app/AppShell.jsx` — Lembrete diário via `Notification` API (once-per-day, after 07:00).
  - `src/app/layout/DesktopSidebar.jsx` — Botões Exportar/Importar com `fileInputRef`, feedback `backupMsg`.
  - `src/main.jsx` — Sentry init opt-in + `storage.migrate()` + `storage.purgeExpired()` no boot.
  - `.env.example` — `VITE_SENTRY_DSN` e `VITE_SENTRY_TRACES_SAMPLE_RATE` adicionados.
- Evidências de verificação:
  - `npm run lint` — 0 erros, 0 warnings.
  - `npm run build` — 2062 módulos, 282.12 kB (gzip: 85.33 kB).
- Pendências:
  - `accentStyle` nos botões de submit de cada view (backlog fase futura).
  - Sincronização em nuvem (backlog item 6 — Supabase/Firebase).
  - Export ICS de cronograma (backlog item 7).
