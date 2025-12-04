**Projeto Connec-TIme — Instruções de execução**

Este repositório contém uma aplicação Next.js com TypeScript. Este README mostra os pré-requisitos, instalação e comandos para rodar o projeto em ambiente Windows (PowerShell).

**Requisitos**:
- **Node.js**: recomendado Node 18.x ou 20.x (versões LTS). Não use versões muito antigas (<18).
- **npm**: vem com o Node; pode usar `npm` padrão ou `yarn`/`pnpm` se preferir.

O projeto utiliza:
- `next` 16.x
- `react` / `react-dom` 19.x
- `typescript` 5.x

**Passos rápidos (PowerShell)**

- Verificar versões instaladas:

```powershell
node -v
npm -v
```

- Ir para a pasta do projeto e instalar dependências:

```powershell
cd 'c:\Users\patri\Downloads\Web\Projeto-Engenharia-Web-Connec-TIme\my-app'
# Se confiar no lockfile (mais reprodutível):
npm ci
# Ou (mais flexível):
npm install
```

- Rodar em modo desenvolvimento:

```powershell
npm run dev
```

- Build e execução em produção:

```powershell
npm run build
npm run start
```

- Verificar checagem de tipos (TypeScript):

```powershell
npx tsc --noEmit
```

- Executar linter:

```powershell
npm run lint
```

**Sobre Tailwind**
- O projeto tem `tailwindcss` nas devDependencies e `postcss.config.mjs` presente.
- No entanto, `app/globals.css` atualmente não contém as diretivas do Tailwind (`@tailwind base;`, `@tailwind components;`, `@tailwind utilities;`) e não há `tailwind.config.*` no repositório.
- Se você quiser ativar/configurar Tailwind, rode:

```powershell
npx tailwindcss init -p
```

Depois adicione no início de `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Observação: habilitar Tailwind em um código que já tem estilos manuais pode alterar a aparência. Faça testes e commits separados.

**Variáveis de ambiente**
- Não há `.env` no repositório (e `.gitignore` já ignora `.env*`). Se sua aplicação precisar de chaves ou configurações sensíveis, crie ` .env.local` na raiz de `my-app` com as variáveis necessárias (Next usa `.env.local` por padrão para desenvolvimento).
- Procure por usos de `process.env` no código para saber quais variáveis criar.

**VS Code - extensões úteis**
- `ESLint`
- `Tailwind CSS IntelliSense` (se usar Tailwind)
- `Prettier` (opcional)

**Soluções para problemas comuns**
- Se receber erro por versão do Node: atualize para Node 18+.
- Se `npm ci` falhar e você não precisa do lockfile exato: use `npm install`.
- Se o servidor não sobe, veja logs do terminal — erros de build ou tipos aparecem ali.

**Próximos passos sugeridos**
- Se desejar, posso:
  - Gerar automaticamente `tailwind.config.cjs` e inserir as diretivas em `app/globals.css`.
  - Criar um arquivo `README` mais detalhado com exemplos de desenvolvimento e deploy.
  - Procurar usos de `process.env.` no código e listar variáveis necessárias.

Arquivo criado em: `my-app/README.md`

---

Se quiser que eu já aplique a configuração do Tailwind automaticamente, responda `Sim` e eu faço o patch.
