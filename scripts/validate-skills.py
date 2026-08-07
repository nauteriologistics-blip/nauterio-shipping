#!/usr/bin/env python3
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

import yaml

ALLOWED_STANDARD = {
    "name",
    "description",
    "license",
    "compatibility",
    "metadata",
    "allowed-tools",
}
ALLOWED_CLAUDE = ALLOWED_STANDARD | {
    "disable-model-invocation",
    "user-invocable",
    "argument-hint",
    "model",
    "context",
    "agent",
    "background",
    "hooks",
    "paths",
    "shell",
    "arguments",
}


def parse_frontmatter(text: str, path: Path) -> tuple[dict, str]:
    if not text.startswith("---\n"):
        raise ValueError(f"{path}: missing YAML frontmatter")
    end = text.find("\n---\n", 4)
    if end == -1:
        raise ValueError(f"{path}: unterminated YAML frontmatter")
    raw = text[4:end]
    data = yaml.safe_load(raw) or {}
    if not isinstance(data, dict):
        raise ValueError(f"{path}: frontmatter must be a mapping")
    return data, text[end + 5 :]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=str(Path(__file__).resolve().parents[1]))
    args = parser.parse_args()
    root = Path(args.root).resolve()
    skill_root = root / ".claude" / "skills"
    errors: list[str] = []
    warnings: list[str] = []

    if not skill_root.is_dir():
        print(f"Missing skill directory: {skill_root}", file=sys.stderr)
        return 1

    files = sorted(skill_root.glob("*/SKILL.md"))
    if not files:
        print("No SKILL.md files found", file=sys.stderr)
        return 1

    names: set[str] = set()
    for path in files:
        text = path.read_text(encoding="utf-8")
        try:
            meta, body = parse_frontmatter(text, path)
        except Exception as exc:
            errors.append(str(exc))
            continue

        unexpected = set(meta) - ALLOWED_CLAUDE
        if unexpected:
            errors.append(f"{path}: unexpected frontmatter fields: {sorted(unexpected)}")

        name = meta.get("name")
        description = meta.get("description")
        dirname = path.parent.name
        if not isinstance(name, str) or not re.fullmatch(r"[a-z0-9-]+", name):
            errors.append(f"{path}: name must be kebab-case")
        elif name != dirname:
            errors.append(f"{path}: name '{name}' does not match directory '{dirname}'")
        elif name in names:
            errors.append(f"{path}: duplicate skill name '{name}'")
        else:
            names.add(name)

        if not isinstance(description, str) or len(description.strip()) < 30:
            errors.append(f"{path}: description must clearly explain what and when")
        elif len(description) > 500:
            warnings.append(f"{path}: description is longer than 500 characters")

        line_count = len(text.splitlines())
        if line_count > 500:
            warnings.append(f"{path}: {line_count} lines; move detail into references")
        if len(body.strip()) < 100:
            errors.append(f"{path}: skill body is too short")

        for rel in re.findall(r"`(docs/[^`]+)`", body):
            target = root / rel
            if not target.exists():
                errors.append(f"{path}: referenced file does not exist: {rel}")

    required = [
        root / "CLAUDE.md",
        root / "docs" / "nauterio-complete-specification.md",
        root / "docs" / "specification-index.md",
        root / "docs" / "assets" / "nauterio-logo.png",
    ]
    for path in required:
        if not path.exists():
            errors.append(f"Missing required project file: {path}")

    print(f"Validated {len(files)} skills under {skill_root}")
    for warning in warnings:
        print(f"WARNING: {warning}")
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1
    print("All skill checks passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
