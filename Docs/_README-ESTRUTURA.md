# Estrutura do Projeto — Nav, Rodapé e Sincronização

Este documento serve como a fonte de referência de arquitetura de caminhos e consistência visual para qualquer manutenção ou criação de novas páginas no projeto **Psicólogo Flávio Soares**.

---

## 1. Mapa de Páginas e Profundidade de Caminho

O projeto está dividido entre páginas na raiz do site e posts no diretório do blog. A profundidade do caminho é crítica para que imagens (`Assets/`), arquivos CSS e JavaScript carreguem sem erros 404.

| Página / Caminho | Localização | Profundidade (`{{BASE}}`) | Exemplo de Arquivo Linkado |
| :--- | :--- | :--- | :--- |
| **Home (`index.html`)** | Raiz (`/`) | `""` (vazio) | `<link rel="stylesheet" href="style.css">` |
| **Serviços (`psicoterapia-individual.html`)** | Raiz (`/`) | `""` (vazio) | `<link rel="stylesheet" href="style.css">` |
| **Corporativo (`psicologia-corporativa.html`)** | Raiz (`/`) | `""` (vazio) | `<link rel="stylesheet" href="style.css">` |
| **Formações (`cursos-e-formacoes.html`)** | Raiz (`/`) | `""` (vazio) | `<link rel="stylesheet" href="style.css">` |
| **Políticas (`politica-de-privacidade.html`)** | Raiz (`/`) | `""` (vazio) | `<link rel="stylesheet" href="style.css">` |
| **Termos (`termos-e-condicoes.html`)** | Raiz (`/`) | `""` (vazio) | `<link rel="stylesheet" href="style.css">` |
| **Blog Index (`blog/index.html`)** | Subpasta (`/blog/`) | `../` | `<link rel="stylesheet" href="../style.css">` |
| **Posts do Blog (`blog/*.html`)** | Subpasta (`/blog/`) | `../` | `<link rel="stylesheet" href="../style.css">` |

---

## 2. Template Canônico (Fonte de Verdade)

