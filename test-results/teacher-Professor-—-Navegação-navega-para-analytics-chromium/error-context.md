# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: teacher.spec.ts >> Professor — Navegação >> navega para analytics
- Location: e2e/teacher.spec.ts:46:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/analytics|progresso|estatísticas/i).first()
Expected: visible
Timeout: 8000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 8000ms
  - waiting for getByText(/analytics|progresso|estatísticas/i).first()

```

```yaml
- alert
- complementary:
  - img
  - text: NeuroMentor
  - paragraph: CRIAR AULA
  - navigation:
    - link "Upload de Materiais":
      - /url: /lesson-builder/upload
      - img
      - text: Upload de Materiais
    - link "Processamento":
      - /url: /lesson-builder/processing
      - img
      - text: Processamento
    - link "Revisão e Validação":
      - /url: /lesson-builder/review
      - img
      - text: Revisão e Validação
    - link "Chat com Material":
      - /url: /lesson-builder/pdf-viewer
      - img
      - text: Chat com Material
    - paragraph: ADMIN
    - link "Gerenciar usuários":
      - /url: /admin/usuarios
      - img
      - text: Gerenciar usuários
    - paragraph: TURMAS
    - link "Gerenciar turmas":
      - /url: /turmas
      - img
      - text: Gerenciar turmas
    - link "Revisão do chat":
      - /url: /professor/revisoes
      - img
      - text: Revisão do chat
  - link "Í":
    - /url: /perfil
  - link "Ícaro Costa ADM":
    - /url: /perfil
    - paragraph: Ícaro Costa
    - paragraph: ADM
  - button "Sair":
    - img
- banner:
  - navigation: ADM / Upload de Materiais
  - link "+ Nova aula":
    - /url: /lesson-builder/upload
  - button:
    - img
- heading "Upload de Materiais" [level=1]
- paragraph: Arraste e solte seu PDF, DOCX ou TXT. O Mentor gera a estrutura pedagógica automaticamente.
- img
- heading "Arraste arquivos aqui" [level=3]
- paragraph: PDF, DOCX, TXT. Tamanho máximo 50MB por documento.
- button "Selecionar arquivos":
  - img
  - text: Selecionar arquivos
- paragraph:
  - img
  - text: Upload seguro. Arquivos não são usados para treinamento.
- button "Continuar para Processamento →" [disabled]
```

# Test source

```ts
  1  | import { test, expect, type Page } from "@playwright/test";
  2  | 
  3  | const TEACHER_EMAIL = "icaro.costa@gmail.com";
  4  | const TEACHER_PASSWORD = "13052891idI";
  5  | 
  6  | async function loginAsTeacher(page: Page) {
  7  |   await page.goto("/login");
  8  |   await page.locator('input[type="email"]').fill(TEACHER_EMAIL);
  9  |   await page.locator('input[type="password"]').fill(TEACHER_PASSWORD);
  10 |   await page.getByRole("button", { name: /entrar no dashboard/i }).click();
  11 |   await expect(page).toHaveURL(/\/lesson-builder/, { timeout: 10000 });
  12 | }
  13 | 
  14 | // ─── FLUXO DO PROFESSOR ─────────────────────────────────────────────────────
  15 | 
  16 | test.describe("Professor — Navegação", () => {
  17 |   test.beforeEach(async ({ page }) => {
  18 |     await loginAsTeacher(page);
  19 |   });
  20 | 
  21 |   test("página de upload de materiais carrega corretamente", async ({ page }) => {
  22 |     await expect(page).toHaveURL(/\/lesson-builder\/upload/);
  23 |     await expect(page.getByText(/upload|material|PDF/i).first()).toBeVisible();
  24 |   });
  25 | 
  26 |   test("navega para turmas e exibe lista", async ({ page }) => {
  27 |     await page.goto("/turmas");
  28 |     await expect(page.getByRole("heading", { name: /turmas/i })).toBeVisible({ timeout: 8000 });
  29 |   });
  30 | 
  31 |   test("cria uma nova turma", async ({ page }) => {
  32 |     await page.goto("/turmas");
  33 |     await expect(page.getByRole("heading", { name: /turmas/i })).toBeVisible({ timeout: 8000 });
  34 | 
  35 |     // Clica no botão de nova turma
  36 |     await page.getByRole("button", { name: /nova turma/i }).click();
  37 |     await expect(page.locator('input[placeholder*="nome" i]')).toBeVisible();
  38 | 
  39 |     const nomeTurma = `Turma Playwright ${Date.now()}`;
  40 |     await page.locator('input[placeholder*="nome" i]').fill(nomeTurma);
  41 |     await page.getByRole("button", { name: /criar/i }).click();
  42 | 
  43 |     await expect(page.getByText(nomeTurma)).toBeVisible({ timeout: 8000 });
  44 |   });
  45 | 
  46 |   test("navega para analytics", async ({ page }) => {
  47 |     await page.goto("/analytics");
> 48 |     await expect(page.getByText(/analytics|progresso|estatísticas/i).first()).toBeVisible({ timeout: 8000 });
     |                                                                               ^ Error: expect(locator).toBeVisible() failed
  49 |   });
  50 | 
  51 |   test("navega para admin de usuários", async ({ page }) => {
  52 |     await page.goto("/admin/usuarios");
  53 |     await expect(page.getByText(/usuários|admin/i).first()).toBeVisible({ timeout: 8000 });
  54 |   });
  55 | 
  56 |   test("lista de revisões do professor carrega", async ({ page }) => {
  57 |     await page.goto("/professor/revisoes");
  58 |     await expect(page.getByText(/revisão|exercícios/i).first()).toBeVisible({ timeout: 8000 });
  59 |   });
  60 | });
  61 | 
```