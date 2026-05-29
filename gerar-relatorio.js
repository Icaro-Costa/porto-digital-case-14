const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageNumber, Header, Footer
} = require("docx");
const fs = require("fs");

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 160 },
    children: [new TextRun({ text, bold: true, size: 32, font: "Arial", color: "2E3A59" })]
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, size: 26, font: "Arial", color: "4A5568" })]
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 160 },
    children: [new TextRun({ text, size: 22, font: "Arial", ...opts })]
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 100 },
    children: [new TextRun({ text, size: 22, font: "Arial" })]
  });
}

function divider() {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" } },
    children: []
  });
}

function statusBadge(status, label) {
  const color = status === "fail" ? "FED7D7" : "C6F6D5";
  const textColor = status === "fail" ? "C53030" : "276749";
  return new TableCell({
    borders,
    width: { size: 1800, type: WidthType.DXA },
    shading: { fill: color, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: label, bold: true, size: 20, font: "Arial", color: textColor })]
    })]
  });
}

function testRow(name, status, label) {
  return new TableRow({
    children: [
      new TableCell({
        borders,
        width: { size: 7560, type: WidthType.DXA },
        shading: { fill: "F7FAFC", type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: name, size: 20, font: "Arial" })] })]
      }),
      statusBadge(status, label)
    ]
  });
}

