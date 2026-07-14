# -*- coding: utf-8 -*-
"""
Revela 1 post agendado (pre-pronto com noindex) publicando-o de fato.
Uso:  python blog/_publicar.py <slug>
Roda a partir da raiz do repo OU de dentro de blog/ (detecta sozinho).

O que faz, de forma idempotente (nao duplica se rodar 2x):
 1. Troca noindex->index no proprio post
 2. Insere o card no topo do grid de blog/index.html
 3. Insere a entrada no schema blogPost[] de blog/index.html
 4. Adiciona a URL ao sitemap.xml
 5. Adiciona a linha ao llms.txt
Depois disso, faca:  git add -A && git commit -m "post: <slug>" && git push
"""
import json, sys, os, re

DOMAIN = "https://www.flaviosoares.me"

def find_root():
    here = os.path.abspath(os.path.dirname(__file__))
    # blog/ -> raiz e' o pai
    if os.path.basename(here) == "blog":
        return os.path.dirname(here)
    # ja na raiz?
    if os.path.isdir(os.path.join(here, "blog")):
        return here
    return here

ROOT = find_root()
BLOG = os.path.join(ROOT, "blog")

def read(p):  return open(p, encoding="utf-8").read()
def write(p, s): open(p, "w", encoding="utf-8").write(s)

def main():
    if len(sys.argv) < 2:
        print("ERRO: informe o slug. Ex: python blog/_publicar.py saude-mental-mundo-moderno")
        sys.exit(1)
    slug = sys.argv[1].strip()

    manifesto = json.load(open(os.path.join(BLOG, "_agendados.json"), encoding="utf-8"))
    if slug not in manifesto["posts"]:
        print(f"ERRO: slug '{slug}' nao esta em _agendados.json")
        sys.exit(1)
    m = manifesto["posts"][slug]

    post_path = os.path.join(BLOG, f"{slug}.html")
    if not os.path.exists(post_path):
        print(f"ERRO: {post_path} nao existe")
        sys.exit(1)

    # 1. noindex -> index no post
    ph = read(post_path)
    if 'content="noindex, follow"' in ph:
        ph = ph.replace(
            '<meta name="robots" content="noindex, follow"><!-- AGENDADO: rotina troca para index na data -->',
            '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">'
        )
        write(post_path, ph)
        print(f"[1/5] {slug}.html -> index, follow")
    else:
        print(f"[1/5] {slug}.html ja estava index (ok)")

    idx_path = os.path.join(BLOG, "index.html")
    idx = read(idx_path)

    # 2. card no topo do grid (se ainda nao houver)
    card_marker = f'href="/blog/{slug}"'
    if card_marker not in idx:
        card = f'''        <article class="blog-card fade-up">
          <a href="/blog/{slug}" class="blog-card-link">
            <div class="blog-card-media">
              <img src="assets/{slug}.webp" alt="{m['alt']}" loading="lazy" width="400" height="260">
              <span class="blog-card-tag">{m['tag']}</span>
            </div>
            <div class="blog-card-body">
              <div class="blog-card-meta">
                <span>{m['section']}</span>
                <span aria-hidden="true">·</span>
                <span>{m['read']} de leitura</span>
              </div>
              <h2 class="blog-card-title">{m['title']}</h2>
              <p class="blog-card-excerpt">{m['excerpt']}</p>
              <span class="blog-card-cta">Ler artigo <span class="arrow">→</span></span>
            </div>
          </a>
        </article>

'''
        anchor = '      <div class="blog-grid">\n\n'
        if anchor in idx:
            idx = idx.replace(anchor, anchor + card, 1)
            print(f"[2/5] card inserido no topo do grid")
        else:
            print("[2/5] AVISO: ancora do grid nao encontrada, card NAO inserido")
    else:
        print(f"[2/5] card ja existe (ok)")

    # 3. entrada no schema blogPost[]
    if f'"{DOMAIN}/blog/{slug}"' not in idx:
        entry = f'''        "blogPost": [
          {{
            "@type": "BlogPosting",
            "headline": "{m['title']}",
            "url": "{DOMAIN}/blog/{slug}",
            "image": "{DOMAIN}/blog/assets/{slug}.webp",
            "datePublished": "{m['data']}",
            "dateModified": "{m['data']}",
            "author": {{ "@type": "Person", "name": "Flávio Soares" }},
            "articleSection": "{m['section']}"
          }},'''
        idx = idx.replace('        "blogPost": [', entry, 1)
        print(f"[3/5] entrada adicionada no schema blogPost[]")
    else:
        print(f"[3/5] schema ja tem o post (ok)")

    write(idx_path, idx)

    # 4. sitemap
    sm_path = os.path.join(ROOT, "sitemap.xml")
    sm = read(sm_path)
    loc = f"{DOMAIN}/blog/{slug}"
    if loc not in sm:
        url_block = f'''  <url>
    <loc>{loc}</loc>
    <lastmod>{m['data']}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>'''
        sm = sm.replace("</urlset>", url_block, 1)
        write(sm_path, sm)
        print(f"[4/5] URL adicionada ao sitemap.xml")
    else:
        print(f"[4/5] sitemap ja tem a URL (ok)")

    # 5. llms.txt
    llms_path = os.path.join(ROOT, "llms.txt")
    llms = read(llms_path)
    if f"/blog/{slug})" not in llms:
        anchor = "- [O que a terapia realmente faz pela sua mente](" + DOMAIN + "/blog/o-que-a-terapia-faz): como funciona o processo de psicoterapia e o que esperar."
        if anchor in llms:
            llms = llms.replace(anchor, anchor + "\n" + m["llms"], 1)
        else:
            # fallback: adiciona antes da secao Optional
            llms = llms.replace("\n## Optional", "\n" + m["llms"] + "\n\n## Optional", 1)
        write(llms_path, llms)
        print(f"[5/5] linha adicionada ao llms.txt")
    else:
        print(f"[5/5] llms.txt ja tem a linha (ok)")

    print(f"\nOK. Post '{slug}' publicado. Agora: git add -A && git commit -m 'post: {slug}' && git push")

if __name__ == "__main__":
    main()
