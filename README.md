# NeuroMentor

Plataforma educacional que utiliza inteligência artificial para transformar materiais de ensino em experiências interativas de aprendizado. Professores fazem upload de PDFs e documentos; a IA gera aulas estruturadas, exercícios baseados na Taxonomia de Bloom, corrige respostas e atua como tutor em tempo real via chat.

---

## Sumário

- [Tecnologias](#tecnologias)
- [Como Executar](#como-executar)
- [Arquitetura Distribuída](#1-arquitetura-distribuída)
- [Diagrama da Arquitetura](#2-diagrama-da-arquitetura)
- [Concorrência e Paralelismo](#3-concorrência-e-paralelismo)
- [Otimização](#4-otimização)

---

## Tecnologias

| Camada | Stack |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Zustand |
| Backend | ASP.NET Core 10, C#, Entity Framework Core |
| Banco de dados | PostgreSQL 16 |
| IA | Claude API (Anthropic) — modelo `claude-sonnet-4-5` |
| Containers | Docker, Docker Compose |
| Deploy | Vercel (frontend) · Railway (backend + banco) |

---

## Como Executar

**Pré-requisitos:** Node.js 20 LTS, .NET SDK 9+, PostgreSQL 14+

### Com Docker (recomendado)

```bash
cp .env.example .env
# preencher ANTHROPIC_API_KEY no .env
docker compose up --build
```

Acesse `http://localhost:3000`.

### Manual

```bash
# Terminal 1 — banco
psql -c "CREATE DATABASE neuromentor;"

# Terminal 2 — backend (porta 8080, roda migrations automaticamente)
cd backend
dotnet run

# Terminal 3 — frontend (porta 3000)
npm install
npm run dev
```

Variáveis de ambiente necessárias: veja `.env.example`.

---

## 1. Arquitetura Distribuída

### Modelo Adotado: Cliente-Servidor em 3 Camadas (3-tier)

O sistema é composto por quatro componentes independentes que rodam em processos e/ou containers separados, comunicando-se exclusivamente pela rede:

| Componente | Responsabilidade | Tecnologia |
|---|---|---|
| **Frontend** | Interface do usuário, navegação, estado local | Next.js 15 / TypeScript |
| **Backend** | Regras de negócio, autenticação JWT, orquestração da IA | ASP.NET Core 10 / C# |
| **Banco de Dados** | Persistência de usuários, aulas, módulos, tentativas | PostgreSQL 16 |
| **Claude API** | Geração de conteúdo, correção, chat tutoral | Anthropic (serviço externo) |

### Justificativa da Escolha Arquitetural

A separação em camadas independentes foi escolhida pelos seguintes motivos:

- **Segurança:** a chave da API da Anthropic nunca é exposta ao cliente — toda comunicação com a IA passa pelo backend, que valida autenticação e autorização antes de qualquer chamada.
- **Escalabilidade independente:** o frontend é servido por CDN global (Vercel), o backend pode ter múltiplas instâncias na Railway, e o banco de dados escala verticalmente sem afetar as outras camadas.
- **Substituição de componentes:** é possível trocar o banco de dados, o provedor de IA ou o framework de frontend sem reescrever o sistema inteiro, pois as interfaces entre camadas são contratos HTTP bem definidos.
- **Deploy heterogêneo:** frontend em Vercel (serverless, CDN), backend em Railway (container persistente), cada um com ciclo de deploy independente.

---

## 2. Diagrama da Arquitetura

```
┌──────────────────────────────────────────────────────────────────┐
│                      USUÁRIO / BROWSER                           │
└────────────────────────────┬─────────────────────────────────────┘
                              │  HTTPS
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│              FRONTEND — Next.js 15 (TypeScript)                  │
│                                                                  │
│  Zustand (estado global) · Tailwind CSS (UI)                     │
│  Server Components + Client Components                           │
│  Deploy: Vercel · Porta local: 3000                              │
└────────────────────────────┬─────────────────────────────────────┘
                              │  HTTP/REST + SSE (streaming)
                              │  Porta 8080 · JSON payload
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│             BACKEND — ASP.NET Core 10 (C#)                       │
│                                                                  │
│  Controllers                  Services                           │
│  ├─ AuthController            ├─ JwtService                      │
│  ├─ ChatController  ────────► ├─ ClaudeService (streaming SSE)   │
│  ├─ LessonsController         └─ TextExtractionService           │
│  ├─ ExercisesController                                          │
│  ├─ ClassesController         Entity Framework Core (ORM)        │
│  ├─ ReviewController          Migrations automáticas no startup  │
│  └─ AdminController                                              │
│                                                                  │
│  Auth: JWT Bearer · CORS configurado por origem                  │
│  Deploy: Railway · Porta local: 8080                             │
└──────────┬───────────────────────────┬───────────────────────────┘
           │                           │
           │ TCP / Npgsql              │ HTTPS / REST + SSE
           │ Connection String         │ x-api-key header
           ▼                           ▼
┌──────────────────┐       ┌───────────────────────────┐
│  PostgreSQL 16   │       │   Claude API (Anthropic)  │
│                  │       │                           │
│  Tabelas:        │       │  Modelo: claude-sonnet-4-5│
│  Users           │       │  Endpoints:               │
│  Lessons         │       │  POST /v1/messages        │
│  LessonModules   │       │  (stream: true para chat) │
│  Classes         │       │                           │
│  Exercises       │       │  Protocolo de resposta:   │
│  Attempts        │       │  Server-Sent Events (SSE) │
│                  │       │                           │
│  Porta: 5432     │       │  Serviço externo gerenciado│
│  Volume: pgdata  │       │  pela Anthropic            │
└──────────────────┘       └───────────────────────────┘
```

### Protocolos de Comunicação

| Interação | Protocolo | Formato | Observação |
|---|---|---|---|
| Browser → Frontend | HTTPS | HTML/JS/CSS | Next.js SSR + CSR |
| Frontend → Backend (dados) | HTTP/REST | JSON | CRUD de aulas, exercícios, auth |
| Frontend → Backend (chat) | HTTP + SSE | `text/event-stream` | Streaming chunk a chunk |
| Backend → Claude API | HTTPS/REST | JSON + SSE | `stream: true` para chat |
| Backend → PostgreSQL | TCP (Npgsql) | Protocolo binário PG | Via Entity Framework Core |
| Docker serviços | Rede interna Docker | TCP | `db:5432`, `api:8080` |

---

## 3. Concorrência e Paralelismo

### Mecanismo 1 — Async/Await Pervasivo (Corrotinas .NET)

**Componente:** Todos os Controllers (`ChatController`, `LessonsController`, `ExercisesController`, etc.)

**O que é:** O ASP.NET Core processa cada requisição HTTP em uma thread do thread pool de forma não-bloqueante. Nenhuma operação de I/O (banco de dados, chamada à IA, leitura de arquivo) bloqueia a thread enquanto aguarda resposta.

```csharp
// LessonsController.cs — três operações de I/O, nenhuma bloqueia a thread
[HttpPost("{id}/generate")]
public async Task<IActionResult> Generate(int id)
{
    // Thread liberada enquanto aguarda resposta do banco (~1-5ms)
    var lesson = await _db.Lessons
        .Include(l => l.Modules)
        .FirstOrDefaultAsync(l => l.Id == id);

    // Thread liberada enquanto aguarda resposta da IA (~2-10s)
    var result = await _claudeService.CompleteAsync(systemPrompt, userMessage);

    // Thread liberada enquanto aguarda confirmação do banco
    await _db.SaveChangesAsync();

    return Ok(lesson);
}
```

**Problema resolvido:** Com async/await, o servidor consegue atender centenas de requisições simultâneas com um número fixo de threads. Sem ele, cada chamada à Claude API (que demora 2-10 segundos) bloquearia uma thread inteira — com 50 usuários simultâneos, o servidor trancaria.

---

### Mecanismo 2 — Streaming Assíncrono com `IAsyncEnumerable` e `CancellationToken`

**Componente:** `Services/ClaudeService.cs` (método `StreamAsync`) + `Controllers/ChatController.cs`

**O que é:** Em vez de aguardar a resposta completa da IA para então enviá-la ao cliente, o sistema usa Server-Sent Events (SSE) para transmitir cada fragmento de texto à medida que é gerado pela IA.

```csharp
// ClaudeService.cs — produz chunks à medida que chegam da API
public async IAsyncEnumerable<string> StreamAsync(
    string systemPrompt,
    string userMessage,
    [EnumeratorCancellation] CancellationToken ct = default)
{
    // Lê a resposta SSE da Anthropic linha por linha
    while (!reader.EndOfStream)
    {
        var line = await reader.ReadLineAsync(ct); // não bloqueia
        if (line?.StartsWith("data: ") == true)
        {
            var json = JsonDocument.Parse(line[6..]);
            // Filtra eventos de tipo "content_block_delta"
            if (json.RootElement.GetProperty("type").GetString()
                == "content_block_delta")
            {
                yield return delta; // entrega chunk imediatamente
            }
        }
    }
}

// ChatController.cs — repassa cada chunk ao browser via SSE
[HttpPost("stream")]
public async Task Stream([FromBody] ChatRequest req, CancellationToken ct)
{
    Response.ContentType = "text/event-stream";
    await foreach (var chunk in _claude.StreamAsync(system, user, ct))
    {
        // Formato compatível com AI SDK do Vercel
        await Response.WriteAsync($"0:{JsonSerializer.Serialize(chunk)}\n");
        await Response.Body.FlushAsync(ct); // força envio imediato
    }
}
```

**Mecanismo:** `IAsyncEnumerable<string>` (produtor assíncrono) + `CancellationToken` (cancelamento cooperativo quando o usuário fecha a aba)

**Problema resolvido:** Reduz o tempo de espera percebido pelo usuário de ~8-12 segundos (esperar a resposta completa) para menos de 1 segundo (primeiras palavras aparecem imediatamente). O `CancellationToken` garante que a chamada à Claude API seja interrompida se o usuário navegar para outra página — evitando processamento e custo desnecessários.

---

### Mecanismo 3 — Thread Pool do .NET Runtime (Nível de Infraestrutura)

**Componente:** Runtime do ASP.NET Core (implícito)

O runtime do .NET mantém um pool de threads gerenciado automaticamente que despacha requisições HTTP concorrentes. Combinado com o modelo async/await, o servidor nunca precisa criar uma thread nova por requisição — o pool é reutilizado de forma eficiente.

**Ganho:** Suporta alta concorrência (centenas de usuários simultâneos) com consumo de memória previsível e sem overhead de criação de threads.

---

## 4. Otimização

### Otimizações Implementadas

#### a) Seleção Inteligente de Contexto para a IA

**Componente:** `Controllers/ChatController.cs` — método `BuildContext()`

Antes de cada chamada à Claude API, o sistema decide qual contexto enviar priorizando os menores trechos mais relevantes:

```
Prioridade 1: chunk do módulo específico   → foco máximo, poucos tokens
Prioridade 2: módulos da aula completa     → contexto médio
Prioridade 3: material bruto (cap: 8.000 chars) → fallback com limite
```

**Impacto:** Reduz em até 80% os tokens enviados por mensagem em comparação com enviar o documento completo. Menor custo por requisição ($) e menor latência (menos tokens = resposta mais rápida).

---

#### b) Extração de Chunks por Relevância

**Componente:** `Services/TextExtractionService.cs` — método `ExtractChunk()`

O serviço pontua cada parágrafo do documento por relevância antes de criar os módulos de aula, selecionando apenas os trechos mais informativos. Documentos de até 50 MB são reduzidos a trechos essenciais antes de qualquer chamada à API.

**Impacto:** A qualidade dos módulos gerados melhora (contexto mais denso) e o custo por geração de aula cai significativamente.

---

#### c) Streaming para Redução do Tempo de Resposta Percebido

**Componente:** `ClaudeService.StreamAsync` + `ChatController`

Sem streaming: usuário aguarda ~8-12s com tela em branco antes de ver qualquer resposta.  
Com streaming: primeiras palavras aparecem em ~0,5s, experiência semelhante a uma conversa real.

**Impacto:** Redução de ~95% no tempo para a primeira palavra (TTFW — Time To First Word).

---

#### d) Eager Loading para Evitar N+1 Queries

**Componente:** `Controllers/LessonsController.cs`

```csharp
// Uma única query com JOIN, em vez de 1 + N queries separadas
_db.Lessons.Include(l => l.Modules).FirstOrDefaultAsync(...)
```

**Impacto:** Para uma aula com 10 módulos, reduz de 11 queries ao banco para 1.

---

#### e) Health Checks no Docker Compose

```yaml
# O backend só inicia após o PostgreSQL estar respondendo
depends_on:
  db:
    condition: service_healthy
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U neuromentor"]
  interval: 5s
  retries: 10
```

**Impacto:** Elimina erros de conexão no startup e tentativas de reconexão desnecessárias.

---

### Otimizações Futuras Identificadas

| Ponto | Problema Atual | Solução Proposta | Ganho Esperado |
|---|---|---|---|
| `TextExtractionService` | Extração de PDF é síncrona (bloqueia thread) | Converter para `async` com `ReadToEndAsync` + `Parallel.ForEach` na pontuação | Suportar uploads simultâneos sem bloquear o servidor |
| Geração de módulos | Módulos de uma aula gerados em sequência | `Task.WhenAll()` para gerar módulos em paralelo | Reduzir tempo de geração de aula de ~15s para ~5s |
| Cache de exercícios | Exercícios do mesmo material são regenerados a cada chamada | Cache Redis com chave `hash(lessonId + bloomLevel)` | Eliminar ~60% das chamadas à Claude API |
| Busca semântica | Chat usa contexto textual fixo | Embeddings + busca vetorial (pgvector) | Contexto sempre mais relevante independente do tamanho do material |

---

## Estrutura de Pastas

```
porto-digital-case-14/
├── app/                    # Páginas e componentes Next.js
├── backend/                # ASP.NET Core 10
│   ├── Controllers/        # Endpoints HTTP
│   ├── Services/           # ClaudeService, JwtService, TextExtractionService
│   ├── Models/             # Entidades do domínio
│   ├── DTOs/               # Data Transfer Objects
│   ├── Data/               # DbContext, migrations
│   └── Dockerfile
├── src/                    # Componentes compartilhados do frontend
├── e2e/                    # Testes end-to-end (Playwright)
├── docker-compose.yml      # Orquestração local (frontend + backend + postgres)
├── Dockerfile.frontend
└── .env.example
```

---

## Licença

Projeto acadêmico desenvolvido para a disciplina de Projetos / Embarque Digital — Porto Digital.