const doc = new Document({
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: "•",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } }
      }]
    }]
  },
  styles: {
    default: {
      document: { run: { font: "Arial", size: 22 } }
    }
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E0" } },
          children: [new TextRun({ text: "NeuroMentor — Relatório de Testes E2E", size: 18, font: "Arial", color: "718096" })]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Página ", size: 18, font: "Arial", color: "718096" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, font: "Arial", color: "718096" }),
            new TextRun({ text: " de ", size: 18, font: "Arial", color: "718096" }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, font: "Arial", color: "718096" })
          ]
        })]
      })
    },
    children: [

      // ── TÍTULO
      new Paragraph({
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "Relatório de Falhas — Testes Ponta a Ponta", bold: true, size: 44, font: "Arial", color: "1A202C" })]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text: "Projeto: NeuroMentor  |  Framework: Playwright  |  Data: 29/05/2026", size: 20, font: "Arial", color: "718096" })]
      }),
      divider(),

      // ── RESUMO
      heading1("1. Resumo Geral"),
      body("A suíte de testes E2E do NeuroMentor executou 23 casos de teste distribuídos em 3 arquivos (auth, teacher, student). Do total, 20 passaram e 3 falharam. Abaixo está a visão geral de todos os testes:"),

      new Paragraph({ spacing: { after: 160 }, children: [] }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [7560, 1800],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders,
                width: { size: 7560, type: WidthType.DXA },
                shading: { fill: "2E3A59", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Teste", bold: true, size: 20, font: "Arial", color: "FFFFFF" })] })]
              }),
              new TableCell({
                borders,
                width: { size: 1800, type: WidthType.DXA },
                shading: { fill: "2E3A59", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Resultado", bold: true, size: 20, font: "Arial", color: "FFFFFF" })] })]
              })
            ]
          }),
          testRow("Login › exibe a página de login corretamente", "pass", "✅ PASSOU"),
          testRow("Login › exibe erro ao submeter com campos vazios", "pass", "✅ PASSOU"),
          testRow("Login › exibe erro com credenciais inválidas", "pass", "✅ PASSOU"),
          testRow("Login › login do professor redireciona para lesson-builder", "pass", "✅ PASSOU"),
          testRow("Login › toggle de mostrar/ocultar senha funciona", "pass", "✅ PASSOU"),
          testRow("Login › link para cadastro está funcionando", "pass", "✅ PASSOU"),
          testRow("Cadastro › exibe a página de cadastro corretamente", "pass", "✅ PASSOU"),
          testRow("Cadastro › exibe erro ao submeter com campos vazios", "pass", "✅ PASSOU"),
          testRow("Cadastro › exibe erro com senha curta", "pass", "✅ PASSOU"),
          testRow("Cadastro › cadastro de aluno redireciona para dashboard", "pass", "✅ PASSOU"),
          testRow("Professor › página de upload de materiais carrega", "pass", "✅ PASSOU"),
          testRow("Professor › navega para turmas e exibe lista", "pass", "✅ PASSOU"),
          testRow("Professor › cria uma nova turma", "fail", "❌ FALHOU"),
          testRow("Professor › navega para analytics", "fail", "❌ FALHOU"),
          testRow("Professor › navega para admin de usuários", "pass", "✅ PASSOU"),
          testRow("Professor › lista de revisões do professor carrega", "pass", "✅ PASSOU"),
          testRow("Aluno › dashboard carrega com elementos principais", "pass", "✅ PASSOU"),
          testRow("Aluno › navega para turmas", "fail", "❌ FALHOU"),
          testRow("Aluno › navega para conquistas", "pass", "✅ PASSOU"),
          testRow("Aluno › navega para o chat com IA", "pass", "✅ PASSOU"),
          testRow("Aluno › navega para perfil", "pass", "✅ PASSOU"),
          testRow("Proteção de rotas › dashboard redireciona sem auth", "pass", "✅ PASSOU"),
          testRow("Proteção de rotas › turmas redireciona sem auth", "pass", "✅ PASSOU"),
        ]
      }),

      new Paragraph({ spacing: { after: 200 }, children: [] }),
      divider(),

      // ── FALHA 1
      heading1("2. Análise dos Testes que Falharam"),
      heading2("2.1 — Aluno › navega para turmas"),

      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({ text: "Arquivo: ", bold: true, size: 22, font: "Arial" }),
          new TextRun({ text: "e2e/student.spec.ts  |  Linha 40", size: 22, font: "Arial", color: "E53E3E" })
        ]
      }),

      body("Erro reportado:", { bold: true }),
      new Paragraph({
        spacing: { after: 160 },
        shading: { fill: "FFF5F5", type: ShadingType.CLEAR },
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: "FC8181" } },
        indent: { left: 360 },
        children: [new TextRun({ text: 'expect(page).not.toHaveURL(/\\/login/)  →  Received: "http://localhost:3000/login"', size: 20, font: "Courier New", color: "C53030" })]
      }),

      body("Causa raiz:", { bold: true }),
      body("O Playwright isola cada teste em um contexto de browser independente, com localStorage completamente limpo. O estado de autenticação do NeuroMentor é gerenciado pela biblioteca Zustand com persistência em localStorage (middleware persist). Quando o segundo teste do bloco \"Aluno — Dashboard\" executa, o contexto anterior foi descartado e o localStorage está vazio."),
      body("A função registerAndLoginAsStudent() controla o fluxo com uma variável JavaScript (studentRegistered) que persiste no módulo durante a execução, porém isso não significa que a sessão está ativa no browser. Na segunda chamada, a função tenta fazer login normalmente, mas o estado do Zustand store não é hidratado a tempo antes da navegação para /turmas, resultando no redirecionamento para /login."),

      body("Fluxo do problema:", { bold: true }),
      bullet("Teste 1 (dashboard): registra aluno, Zustand persiste token no localStorage do Contexto A"),
      bullet("Teste 2 (turmas): Playwright cria Contexto B — localStorage vazio"),
      bullet("beforeEach faz login → token salvo no localStorage do Contexto B"),
      bullet("goto('/turmas') → componente TurmasPage monta → Zustand ainda hidratando"),
      bullet("Middleware de autenticação detecta usuário nulo e redireciona para /login"),
      bullet("Asserção not.toHaveURL(/\\/login/) falha"),

      body("Como corrigir:", { bold: true }),
      bullet("Usar storageState do Playwright: salvar o estado de autenticação após login em um arquivo JSON e carregá-lo em cada teste via test.use({ storageState: 'playwright/.auth/student.json' })"),
      bullet("Criar um arquivo globalSetup.ts que faz o registro/login uma única vez e exporta o storage state"),
      bullet("Aguardar hidratação explícita do Zustand com waitForFunction antes de navegar"),

      new Paragraph({ spacing: { after: 200 }, children: [] }),
      divider(),

      // ── FALHA 2
      heading2("2.2 — Professor › cria uma nova turma"),

      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({ text: "Arquivo: ", bold: true, size: 22, font: "Arial" }),
          new TextRun({ text: "e2e/teacher.spec.ts  |  Linha 31", size: 22, font: "Arial", color: "E53E3E" })
        ]
      }),

      body("Erro reportado:", { bold: true }),
      new Paragraph({
        spacing: { after: 160 },
        shading: { fill: "FFF5F5", type: ShadingType.CLEAR },
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: "FC8181" } },
        indent: { left: 360 },
        children: [new TextRun({ text: 'getByRole("button", { name: /nova turma/i }).click()  →  Timeout 30s esgotado', size: 20, font: "Courier New", color: "C53030" })]
      }),

      body("Causa raiz:", { bold: true }),
      body("O teste navega para /turmas após login bem-sucedido. O beforeEach confirma o redirecionamento para /lesson-builder/upload, mas ao chamar goto('/turmas'), a página executa o hook useEffect que chama loadTeacherClasses() — uma requisição autenticada à API."),
      body("O problema é uma condição de corrida entre a hidratação do Zustand (que lê o token do localStorage) e a montagem do componente TurmasPage. Se a requisição é disparada antes do token estar disponível na store, a API retorna 401. O handler de 401 registrado na store zera o estado de autenticação (set({ user: null, token: null })), e o middleware de rota detecta o usuário nulo, redirecionando para /login. Com o redirecionamento, o botão \"Nova turma\" desaparece e o teste aguarda 30 segundos até o timeout."),
      body("Evidência: o teste anterior \"navega para turmas e exibe lista\" passa porque verifica apenas o heading com timeout de 8 segundos — tempo insuficiente para o ciclo completo de 401 + redirecionamento ocorrer."),

      body("Como corrigir:", { bold: true }),
      bullet("Usar storageState para carregar a sessão diretamente no localStorage, evitando a condição de corrida com a hidratação do Zustand"),
      bullet("Aguardar explicitamente que o store esteja hidratado: await page.waitForFunction(() => !!localStorage.getItem('auth-storage')) antes de navegar"),
      bullet("Adicionar waitForLoadState('networkidle') após o goto('/turmas') para garantir que todas as requisições da API terminaram antes de procurar o botão"),

      new Paragraph({ spacing: { after: 200 }, children: [] }),
      divider(),

      // ── FALHA 3
      heading2("2.3 — Professor › navega para analytics"),

      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({ text: "Arquivo: ", bold: true, size: 22, font: "Arial" }),
          new TextRun({ text: "e2e/teacher.spec.ts  |  Linha 46", size: 22, font: "Arial", color: "E53E3E" })
        ]
      }),

      body("Erro reportado:", { bold: true }),
      new Paragraph({
        spacing: { after: 160 },
        shading: { fill: "FFF5F5", type: ShadingType.CLEAR },
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: "FC8181" } },
        indent: { left: 360 },
        children: [new TextRun({ text: 'getByText(/analytics|progresso|estatísticas/i)  →  Element not found (timeout 8s)', size: 20, font: "Courier New", color: "C53030" })]
      }),

      body("Causa raiz:", { bold: true }),
      body("Esta falha é diferente das anteriores: é um problema de design do sistema, não de configuração dos testes. A página /analytics utiliza o componente StudentLayout como wrapper de layout. Esse componente possui uma verificação explícita de papel (role) do usuário:"),

      new Paragraph({
        spacing: { before: 80, after: 80 },
        shading: { fill: "F0FFF4", type: ShadingType.CLEAR },
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: "68D391" } },
        indent: { left: 360 },
        children: [new TextRun({ text: "if (user.role === 'teacher') { router.replace('/lesson-builder/upload'); return; }", size: 20, font: "Courier New", color: "276749" })]
      }),

      new Paragraph({ spacing: { after: 160 }, children: [] }),

      body("Quando um professor tenta acessar /analytics, o StudentLayout imediatamente redireciona para /lesson-builder/upload antes de renderizar qualquer conteúdo. O seletor de texto /analytics|progresso|estatísticas/i nunca encontra um elemento porque a página de analytics nunca é exibida ao professor."),
      body("Portanto, o teste falha por uma regra de negócio correta da aplicação: a página de analytics é exclusiva para alunos, e o sistema funciona como esperado ao bloquear o acesso do professor."),

      body("Como corrigir:", { bold: true }),
      bullet("Corrigir o teste para refletir o comportamento esperado: ao invés de verificar conteúdo da página analytics, verificar que o professor é redirecionado para /lesson-builder/upload"),
      bullet("Alternativa: criar um teste separado no arquivo student.spec.ts que verifica o analytics com sessão de aluno"),
      bullet("Exemplo de correção: await expect(page).toHaveURL(/\\/lesson-builder/, { timeout: 8000 })"),

      new Paragraph({ spacing: { after: 200 }, children: [] }),
      divider(),

      // ── CONCLUSÃO
      heading1("3. Conclusão e Próximos Passos"),

      body("Das 3 falhas identificadas, 2 são problemas de configuração dos testes (falhas 2.1 e 2.2) e 1 é um teste que verifica um comportamento incorreto (falha 2.3). A aplicação em si funciona corretamente nos 3 casos."),

      new Paragraph({ spacing: { after: 160 }, children: [] }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3120, 3120, 3120],
        rows: [
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, shading: { fill: "2E3A59", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Falha", bold: true, size: 20, font: "Arial", color: "FFFFFF" })] })] }),
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, shading: { fill: "2E3A59", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Tipo", bold: true, size: 20, font: "Arial", color: "FFFFFF" })] })] }),
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, shading: { fill: "2E3A59", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Prioridade", bold: true, size: 20, font: "Arial", color: "FFFFFF" })] })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, shading: { fill: "F7FAFC", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Aluno › navega para turmas", size: 20, font: "Arial", color: "2D3748" })] })] }),
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, shading: { fill: "F7FAFC", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Configuração do teste", size: 20, font: "Arial", color: "2D3748" })] })] }),
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, shading: { fill: "FED7D7", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Alta", size: 20, font: "Arial", color: "C53030" })] })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, shading: { fill: "F7FAFC", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Professor › cria nova turma", size: 20, font: "Arial", color: "2D3748" })] })] }),
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, shading: { fill: "F7FAFC", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Configuração do teste", size: 20, font: "Arial", color: "2D3748" })] })] }),
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, shading: { fill: "FED7D7", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Alta", size: 20, font: "Arial", color: "C53030" })] })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, shading: { fill: "F7FAFC", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Professor › navega para analytics", size: 20, font: "Arial", color: "2D3748" })] })] }),
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, shading: { fill: "F7FAFC", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Teste incorreto", size: 20, font: "Arial", color: "2D3748" })] })] }),
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, shading: { fill: "FEFCBF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Baixa", size: 20, font: "Arial", color: "744210" })] })] }),
            ]
          }),
        ]
      }),

      new Paragraph({ spacing: { after: 200 }, children: [] }),
      body("A solução prioritária é implementar o mecanismo de storageState do Playwright para persistir sessões de autenticação entre testes, resolvendo simultaneamente as falhas 2.1 e 2.2. A falha 2.3 requer apenas a correção da asserção do teste para validar o redirecionamento esperado."),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("Relatorio-Testes-E2E-NeuroMentor.docx", buffer);
  console.log("✅ Documento gerado: Relatorio-Testes-E2E-NeuroMentor.docx");
});
