# Brindicis Designer — Guia de Design System

Guia de estilo e padrões visuais para a aplicação Brindicis Stock.

---

## 0. Configuração Inicial

**Antes de começar, pergunta ao utilizador:**

> "Qual é a cor principal que queres usar para o design? (ex: #FBBF24, #3B82F6, #10B981)"

Esta cor será usada em todos os elementos interativos: botões, nav items ativos, badges, links, toggles, etc.

### Mapeamento da Cor Principal

Uma vez escolhida a cor hex (ex: `#FBBF24`), mapeia para as variantes Tailwind:

| Elemento | Classe Tailwind |
|----------|-----------------|
| Fundo botão principal | `bg-[{cor}]` |
| Hover botão | `hover:bg-[{cor}-600]` (ou variante mais escura) |
| Texto labels/nav ativo | `text-[{cor}-600]` |
| Fundo nav ativo | `bg-[{cor}-50]/40` |
| Fundo ícones | `bg-[{cor}-50]` |
| Toggle ativo | `bg-[{cor}-400]` |
| Focus ring | `focus-visible:ring-[{cor}-400]` |
| Dark mode texto | `dark:text-[{cor}-400]` |
| Dark mode fundo | `dark:bg-[{cor}-950]/20` |
| Borda card selecionado | `border-[{cor}-400]` |

**Exemplo com amarelo `#FBBF24`:**

| Elemento | Classe |
|----------|--------|
| Fundo botão | `bg-[#FBBF24]` |
| Hover | `hover:bg-amber-500` |
| Labels | `text-amber-600` |
| Nav ativo | `text-amber-600 bg-amber-50/40` |
| Toggle | `bg-amber-400` |
| Focus | `ring-amber-400` |

### Texto em Fundo da Cor Principal

| Elemento | Classe |
|----------|--------|
| Texto botão | `text-[#1F2937]` (cinza escuro fixo) |

**Regra:** Nunca usar texto branco em fundo da cor principal.

---

## 1. Paleta de Cores

### Cor Principal

Todas as referências à cor principal usam o mapeamento da secção 0.

### Cores Neutras

| Uso | Cor | Tailwind |
|-----|-----|----------|
| Fundo página | `#F3F4F6` | `bg-[#F3F4F6]` |
| Fundo cards | `white` | `bg-white` |
| Fundo secções | `slate-50` | `bg-slate-50` |
| Bordas | `slate-200` | `border-slate-200` |
| Labels | `slate-400` / `slate-500` | `text-slate-400` |
| Texto principal | `slate-800` | `text-slate-800` |
| Texto secundário | `slate-600` | `text-slate-600` |

### Dark Mode

| Elemento | Classe |
|----------|--------|
| Borda | `dark:border-slate-700` |
| Fundo card | `dark:bg-slate-900` |
| Fundo secção | `dark:bg-slate-800/50` |
| Texto principal | `dark:text-slate-100` |
| Texto secundário | `dark:text-slate-400` |
| Fundo input | `dark:bg-slate-950` |

---

## 2. Bordas

### Padrão Geral

```css
/* Cards e containers principais */
border-2 border-slate-200 dark:border-slate-700

/* Separadores horizontais */
border-b-2 border-slate-200 dark:border-slate-700

/* Separadores verticais */
border-r border-slate-200 dark:border-slate-700
border-l border-slate-200 dark:border-slate-700

/* Separador topo (footer/paginação) */
border-t-2 border-slate-200 dark:border-slate-700
```

### Regras

- **Nunca** usar `border` (1px) — usar sempre `border-2` (2px)
- **Nunca** usar `border-slate-200/60` — usar `border-slate-200` sem opacidade
- **Nunca** usar `dark:border-slate-800` — usar `dark:border-slate-700`

---

## 3. Sombras

```css
/* Cards e containers */
shadow-sm

/* Modais e dropdowns */
shadow-lg

/* Botões e elementos pequenos */
shadow-xs ou shadow-sm
```

---

## 4. Border Radius

```css
/* Cards principais */
rounded-2xl

/* Botões e inputs */
rounded-lg

/* Badges e pills */
rounded-lg ou rounded-xl

/* Avatares */
rounded-full
```

---

## 5. Tipografia

### Títulos de Secção

```html
<span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest dark:text-slate-400">
  Nome da Secção
</span>
```

### Títulos de Página

```html
<h1 className="text-lg font-bold text-slate-800 dark:text-white">
  Título
</h1>
```

### Labels de Input

```html
<label className="text-xs font-bold text-slate-600 dark:text-slate-300">
  Label
</label>
```

### Texto de Valor

