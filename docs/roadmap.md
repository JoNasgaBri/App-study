# Roadmap de Produto — App Study

## Priorização (Impacto x Esforço)

| # | Feature | Impacto | Esforço | Risco | Dependências | MVP |
|---|---|---|---|---|---|---|
| 1 | Onboarding guiado | Alto | Baixo | Baixo | Estado atual | 3 passos + plano inicial |
| 2 | Backup/Restore JSON | Alto | Baixo | Médio | Storage | Exportar/importar dados |
| 3 | Segurança de dados locais | Alto | Médio | Médio | Storage/Validation | TTL e versionamento |
| 4 | Dashboard com métricas reais | Alto | Médio | Baixo | Pomodoro/Erros/Redação | Horas, ciclos, streak |
| 5 | Lembretes nativos | Médio | Baixo | Baixo | Notifications | Lembrete diário + pomodoro |
| 6 | Sync em nuvem | Alto | Médio | Médio | API/Auth | Push/pull manual |
| 7 | Exportação calendário | Médio | Médio | Médio | Schedule | Download .ics |
| 8 | Monitoramento de produção | Médio | Baixo | Baixo | Logger/Env | Captura de erros + eventos |

## Sprint sugerida (curto prazo)
- Sprint 1: Onboarding, Backup/Restore, Métricas reais.
- Sprint 2: Segurança de dados locais, Lembretes nativos, Monitoramento de produção.

## Critério de sequência
- Sempre entregar valor funcional + validação (`lint/build`) por feature.
- Evitar features acopladas em lote; 1 tema por PR.
