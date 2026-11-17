"""List exact normalized title matches for manual internal-citation review.

This only proposes candidates. It never edits a review, creates an edge, proves a
citation, or replaces reading the text and checking its reference/version.
"""
import argparse
import hashlib
import json
import re
import unicodedata
from pathlib import Path
import fitz
import yaml

root = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('paper_id')
args = parser.parse_args()

def normalized(value):
    return ''.join(c for c in unicodedata.normalize('NFKD', value).casefold() if c.isalnum())

review = json.loads((root / 'data/reviews/papers' / f'{args.paper_id}.json').read_text(encoding='utf-8'))
pages = []
for source in review['sources']:
    local = root / source['local_path']
    if hashlib.sha256(local.read_bytes()).hexdigest() != source['sha256']:
        raise ValueError('Source hash differs from registered source.')
    with fitz.open(local) as document:
        for index, page in enumerate(document):
            # Sorted extraction can interleave the lines of two-column
            # bibliographies. These are still only candidates for a human to
            # check; keep extraction alternatives separate to avoid matching
            # a title across the boundary between two alternatives.
            midpoint = (page.rect.x0 + page.rect.x1) / 2
            alternatives = [page.get_text(sort=True), page.get_text(sort=False)]
            alternatives.extend(page.get_text(clip=clip, sort=True) for clip in [
                fitz.Rect(page.rect.x0, page.rect.y0, midpoint, page.rect.y1),
                fitz.Rect(midpoint, page.rect.y0, page.rect.x1, page.rect.y1),
            ])
            pages.append((source['id'], index + 1, '\0'.join(map(normalized, alternatives))))
for directory in ['specialist', 'generalist', 'studies']:
    for note in sorted((root / directory).glob('*.md')):
        metadata = yaml.safe_load(re.match(r'^---[ \t]*\n(.*?)\n---[ \t]*(?:\n|$)', note.read_text(encoding='utf-8'), re.S)[1])
        if metadata['id'] == args.paper_id:
            continue
        target = normalized(metadata['title'])
        matches = [f'{source}:{number}' for source, number, content in pages if target in content]
        if matches:
            print(json.dumps({'id': metadata['id'], 'title': metadata['title'], 'candidate_pages': matches}, ensure_ascii=True))