```html
<span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
  Valor
</span>
```

---

## 6. Botões

### Botão Principal (Cor Principal)

```html
<Button className="h-10 bg-[{cor}] text-[#1F2937] hover:bg-[{cor}-hover] px-5 rounded-lg flex items-center gap-2 font-semibold shadow-none">
  <Icon className="size-4" />
  <span>Texto</span>
</Button>
```

### Botão Modal (Salvar/Fechar)

```html
<Button className="h-10 bg-[{cor}-400] hover:bg-[{cor}-500] text-[#1F2937] px-5 font-semibold">
  Salvar
</Button>
```

### Botão Outline

```html
<Button variant="outline" className="h-10 border-2 border-slate-300 hover:bg-slate-50 font-semibold dark:border-slate-600">
  Texto
</Button>
```

---

## 7. Cards

### PageCard (Container de Página)

```html
<div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-700">
  {conteúdo}
</div>
```

### Product Card (Card de Produto)

Layout sectionado com separador visual:

```html
<button className="flex items-stretch rounded-2xl border-2 border-slate-200 overflow-hidden">
  {/* Secção esquerda - Ícone/Imagem */}
  <div className="w-[90px] bg-slate-50 border-r border-slate-200 flex items-center justify-center">
    <Package className="size-8" />
  </div>
  {/* Secção direita - Conteúdo */}
  <div className="flex-1 bg-white px-4 py-3">
    <p className="text-sm font-extrabold">{referência}</p>
    <p className="text-sm"><span className="text-slate-500">Qtd: </span><span className="text-[{cor}-600] font-extrabold">{quantidade}</span></p>
  </div>
</button>
```

### Card Selecionado

```html
className="border-[{cor}-400] shadow-md"
```

### Card Hover

```html
className="hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5"
```

---

## 8. Navbar

### Secções

```html
<nav className="flex h-16 items-stretch bg-white rounded-2xl border-2 border-slate-200 shadow-sm">
  {/* Logo */}
  <div className="flex items-center pl-5 pr-6 shrink-0">
    <Logo /> NomeApp <span className="text-[{cor}-500]">Brand</span>
  </div>

  {/* Search - flex-1 */}
  <div className="flex-1 flex items-center px-6">
    <Input />
  </div>

  {/* Botões */}
  <div className="flex items-center gap-1 px-4 shrink-0">
    <Button />
  </div>
</nav>
```

### Dropdowns (Settings/Profile)

```html
<div className="absolute right-4 top-[68px] z-50 w-64 rounded-2xl border-2 border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
  <div className="border-b-2 border-slate-100 dark:border-slate-700">
    {/* Título */}
  </div>
  <div className="p-4">
    {/* Conteúdo */}
  </div>
</div>
```

**Importante:** Remover `overflow-hidden` do `<nav>` para os dropdowns funcionarem.

---

## 9. Sidebar

```html
<aside className="w-[280px] bg-white rounded-2xl border-2 border-slate-200 shadow-sm flex flex-col justify-between p-4 dark:bg-slate-900 dark:border-slate-700">
  {/* Título secção */}
  <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-[{cor}-600]">
    Navegação
  </h3>

  {/* Item ativo */}
  <Link className="text-[{cor}-600] bg-[{cor}-50]/40 dark:text-[{cor}-400] dark:bg-[{cor}-950]/20">

  {/* Item inativo */}
  <Link className="text-slate-500 hover:text-slate-800 hover:bg-slate-50">

  {/* Separador */}
  <div className="border-t-2 border-slate-200 dark:border-slate-700 my-2" />
</aside>
```

---

## 10. Tabelas

### DataTable

```html
<div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-700">
  {/* Header */}
  <div className="bg-slate-100 px-4 py-2.5 text-xs font-extrabold uppercase">
    <span>Coluna</span>
  </div>

  {/* Rows */}
  <div className="border-b border-slate-200 dark:border-slate-700 px-4 py-2.5">
    <span className="font-bold">Valor</span>
  </div>
</div>
```

### Paginação

```html
<div className="border-t-2 border-slate-200 bg-slate-50 px-6 py-4 dark:bg-slate-800 dark:border-slate-700">
  {/* Botão página ativa */}
  <Button className="size-9 bg-[{cor}-400] hover:bg-[{cor}-500] text-[#1F2937] font-extrabold shadow-sm" />
</div>
```

---

## 11. Modais

