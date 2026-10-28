#!/usr/bin/env python3
"""Basic SEO and internal-link checks for Deutsch Lernen. Uses Python standard library only."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse
import xml.etree.ElementTree as ET
import sys
ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
BASE = "https://deutsch-yn.netlify.app"
class Scan(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True); self.title=False; self.title_text=[]; self.meta={}; self.canonical=[]; self.h1=0; self.links=[]; self.jsonld=0; self.noindex=False
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='title': self.title=True
        if tag=='meta' and a.get('name'): self.meta[a['name'].lower()]=a.get('content','')
        if tag=='link' and 'canonical' in (a.get('rel') or '').split(): self.canonical.append(a.get('href',''))
        if tag=='h1': self.h1+=1
        if tag=='a' and a.get('href'): self.links.append(a['href'])
        if tag=='script' and a.get('type')=='application/ld+json': self.jsonld+=1
    def handle_endtag(self, tag):
        if tag=='title': self.title=False
    def handle_data(self, data):
        if self.title: self.title_text.append(data)
def fail(msg): print('FAIL:',msg); return False
errors=[]
html_files=[p for p in PUBLIC.glob('*.html')]
for p in html_files:
    sc=Scan(); sc.feed(p.read_text(encoding='utf-8',errors='replace'))
    noindex='noindex' in sc.meta.get('robots','').lower()
    if p.name not in ('404.html','privacy.html'):
        title=''.join(sc.title_text).strip()
        if not title: errors.append(f'{p.name}: missing title')
        if not 30 <= len(title) <= 70: errors.append(f'{p.name}: title length {len(title)} (review, target 30–70)')
        desc=sc.meta.get('description','').strip()
        if not 80 <= len(desc) <= 180: errors.append(f'{p.name}: meta description length {len(desc)} (review, target 80–180)')
        if len(sc.canonical)!=1: errors.append(f'{p.name}: expected one canonical, found {len(sc.canonical)}')
        elif not sc.canonical[0].startswith(BASE): errors.append(f'{p.name}: unexpected canonical {sc.canonical[0]}')
        if sc.h1 != 1: errors.append(f'{p.name}: expected one H1, found {sc.h1}')
        if noindex: errors.append(f'{p.name}: unexpectedly noindex')
        if sc.jsonld<1: errors.append(f'{p.name}: missing JSON-LD')
    else:
        if p.name=='404.html' and not noindex: errors.append('404.html should be noindex')
    for href in sc.links:
        if href.startswith('/') and not href.startswith('//'):
            path, _, frag = href[1:].partition('#'); path=path.split('?',1)[0]
            target=(PUBLIC / (path or 'index.html')).resolve()
            if not str(target).startswith(str(PUBLIC.resolve())): errors.append(f'{p.name}: unsafe link {href}'); continue
            if not target.exists(): errors.append(f'{p.name}: broken internal link {href}')
            elif frag and target.suffix=='.html':
                target_sc=Scan(); target_sc.feed(target.read_text(encoding='utf-8',errors='replace'))
                # IDs are checked by a simple textual presence check, avoiding a third-party dependency.
                if f'id="{frag}"' not in target.read_text(encoding='utf-8',errors='replace') and f"id='{frag}'" not in target.read_text(encoding='utf-8',errors='replace'):
                    errors.append(f'{p.name}: missing anchor {href}')
# Sitemap checks
try:
    tree=ET.parse(PUBLIC/'sitemap.xml'); ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
    locs=[n.text for n in tree.findall('.//s:loc',ns)]
    if len(locs)!=len(set(locs)): errors.append('sitemap.xml: duplicate URLs')
    for u in locs:
        parsed=urlparse(u)
        if parsed.netloc != urlparse(BASE).netloc: errors.append(f'sitemap.xml: URL host mismatch {u}')
        path=parsed.path.strip('/')
        target=PUBLIC/(path or 'index.html')
        if not target.exists(): errors.append(f'sitemap.xml: URL missing locally {u}')
    if any('/privacy.html' in u or '/404.html' in u for u in locs): errors.append('sitemap.xml should exclude privacy and 404 pages')
    indexable=[]
    for p in html_files:
        if p.name in ('404.html','privacy.html'): continue
        sc=Scan(); sc.feed(p.read_text(encoding='utf-8',errors='replace'))
        if sc.canonical: indexable.append(sc.canonical[0])
    missing=[u for u in indexable if u not in locs]
    if missing: errors.append('sitemap missing canonical pages: '+', '.join(missing))
except Exception as e: errors.append(f'sitemap.xml parse error: {e}')
# Basic robots check
robots=(PUBLIC/'robots.txt').read_text(encoding='utf-8',errors='replace')
if 'Sitemap: '+BASE+'/sitemap.xml' not in robots: errors.append('robots.txt sitemap directive missing or host mismatch')
if errors:
    print('\n'.join(errors)); print(f'\nSEO checks: FAILED ({len(errors)} issue(s))'); sys.exit(1)
print(f'SEO checks passed: {len([p for p in html_files if p.name not in ("404.html","privacy.html")])} indexable pages, sitemap links valid, internal links valid.')
