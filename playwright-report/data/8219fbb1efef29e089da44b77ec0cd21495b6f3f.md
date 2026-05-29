# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: teacher.spec.ts >> Professor — Navegação >> cria uma nova turma
- Location: e2e/teacher.spec.ts:31:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /nova turma/i })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8]
  - alert [ref=e11]
  - generic [ref=e12]:
    - generic [ref=e13]:
      - generic [ref=e14]:
        - img [ref=e16]
        - generic [ref=e18]: NeuroMentor
      - generic [ref=e19]:
        - heading "Bem-vindo de volta" [level=1] [ref=e20]
        - paragraph [ref=e21]: Continue sua jornada com seu mentor de IA.
        - generic [ref=e22]:
          - generic [ref=e23]:
            - generic [ref=e24]: Email
            - generic [ref=e25]:
              - img [ref=e26]
              - textbox [ref=e29]
          - generic [ref=e30]:
            - generic [ref=e31]:
              - generic [ref=e32]: Senha
              - link "Esqueceu a senha?" [ref=e33] [cursor=pointer]:
                - /url: "#"
            - generic [ref=e34]:
              - img [ref=e35]
              - textbox [ref=e38]
              - button [ref=e39]:
                - img [ref=e40]
          - button "Entrar no Dashboard" [ref=e43]
          - paragraph [ref=e44]:
            - text: Não tem conta?
            - link "Criar conta grátis" [ref=e45] [cursor=pointer]:
              - /url: /signup
    - generic [ref=e47]:
      - generic [ref=e48]:
        - generic [ref=e49]: 🎓
        - generic [ref=e50]:
          - paragraph [ref=e51]: Aulas personalizadas
          - paragraph [ref=e52]: O mentor adapta o conteúdo ao seu ritmo e estilo de aprendizado.
      - generic [ref=e53]:
        - generic [ref=e54]: 💬
        - generic [ref=e55]:
          - paragraph [ref=e56]: Chat com o material
          - paragraph [ref=e57]: Tire dúvidas diretamente sobre o PDF da aula em tempo real.
      - generic [ref=e58]:
        - generic [ref=e59]: ✏️
        - generic [ref=e60]:
          - paragraph [ref=e61]: Exercícios gerados por IA
          - paragraph [ref=e62]: Pratique com questões criadas a partir do conteúdo da sua turma.
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
> 36 |     await page.getByRole("button", { name: /nova turma/i }).click();
     |                                                             ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
  48 |     await expect(page.getByText(/analytics|progresso|estatísticas/i).first()).toBeVisible({ timeout: 8000 });
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