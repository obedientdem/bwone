"""Verify generated public HTML without starting a preview server or browser.

This is a structural build check, not browser/visual/interactive acceptance.
"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json

ROOT = Path(__file__).resolve().parents[1]

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.ids = []
        self.lang = None
        self.h1 = 0
        self.forms = []
        self.input_names = []
    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag == 'html': self.lang = attrs.get('lang')
        if tag == 'h1': self.h1 += 1
        if tag == 'a' and attrs.get('href'): self.links.append(attrs['href'])
        if attrs.get('id'): self.ids.append(attrs['id'])
        if tag == 'form': self.forms.append(attrs)
        if tag == 'input' and attrs.get('name'): self.input_names.append(attrs['name'])

manifest = json.loads((ROOT / '.next/prerender-manifest.json').read_text())
routes = {route for route in manifest['routes'] if route == '/zh' or route.startswith('/zh/') or route == '/en' or route.startswith('/en/')}
base_path = json.loads((ROOT / '.next/routes-manifest.json').read_text()).get('basePath', '')
errors = []
pages = {}
for route in sorted(routes):
    file = ROOT / '.next/server/app' / (route.lstrip('/') + '.html')
    if not file.is_file():
        errors.append(f'{route}: generated HTML missing')
        continue
    html = file.read_text()
    parsed = Page()
    parsed.feed(html)
    pages[route] = parsed
    expected_lang = 'zh-CN' if route.startswith('/zh') else 'en'
    if parsed.lang != expected_lang: errors.append(f'{route}: wrong document language {parsed.lang}')
    if parsed.h1 != 1: errors.append(f'{route}: expected one h1, found {parsed.h1}')
    if len(parsed.ids) != len(set(parsed.ids)): errors.append(f'{route}: duplicate element ids')
    if 'main-content' not in parsed.ids: errors.append(f'{route}: skip-link target missing')
    if 'noindex' not in html: errors.append(f'{route}: preview noindex missing')
    if not ('预览样刊' in html or 'Preview edition' in html): errors.append(f'{route}: preview disclosure missing')
    if any(name != 'q' for name in parsed.input_names): errors.append(f'{route}: unexpected data-collection input')
for route, page in pages.items():
    for href in page.links:
        url = urlsplit(href)
        if url.scheme or url.netloc: continue
        path = unquote(url.path)
        if base_path and (path == base_path or path.startswith(base_path + '/')):
            path = path[len(base_path):]
        target = path.rstrip('/') or route
        if not url.path: target = route
        if target not in routes:
            errors.append(f'{route}: broken internal target {href}')
        elif url.fragment and target in pages and url.fragment not in pages[target].ids:
            errors.append(f'{route}: broken section target {href}')
if len(routes) != 48: errors.append(f'Expected 48 bilingual public routes, found {len(routes)}')
result = {'public_pages': len(routes), 'internal_links_checked': sum(len(page.links) for page in pages.values()), 'errors': errors, 'visual_qa': 'not performed', 'browser_interactions': 'not performed'}
print(json.dumps(result, ensure_ascii=False, indent=2))
if errors: raise SystemExit(1)
