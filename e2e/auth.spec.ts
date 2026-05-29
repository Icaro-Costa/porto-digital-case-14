import { test, expect } from "@playwright/test";

const TEACHER_EMAIL = "icaro.costa@gmail.com";
const TEACHER_PASSWORD = "13052891idI";
const STUDENT_EMAIL = `aluno.teste.${Date.now()}@teste.com`;
const STUDENT_PASSWORD = "Senha1234";

// ─── LOGIN ──────────────────────────────────────────────────────────────────

test.describe("Login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("exibe a página de login corretamente", async ({ page }) => {
    await expect(page).toHaveTitle(/neuromentor/i);
    await expect(page.getByRole("heading", { name: /bem-vindo de volta/i })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole("button", { name: /entrar no dashboard/i })).toBeVisible();
  });

  test("exibe erro ao submeter com campos vazios", async ({ page }) => {
    await page.getByRole("button", { name: /entrar no dashboard/i }).click();
    await expect(page.locator("text=Informe email e senha")).toBeVisible();
  });

  test("exibe erro com credenciais inválidas", async ({ page }) => {
    await page.locator('input[type="email"]').fill("errado@teste.com");
    await page.locator('input[type="password"]').fill("senhaerrada");
    await page.getByRole("button", { name: /entrar no dashboard/i }).click();
    await expect(page.locator(".text-red-400")).toBeVisible({ timeout: 8000 });
  });

  test("login do professor redireciona para lesson-builder", async ({ page }) => {
    await page.locator('input[type="email"]').fill(TEACHER_EMAIL);
    await page.locator('input[type="password"]').fill(TEACHER_PASSWORD);
    await page.getByRole("button", { name: /entrar no dashboard/i }).click();
    await expect(page).toHaveURL(/\/lesson-builder/, { timeout: 10000 });
  });

  test("toggle de mostrar/ocultar senha funciona", async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill("minhasenha");
    await expect(passwordInput).toHaveAttribute("type", "password");
    await page.locator('button[type="button"]').click();
    await expect(page.locator('input[type="text"]')).toHaveValue("minhasenha");
  });

  test("link para cadastro está funcionando", async ({ page }) => {
    await page.getByRole("link", { name: /criar conta grátis/i }).click();
    await expect(page).toHaveURL(/\/signup/);
  });
});

// ─── CADASTRO ──────────────────────────────────────────────────────────────

test.describe("Cadastro", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/signup");
  });

  test("exibe a página de cadastro corretamente", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /criar conta/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /aluno/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /professor/i })).toBeVisible();
  });

  test("exibe erro ao submeter com campos vazios", async ({ page }) => {
    await page.getByRole("button", { name: /criar conta/i }).last().click();
    await expect(page.locator("text=Preencha todos os campos")).toBeVisible();
  });

  test("exibe erro com senha curta", async ({ page }) => {
    await page.locator('input[placeholder*="nome" i], input[type="text"]').first().fill("Teste");
    await page.locator('input[type="email"]').fill("teste@teste.com");
    await page.locator('input[type="password"]').fill("123");
    // accept terms
    await page.locator('input[type="checkbox"]').check();
    await page.getByRole("button", { name: /criar conta/i }).last().click();
    await expect(page.locator("text=8 caracteres")).toBeVisible();
  });

  test("cadastro de aluno redireciona para dashboard", async ({ page }) => {
    // seleciona Aluno
    await page.getByRole("button", { name: /aluno/i }).click();
    await page.locator('input[type="text"]').first().fill("Aluno Teste");
    await page.locator('input[type="email"]').fill(STUDENT_EMAIL);
    await page.locator('input[type="password"]').fill(STUDENT_PASSWORD);
    await page.locator('input[type="checkbox"]').check();
    await page.getByRole("button", { name: /criar conta/i }).last().click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });
});
