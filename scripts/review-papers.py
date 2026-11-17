"""Acquire review sources and expose complete PDF pages without marking them read.

Dependencies: pymupdf, requests, beautifulsoup4, pyyaml.
Reading and claim verification are recorded by the reviewer, never by acquisition.
"""
import argparse
import concurrent.futures
import hashlib
import json
from pathlib import Path
import re
import sys
from functools import lru_cache
from urllib.parse import urljoin

import fitz
import requests
import yaml
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
REVIEWS = ROOT / 'data/reviews'
CACHE = ROOT / 'research/full-text-review'
sys.stdout.reconfigure(encoding='utf-8')


def save(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + '.tmp')
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    temporary.replace(path)


@lru_cache(maxsize=1)
def notes():
    result = {}
    for folder in ['specialist', 'generalist', 'studies']:
        for path in (ROOT / folder).glob('*.md'):
            raw = path.read_text(encoding='utf-8')
            match = re.match(r'^---\s*\n(.*?)\n---', raw, re.S)
            if match:
                data = yaml.safe_load(match[1])
                result[data['id']] = (path, data)
    return result


def initialize():
    imported = json.loads((ROOT / 'data/imports/iclr-neurips-icml-2026-11.json').read_text(encoding='utf-8'))
    imported = {p['paper_id']: p for p in imported['papers']}
    catalogue = notes()
    baseline_path = REVIEWS / 'baseline.json'
    if not baseline_path.exists():
        priority = ['pointer-networks', 'neural-combinatorial-optimization', 'attention-model', 'pomo', 'neurolkh', 'difusco', 'softdist', 'dimes']
        remaining = sorted(set(catalogue) - set(priority), key=lambda key: (catalogue[key][1]['year'], catalogue[key][1]['title']))
        save(baseline_path, {
            'version': 1, 'cutoff': '2026-11-16', 'paper_ids': priority + remaining,
            'original_paper_count': len(catalogue),
            'original_relations': yaml.safe_load((ROOT / 'data/relations.yml').read_text(encoding='utf-8'))['relations'],
            'policy': {'reading': 'complete main text, appendices and supplements', 'relations': 'explicit in-text citations only', 'out_of_scope': 'separate reference collection'},
        })
    for paper_id, (path, metadata) in catalogue.items():
        target = REVIEWS / 'papers' / f'{paper_id}.json'
        if target.exists():
            continue
        sources = []
        if paper_id in imported:
            original = imported[paper_id]
            source = original['reading_copy']
            pdf = ROOT / 'research/import-272' / f"{original['audit_id']}.pdf"
            if hashlib.sha256(pdf.read_bytes()).hexdigest() != source['sha256']:
                raise ValueError(f'{paper_id}: original PDF hash mismatch')
            sources.append({
                'id': 'paper', 'url': source['url'], 'version': source['version'],
                'retrieval_url': source.get('retrieval_url', source['url']),
                'local_path': pdf.relative_to(ROOT).as_posix(), 'sha256': source['sha256'], 'pages': source['pages'],
                'identity_checked': False, 'version_checked': False,
            })
        elif paper_id == 'softdist' and (ROOT / 'research/softdist-original.pdf').exists():
            pdf = ROOT / 'research/softdist-original.pdf'
            sources.append({
                'id': 'paper', 'url': 'https://raw.githubusercontent.com/mlresearch/v235/main/assets/xia24f/xia24f.pdf',
                'version': 'publisher proceedings PDF', 'local_path': pdf.relative_to(ROOT).as_posix(),
                'sha256': hashlib.sha256(pdf.read_bytes()).hexdigest(), 'pages': len(fitz.open(pdf)),
                'identity_checked': False, 'version_checked': False,
            })
        save(target, {
            'version': 1, 'paper_id': paper_id, 'note_path': path.relative_to(ROOT).as_posix(),
            'baseline_note_sha256': hashlib.sha256(path.read_bytes()).hexdigest(), 'status': 'pending',
            'sources': sources, 'reading_log': [], 'claims': [], 'metadata_evidence': [],
            'citations': [], 'citation_scan_complete': False, 'figures_checked': False,
            'note_crosscheck_complete': False, 'issues': [], 'corrections': [],
        })
    print(f'Initialized {len(catalogue)} review records; no paper has been marked as read.')