```html
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
  <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg w-full max-w-lg dark:bg-slate-900 dark:border-slate-700">

    {/* Header */}
    <div className="flex items-center justify-between px-6 py-4 border-b-2 border-slate-100 dark:border-slate-700">
      <h3 className="text-lg font-bold">Título</h3>
      <Button size="icon"><X /></Button>
    </div>

    {/* Body */}
    <div className="px-6 py-4">
      {conteúdo}
    </div>

    {/* Footer */}
    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t-2 border-slate-100 dark:border-slate-700">
      <Button variant="outline">Cancelar</Button>
      <Button className="bg-[{cor}-400] hover:bg-[{cor}-500] text-[#1F2937]">Salvar</Button>
    </div>
  </div>
</div>
```

---

## 12. Painel de Detalhes (Product Detail Panel)

### Layout Flex

```
Container: flex h-full flex-col overflow-hidden
  ├── Header (shrink-0): bg-white border-b-2
  ├── Filtros (shrink-0): bg-white border-b-2
  ├── Tabela Variantes (flex-1 min-h-0): bg-white border-b-2
  │     └── Body: flex-1 min-h-0 overflow-y-auto
  ├── Dados Produto (shrink-0): bg-white border-b-2
  ├── Descrição (shrink-0): bg-white border-b-2
  ├── Datas (shrink-0): bg-white
  └── Footer Botões (shrink-0): border-t-2 bg-slate-50
```

### Regras

- Apenas a **tabela de variantes** deve ter scroll (`flex-1 min-h-0 overflow-y-auto`)
- Todas as outras secções são `shrink-0`
- Footer nunca `absolute` — sempre `shrink-0` no fluxo normal
- Usar `border-b-2` entre secções, `border-t-2` antes do footer

### Dados do Produto (Compacto)

```html
<div className="grid grid-cols-3 gap-x-4 gap-y-1">
  <div className="flex flex-col">
    <span className="text-[9px] font-bold text-slate-400 uppercase">Label</span>
    <span className="text-xs font-extrabold text-slate-800">Valor</span>
  </div>
</div>
```

### Datas (Horizontal com Separador)

```html
<div className="flex items-center">
  <p className="flex-1 text-[10px]">Criado em {data}</p>
  <span className="text-slate-300">|</span>
  <p className="flex-1 text-[10px] text-right">Atualizado em {data}</p>
</div>
```

---

## 13. Filtros

```html
<div className="bg-slate-50 border-b-2 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">
  <div className="px-6 py-4">
    <div className="grid grid-cols-4 gap-4">
      <div className="flex flex-col">
        <span className="text-xs font-bold text-slate-600 mb-1.5">Label</span>
        <SearchableSelect />
      </div>
    </div>
  </div>
</div>
```

---

## 14. Checklist de Validação

# Checklist de Verificação de Componentes

Antes de entregar qualquer componente, certifique-se de validar todos os pontos abaixo:

- [ ] **Definição da Cor Principal:** Perguntou ao utilizador qual é a cor principal?
- [ ] **Mapeamento de Cores:** Todas as referências à cor principal usam o mapeamento correto.
- [ ] **Contraste da Cor Principal (Texto Branco vs. Preto):** Os botões e elementos da cor principal têm a cor do texto definida com base na luminosidade do fundo:
  * **Texto Branco (`text-white`):** Se a cor principal for escura ou saturada (ex: Azul Marinho, Vermelho, Roxo, Verde Escuro, Preto).
  * **Texto Escuro/Preto (`text-[#1F2937]`):** Se a cor principal for clara ou pastel (ex: Amarelo, Verde Limão, Azul Bebê, Rosa Claro, Branco).
- [ ] **Bordas:** As bordas são sempre `border-2` (nunca `border`).
- [ ] **Bordas em Dark Mode:** O modo escuro usa obrigatoriamente `dark:border-slate-700` (nunca `dark:border-slate-800`).
- [ ] **Separadores:** Os divisores e separadores usam `border-b-2` ou `border-t-2`.
- [ ] **Sombras:** As sombras aplicadas são estritamente `shadow-sm` ou `shadow-lg`.
- [ ] **Cards:** Todos os containers do tipo card têm o arredondamento `rounded-2xl`.
- [ ] **Títulos de Secção:** Usam obrigatoriamente as classes `text-[10px] font-extrabold uppercase tracking-widest`.
- [ ] **Labels de Input:** Seguem o padrão `text-xs font-bold text-slate-600`.

---

### Guia de Aplicação de Contraste

| Tipo de Cor de Fundo | Exemplos Visuais | Classe do Texto (Tailwind) |
| :--- | :--- | :--- |
| **Escura / Intensa** | Preto, Azul Marinho, Vermelho Vivo, Roxo | `text-white` |
| **Clara / Pastel** | Amarelo, Verde Menta, Azul Bebê, Branco | `text-[#1F2937]` |
