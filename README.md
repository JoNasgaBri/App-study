# App Study

Aplicação de apoio a estudos com foco em planejamento, pomodoro e acompanhamento de desempenho.

## Scripts
- `npm run dev`: ambiente de desenvolvimento
- `npm run lint`: validação de qualidade
- `npm run build`: build de produção
- `npm run preview`: pré-visualização da build

## Ambiente
Use `.env.example` como referência e crie seu `.env` local.

Variáveis mínimas:
- `VITE_APP_ENV`
- `VITE_APP_VERSION`
- `VITE_API_BASE_URL`
- `VITE_API_TIMEOUT_MS`

## Estrutura
- `src/app`: shell e composição da aplicação
- `src/features`: módulos de negócio
- `src/shared`: configuração, utilitários, integração e observabilidade
- `docs`: roadmap e checklist operacional