def fetch_one(paper_id, extra_urls=None):
    target = REVIEWS / 'papers' / f'{paper_id}.json'
    review = json.loads(target.read_text(encoding='utf-8'))
    if review['sources']:
        return paper_id, 'source already cached'
    _, metadata = notes()[paper_id]
    directory = CACHE / paper_id
    directory.mkdir(parents=True, exist_ok=True)
    candidates = [(metadata['paper_url'], 'publication')] + [(url, 'recovery') for url in (extra_urls or [])]
    errors = []
    session = requests.Session()
    session.headers['User-Agent'] = 'Mozilla/5.0 (research bibliography verification)'
    visited = set()
    for url, origin in candidates:
        if url in visited:
            continue
        visited.add(url)
        try:
            response = session.get(url, timeout=35)
            response.raise_for_status()
            if response.content.startswith(b'%PDF'):
                document = fitz.open(stream=response.content, filetype='pdf')
                pdf = directory / 'paper.pdf'
                pdf.write_bytes(response.content)
                review['sources'] = [{
                    'id': 'paper', 'url': url, 'retrieval_url': response.url,
                    'version': 'publisher PDF' if origin == 'publication' and 'arxiv.org/' not in response.url else 'author manuscript; version correspondence not yet verified',
                    'local_path': pdf.relative_to(ROOT).as_posix(), 'sha256': hashlib.sha256(response.content).hexdigest(),
                    'pages': len(document), 'identity_checked': False, 'version_checked': False,
                }]
                review['issues'] = [i for i in review['issues'] if i.get('category') != 'source_acquisition']
                save(target, review)
                return paper_id, f'acquired {len(document)} pages; not yet read'
            html = directory / f'page-{len(visited)}.html'
            html.write_bytes(response.content)
            soup = BeautifulSoup(response.content, 'html.parser')
            for meta in soup.select('meta[name="citation_pdf_url"]'):
                candidates.append((urljoin(response.url, meta.get('content', '')), origin))
            if 'openreview.net/forum?' in url:
                candidates.append((url.replace('/forum?', '/pdf?'), origin))
            for anchor in soup.select('a[href]'):
                link = urljoin(response.url, anchor['href'])
                label = anchor.get_text(' ', strip=True).lower()
                if label in ['paper', 'pdf', 'download pdf', 'full text', 'pdf download'] or (link.endswith('.pdf') and ('paper' in link.lower() or 'proceedings' in link.lower())):
                    if link != url:
                        candidates.append((link, origin))
            # Use the manuscript only after trying links from the publication page.
            arxiv = metadata.get('arxiv_url')
            if arxiv:
                candidates.append((arxiv.replace('/abs/', '/pdf/'), 'manuscript'))
            figure_source = metadata.get('figure', {}).get('source_url')
            if figure_source:
                candidates.append((figure_source, 'manuscript'))
        except Exception as error:
            errors.append({'url': url, 'error': str(error)[:250]})
            if len(visited) == 1 and metadata.get('arxiv_url'):
                candidates.append((metadata['arxiv_url'].replace('/abs/', '/pdf/'), 'manuscript'))
    review['issues'] = [i for i in review['issues'] if i.get('category') != 'source_acquisition']
    review['issues'].append({'category': 'source_acquisition', 'message': 'No complete PDF acquired from attempted sources.', 'attempts': errors})
    save(target, review)
    return paper_id, 'needs source recovery'


def read_pages(paper_id, source_id, start, end, order='layout'):
    review = json.loads((REVIEWS / 'papers' / f'{paper_id}.json').read_text(encoding='utf-8'))
    source = next(item for item in review['sources'] if item['id'] == source_id)
    path = ROOT / source['local_path']
    if hashlib.sha256(path.read_bytes()).hexdigest() != source['sha256']:
        raise ValueError('PDF changed since source registration')
    document = fitz.open(path)
    if start < 1 or end > len(document) or start > end:
        raise ValueError('Invalid page range')
    pages = [(number, document[number - 1].get_text(sort=order == 'layout')) for number in range(start, end + 1)]
    # Refuse large calls rather than silently truncating a source and recording false coverage.
    if sum(len(text) for _, text in pages) > 24000:
        raise ValueError('Page range exceeds 24000 characters. Request fewer pages; nothing has been marked read.')
    for number, text in pages:
        print(f'\n===== {paper_id} / {source_id} / PDF page {number} of {len(document)} =====\n{text}')
    print('\nReading this output does not automatically alter the reading log.')


def checkpoint(paper_id, source_id, start, end, notes_text):
    if not notes_text or not notes_text.strip():
        raise ValueError('A manual reading summary is required.')
    target = REVIEWS / 'papers' / f'{paper_id}.json'
    review = json.loads(target.read_text(encoding='utf-8'))
    source = next(item for item in review['sources'] if item['id'] == source_id)
    if start < 1 or start > end or end > source['pages']:
        raise ValueError('Invalid reading range')
    if review['status'] == 'verified':
        raise ValueError('Reopen the review explicitly before changing completed reading evidence.')
    review['status'] = 'reading'
    review['reading_log'].append(dict(source_id=source_id, first_page=start, last_page=end, notes=notes_text))
    save(target, review)
    print(f'{paper_id}: saved manually confirmed {source_id} pages {start}-{end}; not marked verified.')


def status():
    records = [json.loads(p.read_text(encoding='utf-8')) for p in (REVIEWS / 'papers').glob('*.json')]
    from collections import Counter
    print(json.dumps({'papers': len(records), 'status': dict(Counter(r['status'] for r in records)), 'with_pdf': sum(bool(r['sources']) for r in records), 'cached_pdf_pages': sum(s['pages'] for r in records for s in r['sources'])}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('operation', choices=['init', 'fetch', 'read', 'checkpoint', 'status'])
    parser.add_argument('paper_ids', nargs='*')
    parser.add_argument('--source', default='paper')
    parser.add_argument('--start', type=int, default=1)
    parser.add_argument('--end', type=int, default=2)
    parser.add_argument('--order', choices=['layout', 'blocks'], default='layout',
                        help='Use PDF block order for rotated tables or interleaved columns; this never records reading coverage')
    parser.add_argument('--url', action='append', default=[], help='Additional legal public source URL for recovery')
    parser.add_argument('--notes', help='Manual summary of pages actually read; required by checkpoint')
    args = parser.parse_args()
    if args.operation == 'init':
        initialize()
    elif args.operation == 'status':
        status()
    elif args.operation == 'read':
        read_pages(args.paper_ids[0], args.source, args.start, args.end, args.order)
    elif args.operation == 'checkpoint':
        checkpoint(args.paper_ids[0], args.source, args.start, args.end, args.notes)
    elif args.operation == 'fetch':
        ids = args.paper_ids or list(notes())
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
            for paper_id, result in pool.map(lambda paper_id: fetch_one(paper_id, args.url), ids):
                print(paper_id, result, flush=True)
