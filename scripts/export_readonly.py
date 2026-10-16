"""Package prerendered HTML for offline, read-only design review.

No alternate application is implemented: pages and CSS come from next build.
Search/filter/dialog controls are disabled because the app is not hydrated.
"""
from pathlib import Path
from html.parser import HTMLParser
from html import escape
from urllib.parse import urlsplit
import json
import shutil

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'artifacts/preview'
ASSETS = OUT / 'assets'
ASSETS.mkdir(parents=True, exist_ok=True)
manifest = json.loads((ROOT / '.next/prerender-manifest.json').read_text())
routes = sorted(route for route in manifest['routes'] if route in ('/zh', '/en') or route.startswith(('/zh/', '/en/')))

def filename(route):
    return route.strip('/').replace('/', '--') + '.html'

class Export(HTMLParser):
    def __init__(self, locale):
        super().__init__(convert_charrefs=False)
        self.output = []
        self.skip_script = False
        self.locale = locale
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'script':
            self.skip_script = True
            return
        if self.skip_script: return
        if tag == 'link' and attrs.get('href', '').startswith('/_next/'):
            if attrs.get('rel') != 'stylesheet': return
            source = ROOT / '.next' / attrs['href'].removeprefix('/_next/')
            shutil.copy2(source, ASSETS / source.name)
            attrs['href'] = 'assets/' + source.name
        if tag == 'a' and attrs.get('href', '').startswith('/'):
            url = urlsplit(attrs['href'])
            path = url.path.rstrip('/')
            if path in routes:
                attrs['href'] = filename(path) + (('#' + url.fragment) if url.fragment else '')
        if attrs.get('href') == '/images/imagined-worlds.png':
            attrs['href'] = 'assets/imagined-worlds.png'
        if tag in ('input', 'button', 'select'): attrs['disabled'] = None
        attribute_text = ''.join(' ' + key + ('' if value is None else '="' + escape(value, quote=True) + '"') for key, value in attrs.items())
        self.output.append('<' + tag + attribute_text + '>')
        if tag == 'body':
            message = '只读审阅版：页面链接可浏览；筛选、搜索和弹窗在此版本中停用。完整交互请按 README 启动应用。' if self.locale == 'zh' else 'Read-only review: page links work; filtering, search and dialogs are disabled here. Run the app using README for the full interface.'
            self.output.append('<aside role="note" style="padding:12px 20px;background:#181918;color:white;font:12px/1.8 Arial,sans-serif">' + escape(message) + ' <a href="index.html" style="text-decoration:underline;color:inherit">' + ('审阅目录' if self.locale == 'zh' else 'Review index') + '</a></aside>')
    def handle_endtag(self, tag):
        if tag == 'script':
            self.skip_script = False
            return
        if not self.skip_script: self.output.append('</' + tag + '>')
    def handle_data(self, data):
        if not self.skip_script: self.output.append(data)
    def handle_entityref(self, name):
        if not self.skip_script: self.output.append('&' + name + ';')
    def handle_charref(self, name):
        if not self.skip_script: self.output.append('&#' + name + ';')
    def handle_comment(self, data):
        if not self.skip_script: self.output.append('<!--' + data + '-->')
    def handle_decl(self, decl): self.output.append('<!' + decl + '>')

shutil.copy2(ROOT / 'public/images/imagined-worlds.png', ASSETS / 'imagined-worlds.png')
for route in routes:
    parser = Export('zh' if route.startswith('/zh') else 'en')
    parser.feed((ROOT / '.next/server/app' / (route.lstrip('/') + '.html')).read_text())
    (OUT / filename(route)).write_text(''.join(parser.output))

index = '''<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>黑白测评组 P1 只读审阅目录</title><style>body{font:16px/1.8 Arial,sans-serif;background:#f8f8f4;color:#181918;margin:40px auto;padding:0 22px;max-width:900px}h1{font-family:Georgia,serif;font-size:36px}a{color:inherit}nav{display:flex;gap:25px;flex-wrap:wrap;margin:30px 0}li{margin:8px 0}.note{border:1px solid;padding:18px}details{margin:25px 0}summary{cursor:pointer;font-weight:bold}</style><h1>黑白测评组 / P1 只读审阅</h1><p class="note">这是生产构建导出的静态阅读页，不是截图，也不是交互验收结果。解压后可直接打开；完整应用的启动步骤见交付包 README。所有文章、评分、阅读量、活动与中奖信息均为示例。<br>This is a read-only export, not a screenshot or browser acceptance result. All editorial and activity data is illustrative.</p><nav><a href="zh.html">打开中文首页 ↗</a><a href="en.html">Open English home ↗</a><a href="zh--reviews.html">游戏测评 ↗</a><a href="zh--activities.html">活动中心 ↗</a><a href="zh--business.html">商务合作 ↗</a></nav>'''
for locale in ('zh', 'en'):
    index += '<details><summary>' + ('中文全部页面' if locale == 'zh' else 'All English pages') + '</summary><ul>'
    for route in routes:
        if route == '/' + locale or route.startswith('/' + locale + '/'):
            index += '<li><a href="' + filename(route) + '">' + escape(route) + '</a></li>'
    index += '</ul></details>'
(OUT / 'index.html').write_text(index + '</html>')
assert all('<script' not in (OUT / filename(route)).read_text() for route in routes)
print(json.dumps({'exported_readonly_pages': len(routes), 'index': str(OUT / 'index.html'), 'scripts_removed': True, 'interactive_qa': 'not performed'}, ensure_ascii=False))
