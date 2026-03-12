# Release Checklist — Frontend

## Pré-merge
- `npm run lint` verde
- `npm run build` verde
- Review técnico aprovado
- Sem dependências críticas com vulnerabilidade aberta

## Pré-deploy
- Variáveis `VITE_*` revisadas
- Feature flags conferidas
- Versão da aplicação atualizada

## Pós-deploy (smoke)
- App abre e renderiza shell principal
- Navegação entre abas funciona
- Persistência local funciona (tema/video)
- Pomodoro inicia/pausa/reset
- Sem erro crítico no console

## Rollback
- Reverter para última versão estável do bundle
- Revalidar smoke checklist
