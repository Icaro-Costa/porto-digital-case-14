import { test, expect, type Page } from "@playwright/test";

const STUDENT_EMAIL = `aluno.e2e.${Date.now()}@teste.com`;
const STUDENT_PASSWORD = "Senha1234";
let studentRegistered = false;

async function registerAndLoginAsStudent(page: Page) {
  if (!studentRegistered) {
    await page.goto("/signup");
    await page.getByRole("button", { name: /aluno/i }).click();
    await page.locator('input[type="text"]').first().fill("Aluno E2E");
    await page.locator('input[type="email"]').fill(STUDENT_EMAIL);
    await page.locator('input[type="password"]').fill(STUDENT_PASSWORD);
    await page.locator('input[type="checkbox"]').check();
    await page.getByRole("button", { name: /criar conta/i }).last().click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
    studentRegistered = true;
  } else {
    await page.goto("/login");
    await page.locator('input[type="email"]').fill(STUDENT_EMAIL);
    await page.locator('input[type="password"]').fill(STUDENT_PASSWORD);
    await page.getByRole("button", { name: /entrar no dashboard/i }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  }
}

// ─── FLUXO DO ALUNO ─────────────────────────────────────────────────────────

test.describe("Aluno — Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await registerAndLoginAsStudent(page);
  });

  test("dashboard carrega com elementos principais", async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard/);
    // XP, streak ou nome do aluno
    await expect(page.getByText(/Aluno E2E|XP|nível/i).first()).toBeVisible({ timeout: 8000 });
  });

  test("navega para turmas", async ({ page }) => {
    await page.goto("/turmas");
    await expect(page.locator("body")).toBeVisible();
    // Não deve redirecionar para login
    await expect(page).not.toHaveURL(/\/login/);
  });

  test("navega para conquistas", async ({ page }) => {
    await page.goto("/conquistas");
    await expect(page.getByText(/conquistas|medalha|badge/i).first()).toBeVisible({ timeout: 8000 });
  });

  test("navega para o chat com IA", async ({ page }) => {
    await page.goto("/chat");
    await expect(page.getByText(/mentor|chat|mensagem|tutor/i).first()).toBeVisible({ timeout: 8000 });
  });

  test("navega para perfil", async ({ page }) => {
    await page.goto("/perfil");
    await expect(page.locator("body")).toBeVisible();
    await expect(page).not.toHaveURL(/\/login/);
  });
});

// ─── PROTEÇÃO DE ROTAS ───────────────────────────────────────────────────────

test.describe("Proteção de rotas", () => {
  test("rota protegida redireciona para login sem autenticação", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/, { timeout: 8000 });
  });

  test("rota de turmas redireciona sem autenticação", async ({ page }) => {
    await page.goto("/turmas");
    await expect(page).toHaveURL(/\/login/, { timeout: 8000 });
  });
});