O template HTML com a marcação exata e os placeholders de profundidade está localizado em:
👉 [Docs/_nav-footer-template.html](file:///c:/Users/mauri/Documents/00%20Processo%20Landing%20Pages/01%20-%20LP%20-%20Projeto%20Novo/LP%20-%20Flavio%20Soares%20(Psicologo)/Docs/_nav-footer-template.html)

Sempre que criar uma página nova ou atualizar o cabeçalho/rodapé da Home:
1. Atualize o `index.html`.
2. Atualize o template canônico em `Docs/_nav-footer-template.html`.
3. Replique as alterações nas páginas listadas no Mapa de Páginas, substituindo `{{BASE}}` pela profundidade correta (vazio ou `../`).

---

## 3. Itens Obrigatórios em Toda Página

Toda e qualquer página HTML do site deve possuir os seguintes blocos funcionais idênticos aos da Home:
* **Favicon**: Linkado no `<head>` usando a marcação de profundidade correta.
* **Menu de Navegação (`<nav class="navbar">`)**: Logo linkando para a Home, links âncoras apontando para as seções certas do `index.html` e botão mobile de hamburger funcionais.
* **Rodapé (`<footer class="footer">`)**: Texto institucional, colunas de links de navegação e serviços, dados de contato e créditos de copyright/AG5.
* **Mobile Drawer (`drawer-menu`)**: Menu lateral mobile com links relativos à profundidade.
* **Banner de Cookies LGPD (`#ck-banner`) & Modal (`#ck-modal`)**: Scripts de consentimento e botão de preferências ativos e linkados corretamente.
* **Script de Inicialização**: Linkagem do `script.js` e do `cookie-banner.js` antes do fechamento do `</body>`.

---

## 4. Armadilhas Conhecidas e Boas Práticas

* **Links de navegação são RELATIVOS, nunca `/` absoluto**:
  O Live Server serve o WORKSPACE inteiro (`00 Processo Landing Pages`), não a pasta da LP. Por isso `href="/"` na logo leva para a listagem de pastas / raiz do disco (`C:\`), não para a home. TODOS os links de nav/logo/drawer usam caminho relativo (`index.html` na raiz, `../index.html` no blog). Em produção (Cloudflare) o relativo também funciona. NÃO reintroduzir `href="/"`. (Apenas canonical/og/schema usam URL absoluta com domínio.)
* **Número no rodapé (coluna Contato)**:
  Os dois últimos links da coluna Contato mostram o número digitado `(21) 96439-4839` (um no link WhatsApp com ícone wa, outro no link `tel:`). NÃO voltar para as palavras "WhatsApp"/"Telefone". Os botões "WhatsApp" do nav e do drawer continuam com a palavra (são ação, não contato).
* **Escopo de CSS em Subpáginas (`body.subpage`)**: 
  Todos os elementos de texto genéricos (como parágrafos, listas e cabeçalhos) em subpáginas devem ser estilizados de forma restrita (ex: `body.subpage main p`, `body.subpage main h2`), evitando seletores globais como `body.subpage p`. Caso contrário, os estilos herdados podem pintar os textos do rodapé ou navbar de cores incorretas (como torná-los invisíveis em fundos escuros). (Hoje NÃO existe regra `body.subpage` no CSS; o atributo é só marcador semântico.)
* **Guarda de Nulos no JS (`script.js`)**: 
  Como o script principal do projeto é compartilhado entre a Home e as subpáginas, qualquer inicialização de carrossel, carrossel de depoimentos, botões específicos de vídeo ou filtros deve ser envolvida por uma checagem de existência do elemento (ex: `if (elemento) { ... }`). Se um seletor falhar, o script inteiro deixa de executar nas páginas internas, quebrando o menu hamburger mobile e o banner de cookies.
* **Balão de WhatsApp Premium**:
  O balão flutuante de WhatsApp Premium (V4) é gerenciado via CSS (`style.css`) e JS (`script.js`). O status online dot pulsante está desativado sob o **Modo Compliance** para conformidade ética com o CFP (Conselho Federal de Psicologia). Não recrie badges dinâmicos de online que simulem atividades automáticas.

---

## 5. Como Validar

Após fazer qualquer alteração:
1. Abra o arquivo renderizado localmente no navegador.
2. Certifique-se de que o console de desenvolvedor (F12) está limpo (sem erros 404 de recursos não encontrados).
3. Reduza a janela para simular a tela mobile e teste a abertura do menu hamburger e o fechamento dele ao clicar em um link.
4. Verifique a legibilidade dos links no rodapé e se os caminhos das políticas levam aos locais corretos.

---

## 6. Correções aplicadas na auditoria 2026-06-24 (skill rodapé padrão)

Divergências encontradas e corrigidas ao re-rodar a skill:
* **`cursos-e-formacoes.html` estava SEM o drawer mobile** (`#drawerMenu`). O hamburger existia mas não abria nada no mobile. Drawer inserido, idêntico às demais páginas de serviço.
* **As 4 páginas do blog estavam SEM o banner de cookie LGPD** (só tinham `cookie-banner.js/.css` linkados, faltava o HTML de `#ck-banner` + `#ck-modal`). Bloco inserido (com link da política como `../politica-de-privacidade.html`). Aplicado também ao `blog/_template.html`.
* **`termos-e-condicoes.html` e `politica-de-privacidade.html` tinham só 1 das 2 tags de favicon** (faltava `apple-touch-icon`). Adicionada.
* **`politica-de-privacidade.html` tinha `script.js` duplicado** (2x). Removida a duplicata.
* **Scripts padronizados** em todas as secundárias: `cookie-banner.js` com `defer`, depois `script.js` sem defer (mesma ordem da home).
* **Logos** de todas as páginas apontam para a home por caminho relativo (`index.html` / `../index.html`), nunca `/`.
* **Rodapé**: coluna Contato com o número `(21) 96439-4839` em vez das palavras WhatsApp/Telefone, em todas as páginas.
* Validado via `agent-browser` em todas as páginas: nav (5 links), footer, drawer, cookie e logoHref corretos.
