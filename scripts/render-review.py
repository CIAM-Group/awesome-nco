"""Render up to four registered PDF pages into an ignored contact sheet for visual review.

Usage: python scripts/render-review.py PAPER_ID paper:4 paper:5 supplement:2
Rendering does not mark a source, figure, or reading range reviewed.
"""
import argparse
import hashlib
import json
from pathlib import Path
import fitz
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('paper_id')
parser.add_argument('pages', nargs='+', help='SOURCE_ID:1_BASED_PAGE')
parser.add_argument('--name', default='visual-check')
args = parser.parse_args()
if not 1 <= len(args.pages) <= 4:
    parser.error('Choose between one and four pages per sheet.')
record = json.loads((root / 'data/reviews/papers' / f'{args.paper_id}.json').read_text(encoding='utf-8'))
sources = {item['id']: item for item in record['sources']}
tiles = []
for specification in args.pages:
    source_id, page_text = specification.rsplit(':', 1)
    source = sources[source_id]
    local = root / source['local_path']
    if hashlib.sha256(local.read_bytes()).hexdigest() != source['sha256']:
        raise ValueError(f'{source_id}: source hash differs from the review registry')
    with fitz.open(local) as document:
        number = int(page_text)
        if not 1 <= number <= len(document):
            raise ValueError(f'{source_id}: invalid page {number}')
        pixmap = document[number - 1].get_pixmap(matrix=fitz.Matrix(1.35, 1.35), alpha=False)
        page = Image.frombytes('RGB', [pixmap.width, pixmap.height], pixmap.samples)
    tile = Image.new('RGB', (840, 1150), '#eeeeee')
    page.thumbnail((820, 1100))
    tile.paste(page, ((840 - page.width) // 2, 10))
    ImageDraw.Draw(tile).text((12, 1124), f'{args.paper_id} / {source_id} / PDF page {number}', fill='black')
    tiles.append(tile)
columns = min(len(tiles), 2)
sheet = Image.new('RGB', (840 * columns, 1150 * ((len(tiles) + columns - 1) // columns)), '#eeeeee')
for index, tile in enumerate(tiles):
    sheet.paste(tile, ((index % columns) * 840, (index // columns) * 1150))
out = root / 'research/full-text-review' / args.paper_id / f'{args.name}.jpg'
out.parent.mkdir(parents=True, exist_ok=True)
sheet.save(out, quality=91)
print(out)
