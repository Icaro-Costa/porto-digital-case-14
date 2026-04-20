# NeuroMentor

Plataforma educacional com IA que transforma materiais didáticos em experiências de aprendizado interativas.

## Stack

- **Frontend:** Next.js 15 + TypeScript + Tailwind CSS + Zustand
- **Backend:** ASP.NET Core 10 (C#) + Entity Framework Core + PostgreSQL
- **IA:** Claude (Anthropic) — integração exclusivamente no backend

## Pré-requisitos

- Node.js 20 LTS
- .NET SDK 9+
- PostgreSQL 14+

## Configuração

**1. Clone o repositório**
```bash
git clone https://github.com/seu-usuario/neuromentor.git
cd neuromentor
```

**2. Configure o frontend**
```bash
cp .env.example .env
# Edite o .env com sua chave Anthropic
```

**3. Configure o backend**
```bash
cp backend/appsettings.example.json backend/appsettings.json
# Edite com seu usuário do PostgreSQL e chave Anthropic
```

**4. Crie o banco de dados**
```bash
createdb neuromentor
```

**5. Instale as dependências do frontend**
```bash
npm install
```

## Rodando

```bash
# Terminal 1 — PostgreSQL
brew services start postgresql@14

# Terminal 2 — Backend (aplica migrations automaticamente)
cd backend && dotnet run

# Terminal 3 — Frontend
npm run dev
```

Acesse: **http://localhost:3000**

## Documentação

- [Manual de Inicialização](MANUAL_INICIALIZACAO.md)
- [Documentação do Frontend](DOCS_FRONTEND.md)
- [Documentação do Backend](DOCS_BACKEND.md)
- [Documentação do Banco de Dados](DOCS_BANCO_DE_DADOS.md)
- [Documentação da IA](DOCS_IA.md)
