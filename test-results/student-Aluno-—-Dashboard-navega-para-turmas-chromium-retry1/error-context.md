# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: student.spec.ts >> Aluno — Dashboard >> navega para turmas
- Location: e2e/student.spec.ts:40:7

# Error details

```
Error: expect(page).not.toHaveURL(expected) failed

Expected pattern: not /\/login/
Received string: "http://localhost:3000/login"
Timeout: 5000ms

Call log:
  - Expect "not toHaveURL" with timeout 5000ms
    14 × unexpected value "http://localhost:3000/login"

```

```yaml
- alert
- img
- text: NeuroMentor
- heading "Bem-vindo de volta" [level=1]
- paragraph: Continue sua jornada com seu mentor de IA.
- text: Email
- img
- textbox
- text: Senha
- link "Esqueceu a senha?":
  - /url: "#"
- img
- textbox
- button:
  - img
- button "Entrar no Dashboard"
- paragraph:
  - text: Não tem conta?
  - link "Criar conta grátis":
    - /url: /signup
- text: 🎓
- paragraph: Aulas personalizadas
- paragraph: O mentor adapta o conteúdo ao seu ritmo e estilo de aprendizado.
- text: 💬
- paragraph: Chat com o material
- paragraph: Tire dúvidas diretamente sobre o PDF da aula em tempo real.
- text: ✏️
- paragraph: Exercícios gerados por IA
- paragraph: Pratique com questões criadas a partir do conteúdo da sua turma.
```

# Test source

```ts
  1  | import { test, expect, type Page } from "@playwright/test";
  2  | 
  3  | const STUDENT_EMAIL = `aluno.e2e.${Date.now()}@teste.com`;
  4  | const STUDENT_PASSWORD = "Senha1234";
  5  | let studentRegistered = false;
  6  | 
  7  | async function registerAndLoginAsStudent(page: Page) {
  8  |   if (!studentRegistered) {
  9  |     await page.goto("/signup");
  10 |     await page.getByRole("button", { name: /aluno/i }).click();
  11 |     await page.locator('input[type="text"]').first().fill("Aluno E2E");
  12 |     await page.locator('input[type="email"]').fill(STUDENT_EMAIL);
  13 |     await page.locator('input[type="password"]').fill(STUDENT_PASSWORD);
  14 |     await page.locator('input[type="checkbox"]').check();
  15 |     await page.getByRole("button", { name: /criar conta/i }).last().click();
  16 |     await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  17 |     studentRegistered = true;
  18 |   } else {
  19 |     await page.goto("/login");
  20 |     await page.locator('input[type="email"]').fill(STUDENT_EMAIL);
  21 |     await page.locator('input[type="password"]').fill(STUDENT_PASSWORD);
  22 |     await page.getByRole("button", { name: /entrar no dashboard/i }).click();
  23 |     await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  24 |   }
  25 | }
  26 | 
  27 | // ─── FLUXO DO ALUNO ─────────────────────────────────────────────────────────
  28 | 
  29 | test.describe("Aluno — Dashboard", () => {
  30 |   test.beforeEach(async ({ page }) => {
  31 |     await registerAndLoginAsStudent(page);
  32 |   });
  33 | 
  34 |   test("dashboard carrega com elementos principais", async ({ page }) => {
  35 |     await expect(page).toHaveURL(/\/dashboard/);
  36 |     // XP, streak ou nome do aluno
  37 |     await expect(page.getByText(/Aluno E2E|XP|nível/i).first()).toBeVisible({ timeout: 8000 });
  38 |   });
  39 | 
  40 |   test("navega para turmas", async ({ page }) => {
  41 |     await page.goto("/turmas");
  42 |     await expect(page.locator("body")).toBeVisible();
  43 |     // Não deve redirecionar para login
> 44 |     await expect(page).not.toHaveURL(/\/login/);
     |                            ^ Error: expect(page).not.toHaveURL(expected) failed
  45 |   });
  46 | 
  47 |   test("navega para conquistas", async ({ page }) => {
  48 |     await page.goto("/conquistas");
  49 |     await expect(page.getByText(/conquistas|medalha|badge/i).first()).toBeVisible({ timeout: 8000 });
  50 |   });
  51 | 
  52 |   test("navega para o chat com IA", async ({ page }) => {
  53 |     await page.goto("/chat");
  54 |     await expect(page.getByText(/mentor|chat|mensagem|tutor/i).first()).toBeVisible({ timeout: 8000 });
  55 |   });
  56 | 
  57 |   test("navega para perfil", async ({ page }) => {
  58 |     await page.goto("/perfil");
  59 |     await expect(page.locator("body")).toBeVisible();
  60 |     await expect(page).not.toHaveURL(/\/login/);
  61 |   });
  62 | });
  63 | 
  64 | // ─── PROTEÇÃO DE ROTAS ───────────────────────────────────────────────────────
  65 | 
  66 | test.describe("Proteção de rotas", () => {
  67 |   test("rota protegida redireciona para login sem autenticação", async ({ page }) => {
  68 |     await page.goto("/dashboard");
  69 |     await expect(page).toHaveURL(/\/login/, { timeout: 8000 });
  70 |   });
  71 | 
  72 |   test("rota de turmas redireciona sem autenticação", async ({ page }) => {
  73 |     await page.goto("/turmas");
  74 |     await expect(page).toHaveURL(/\/login/, { timeout: 8000 });
  75 |   });
  76 | });
  77 | 
```