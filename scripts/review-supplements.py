"""Inventory publisher supplement links; optionally cache linked PDFs without marking them read.

OpenReview/API-only attachments and non-PDF archives require manual inspection.
An HTML scan is a discovery aid, not proof that every supplement was found.
"""
import argparse
import concurrent.futures
import hashlib
import json
from pathlib import Path
import re
import sys
from urllib.parse import urljoin, urlparse
import fitz
import requests
import yaml
from bs4 import BeautifulSoup

root = Path(__file__).resolve().parents[1]
sys.stdout.reconfigure(encoding='utf-8')
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('paper_ids', nargs='*')
parser.add_argument('--fetch-pdfs', action='store_true')
args = parser.parse_args()
inventory_path = root / 'data/reviews/supplement-inventory.json'
inventory = json.loads(inventory_path.read_text(encoding='utf-8')) if inventory_path.exists() else {}
catalogue = {}
for directory in ['specialist', 'generalist', 'studies']:
    for path in (root / directory).glob('*.md'):
        match = re.match(r'^---\s*\n(.*?)\n---(?:\n|$)', path.read_text(encoding='utf-8'), re.S)
        if not match:
            raise ValueError(f'Missing front matter: {path}')
        meta = yaml.safe_load(match[1])
        catalogue[meta['id']] = meta

def save(path, value):
    temporary = path.with_suffix(path.suffix + '.tmp')
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    temporary.replace(path)

def discover(paper_id):
    url = catalogue[paper_id]['paper_url']
    directory = root / 'research/full-text-review' / paper_id
    directory.mkdir(parents=True, exist_ok=True)
    item = {'publication_url': url, 'links': [], 'discovery_status': 'pending', 'manual_verification_complete': False}
    try:
        response = requests.get(url, timeout=25, headers={'User-Agent': 'Mozilla/5.0 (bibliography source verification)'})
        response.raise_for_status()
        if response.content.startswith(b'%PDF'):
            item['discovery_status'] = 'publication_link_is_pdf; inspect publisher landing page manually'
            return paper_id, item
        (directory / 'supplement-landing.html').write_bytes(response.content)
        item['retrieval_url'] = response.url
        item['landing_sha256'] = hashlib.sha256(response.content).hexdigest()
        soup = BeautifulSoup(response.content, 'html.parser')
        seen = set()
        for anchor in soup.select('a[href]'):
            target = urljoin(response.url, anchor['href'])
            label = anchor.get_text(' ', strip=True)
            if urlparse(target).scheme not in ['http', 'https'] or target in seen:
                continue
            if re.search(r'supplement|supplementary|appendix|appendices', label + ' ' + target, re.I):
                item['links'].append({'label': label, 'url': target})
                seen.add(target)
        item['discovery_status'] = 'links_found' if item['links'] else 'no_html_links_found; manual verification required'
        if 'openreview.net' in response.url:
            item['discovery_status'] += '; check API/attachment fields manually'
        if args.fetch_pdfs:
            registry = root / 'data/reviews/papers' / f'{paper_id}.json'
            review = json.loads(registry.read_text(encoding='utf-8'))
            for link in item['links']:
                if not urlparse(link['url']).path.lower().endswith('.pdf'):
                    link['acquisition'] = 'non-PDF link; inspect manually'
                    continue
                if any(source['url'] == link['url'] for source in review['sources']):
                    link['acquisition'] = 'already registered'
                    continue
                data = requests.get(link['url'], timeout=40)
                data.raise_for_status()
                if not data.content.startswith(b'%PDF'):
                    link['acquisition'] = 'not PDF bytes; inspect manually'
                    continue
                digest = hashlib.sha256(data.content).hexdigest()
                if any(source['sha256'] == digest for source in review['sources']):
                    link['acquisition'] = 'same bytes as registered source'
                    continue
                source_id = 'supplement'
                index = 2
                while any(source['id'] == source_id for source in review['sources']):
                    source_id = f'supplement-{index}'
                    index += 1
                local = directory / f'{source_id}.pdf'
                local.write_bytes(data.content)
                with fitz.open(local) as document:
                    pages = len(document)
                review['sources'].append(dict(id=source_id, url=link['url'], retrieval_url=data.url, version='publisher-linked supplementary PDF; identity/version unchecked', local_path=local.relative_to(root).as_posix(), sha256=digest, pages=pages, identity_checked=False, version_checked=False))
                link['acquisition'] = f'registered {source_id}; {pages} pages; unread'
                if review['status'] == 'verified':
                    review['status'] = 'reading'
                    review['issues'].append({'category': 'new_supplement', 'message': 'New scientific source discovered; read and check before restoring verified status.'})
                save(registry, review)
        return paper_id, item
    except Exception as error:
        item['discovery_status'] = 'discovery_failed; manual recovery required'
        item['error'] = str(error)[:300]
        return paper_id, item

selected = args.paper_ids or list(catalogue)
if any(paper_id not in catalogue for paper_id in selected):
    parser.error('Unknown paper ID')
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
    for paper_id, result in executor.map(discover, selected):
        inventory[paper_id] = result
        save(inventory_path, inventory)
        if result['links'] or result['discovery_status'].startswith('discovery_failed'):
            print(f"{paper_id}: {result['discovery_status']}; {len(result['links'])} candidate links", flush=True)
print(f'Inventoried {len(selected)} publisher pages; acquisition does not mark any page read.')
