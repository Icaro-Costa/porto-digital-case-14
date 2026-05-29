import { test, expect, type Page } from "@playwright/test";

const TEACHER_EMAIL = "icaro.costa@gmail.com";
const TEACHER_PASSWORD = "13052891idI";

async function loginAsTeacher(page: Page) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill(TEACHER_EMAIL);
  await page.locator('input[type="password"]').fill(TEACHER_PASSWORD);
  await page.getByRole("button", { name: /entrar no dashboard/i }).click();
  await expect(page).toHaveURL(/\/lesson-builder/, { timeout: 10000 });
}

// ─── FLUXO DO PROFESSOR ─────────────────────────────────────────────────────

test.describe("Professor — Navegação", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTeacher(page);
  });

  test("página de upload de materiais carrega corretamente", async ({ page }) => {
    await expect(page).toHaveURL(/\/lesson-builder\/upload/);
    await expect(page.getByText(/upload|material|PDF/i).first()).toBeVisible();
  });

  test("navega para turmas e exibe lista", async ({ page }) => {
    await page.goto("/turmas");
    await expect(page.getByRole("heading", { name: /turmas/i })).toBeVisible({ timeout: 8000 });
  });

  test("cria uma nova turma", async ({ page }) => {
    await page.goto("/turmas");
    await expect(page.getByRole("heading", { name: /turmas/i })).toBeVisible({ timeout: 8000 });

    // Clica no botão de nova turma
    await page.getByRole("button", { name: /nova turma/i }).click();
    await expect(page.locator('input[placeholder*="nome" i]')).toBeVisible();

    const nomeTurma = `Turma Playwright ${Date.now()}`;
    await page.locator('input[placeholder*="nome" i]').fill(nomeTurma);
    await page.getByRole("button", { name: /criar/i }).click();

    await expect(page.getByText(nomeTurma)).toBeVisible({ timeout: 8000 });
  });

  test("navega para analytics", async ({ page }) => {
    await page.goto("/analytics");
    await expect(page.getByText(/analytics|progresso|estatísticas/i).first()).toBeVisible({ timeout: 8000 });
  });

  test("navega para admin de usuários", async ({ page }) => {
    await page.goto("/admin/usuarios");
    await expect(page.getByText(/usuários|admin/i).first()).toBeVisible({ timeout: 8000 });
  });

  test("lista de revisões do professor carrega", async ({ page }) => {
    await page.goto("/professor/revisoes");
    await expect(page.getByText(/revisão|exercícios/i).first()).toBeVisible({ timeout: 8000 });
  });
});
