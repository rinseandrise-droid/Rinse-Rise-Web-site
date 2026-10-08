"""Extract the Rinse & Rise rate card spreadsheet into data/rate-card.json.

The spreadsheet is the single source of truth for services, groups, item names,
rates and units. Run this whenever the spreadsheet changes:

    python scripts/extract-rate-card.py

Item names and rates are copied verbatim. Only surrounding whitespace is trimmed
for display (the untrimmed cell text is kept in `sourceName`).
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_XLSX = ROOT.parent / "Rinse&Rise Laundryrite Rate Card.xlsx"
OUT = ROOT / "data" / "rate-card.json"

# Units are not written in every sheet header; these come from the sheet headers
# ("RATE /pice" on Dry Clean) and from how the shop bills each service.
SHEET_UNITS = {
    "Steam Iron": "piece",
    "Dry Clean": "piece",
    "Laundry": "kg",
    "Shoe Cleaning": "piece",
}


def slug(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.strip().lower()).strip("-")


def parse_rate(raw):
    """Return (amount, unit_override, raw_text). Keeps forms like '40/sq' intact."""
    if isinstance(raw, (int, float)):
        return float(raw), None, None
    text = str(raw).strip()
    match = re.fullmatch(r"(\d+(?:\.\d+)?)\s*/\s*([A-Za-z. ]+)", text)
    if match:
        return float(match.group(1)), match.group(2).strip(), text
    raise ValueError(f"Unrecognised rate value: {raw!r}")


def extract(xlsx: Path) -> dict:
    wb = openpyxl.load_workbook(xlsx, data_only=True)
    services = []
    for ws in wb.worksheets:
        service_name = ws.title.strip()
        service_id = slug(service_name)
        rows = [r for r in ws.iter_rows(values_only=True) if any(c is not None for c in r)]
        header = rows[0]
        groups = []
        # Each group is a (name, rate) column pair; empty columns separate them.
        col = 0
        while col < len(header):
            name_header = header[col]
            if name_header is None:
                col += 1
                continue
            rate_header = header[col + 1] if col + 1 < len(header) else None
            group_name = str(name_header).strip()
            items = []
            for row in rows[1:]:
                name = row[col] if col < len(row) else None
                rate = row[col + 1] if col + 1 < len(row) else None
                if name is None or str(name).strip() == "":
                    continue
                if rate is None or str(rate).strip() == "":
                    raise ValueError(f"{service_name}/{group_name}: '{name}' has no rate")
                amount, unit_override, raw_text = parse_rate(rate)
                item = {
                    "name": str(name).strip(),
                    "sourceName": str(name),
                    "rate": amount,
                    "unit": unit_override or SHEET_UNITS.get(service_name, "piece"),
                }
                if raw_text:
                    item["rateText"] = raw_text
                items.append(item)
            groups.append(
                {
                    "name": group_name,
                    "rateHeader": str(rate_header).strip() if rate_header else None,
                    "items": items,
                }
            )
            col += 2
        services.append({"id": service_id, "name": service_name, "groups": groups})
    return {"source": xlsx.name, "services": services}


def main() -> None:
    xlsx = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_XLSX
    data = extract(xlsx)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    total = sum(len(g["items"]) for s in data["services"] for g in s["groups"])
    print(f"Wrote {OUT} — {len(data['services'])} services, {total} items")


if __name__ == "__main__":
    main()
