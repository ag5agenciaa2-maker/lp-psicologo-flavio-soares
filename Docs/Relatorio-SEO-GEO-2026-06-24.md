# Relatório SEO/GEO — Auditoria 2026-06-24

Auditoria completa seguindo a Skill SEO 01 (SEO + GEO). Aplicada após o trabalho de blog, carrossel e padronização de páginas.

## ✅ O que foi corrigido (on-page, já aplicado no código)

### SEO local (title e H1 da home)
- **Problema:** o title e o H1 da home tinham sido trocados para "Psicólogo para Homens" e **perderam a localização** (Campo Grande RJ), enfraquecendo o SEO local. A skill exige keyword + local no início (front-load).
- **Title:** `Psicólogo para Homens | Atendimento e Psicoterapia Masculina | Flávio Soares` → **`Psicólogo em Campo Grande RJ | Psicoterapia para Homens | Flávio Soares`** (mantém o nicho "para Homens" E recupera o local).
- **H1:** `Psicólogo para Homens: Conversa Verdadeira` → **`Psicólogo em Campo Grande, RJ: Conversa Verdadeira`**.

### URL LIMPA (regra inviolável da skill) — zero `.html`
- **Problema:** após a sessão anterior (links relativos com `.html` para o Live Server), todos os href de navegação, canonical das páginas de serviço e 2 URLs do sitemap estavam com `.html`. Isso fere a regra de URL limpa do Cloudflare Pages (redirect 308, canonical apontando para URL que redireciona).
- **Corrigido em TODAS as páginas (raiz + blog):**
  - `href` de navegação: `index.html` → `/`, `cursos-e-formacoes.html` → `/cursos-e-formacoes`, `blog/x.html` → `/blog/x`, âncoras `index.html#sobre` → `/#sobre`.
  - `<link rel="canonical">`, `og:url`, `twitter:url`, `url`/`mainEntityOfPage` do schema: URL absoluta limpa.
  - `sitemap.xml`: removido `.html` de política e termos.
  - Links de share (WhatsApp/Facebook) já apontavam para a URL pública limpa.
  - **Os arquivos no disco continuam `.html`** (o Cloudflare mapeia). Só a URL pública é limpa.
- **Validação:** `grep` de `.html` em href de navegação, canonical e sitemap → **0 ocorrências**.

### Performance / Core Web Vitals
- **CLS:** adicionado `width`/`height` explícito nas imagens que faltavam (logo nav/footer/drawer, 17 slides do carrossel, 3 cards da galeria). Só o `#lightboxImg` fica sem dimensão (correto, é populado por JS).
- **LCP:** a imagem de fundo do hero (LCP) já tinha `fetchpriority="high"` e dimensão; ganhou também um `alt` descritivo (antes vazio).
- **Lazy loading:** 32 de 38 imagens com `loading="lazy"` (as eager são hero + logos, correto).

### Conteúdo / acessibilidade
- `alt` da imagem de fundo do hero: vazio → **"Atendimento psicológico com Flávio Soares em Campo Grande, RJ"**.

## ✅ O que já estava correto (auditado, sem ação)

- `robots.txt`: libera AI bots (GPTBot, ChatGPT-User, Google-Extended) para GEO + aponta o sitemap.
- Geo tags (`geo.region`, `geo.position`, `geo.placename`, `ICBM`) presentes.
- Schema rico na home: `MedicalBusiness` + `FAQPage` + `AggregateRating` + `OfferCatalog` + `OpeningHoursSpecification` + `GeoCoordinates`.
- Blog: `BlogPosting` + `BreadcrumbList` + `FAQPage` em cada post; canonical limpo.
- NAP (nome, endereço, telefone) visível em texto no rodapé (não só em imagem).
- Open Graph e Twitter Card completos em todas as páginas.
- `lang="pt-BR"`, charset UTF-8, viewport mobile.
- Meta description da home com localização e CRP.

## ⚠️ Pendências on-page (decisão sua, não bloqueiam)

- **H1 das páginas de serviço** estão curtos como SEO ("Cursos & Formações", "Psicologia Corporativa", "Psicoterapia para Homens"). Ideal: adicionar local/contexto (ex: "Psicologia Corporativa e NR-1 no Rio de Janeiro"). Você sinalizou que vai trabalhar essas páginas depois.
- **Imagem do post "O que é a NR-1"** é uma ilustração genérica de documentos (gerada na nuvem), mais fraca que as fotos reais Pexels dos outros posts. Trocar é opcional.

## 📋 Tarefas OFF-PAGE (você precisa fazer manualmente — a IA não consegue)

- [ ] **Google Business Profile (GBP/GMB):** verificar e completar o perfil; garantir que o NAP (nome, endereço, telefone) bate exatamente com o site. Pegar o CID + Place ID e confirmar no schema.
- [ ] **Google Search Console:** submeter `https://www.psicologoflaviosoares.com.br/sitemap.xml` e pedir indexação das páginas novas (blog, serviços).
- [ ] **Google Analytics / Tag Manager:** instalar o código de rastreamento (não há tag de analytics no site hoje).
- [ ] **PageSpeed Insights:** rodar o teste ao vivo após o deploy para pegar atrasos de servidor (rodar /psi-audit no modo online).
- [ ] **Backlinks locais:** cadastrar em diretórios de psicólogos (ex: Doctoralia, CRP-RJ) e parcerias locais de Campo Grande.
- [ ] **Redes sociais:** garantir link para o site no Instagram, Facebook e TikTok (perfis já no schema `sameAs`).
- [ ] **HTTPS:** confirmar que o Cloudflare força HTTPS (deve estar OK por padrão).

---
*Gerado pela Skill SEO 01 em 2026-06-24. Mudanças on-page já no código, pendentes de commit/push.*
