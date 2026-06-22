#!/usr/bin/env node
// validate-skills.mjs — structural validator for SKILL.md files.
//
// Asserts, for every skills/**/SKILL.md:
//   • frontmatter parses and has non-empty `name` and `description`   (HARD)
//   • body is non-empty, has an H1, and has no placeholder tokens     (HARD)
//   • directory name matches the kebab-case of `name`                 (HARD)
//   • description is trigger-precise: >= 12 words AND carries a cue
//     pattern (`use when` / `do not use` / a "when someone says" line) (SOFT — warns)
//
// Exits non-zero on any HARD failure. Soft issues warn but do not fail.
// Only dependency is gray-matter.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_DIR = join(ROOT, "skills");

const PLACEHOLDER_TOKENS = ["TODO", "TKTK", "lorem", "<placeholder>", "[fill"];

// Lowercase, collapse every run of non-alphanumerics to a single hyphen,
// trim leading/trailing hyphens. "Build on Agent-Native" -> "build-on-agent-native".
function kebab(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function wordCount(s) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

// Recursively find every SKILL.md under skills/.
function findSkillFiles(dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      out.push(...findSkillFiles(full));
    } else if (name === "SKILL.md") {
      out.push(full);
    }
  }
  return out;
}

function validateFile(file) {
  const errors = [];
  const warnings = [];
  const rel = file.slice(ROOT.length + 1);

  const raw = readFileSync(file, "utf8");
  let parsed;
  try {
    parsed = matter(raw);
  } catch (e) {
    errors.push(`frontmatter failed to parse: ${e.message}`);
    return { rel, errors, warnings };
  }

  const { data, content } = parsed;
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const description =
    typeof data.description === "string" ? data.description.trim() : "";

  // HARD: name + description present and non-empty.
  if (!name) errors.push("frontmatter `name` is missing or empty");
  if (!description) errors.push("frontmatter `description` is missing or empty");

  // HARD: directory name matches kebab-case of name.
  if (name) {
    const dirName = basename(dirname(file));
    const expected = kebab(name);
    if (dirName !== expected) {
      errors.push(
        `directory "${dirName}" does not match kebab-case of name "${name}" (expected "${expected}")`
      );
    }
  }

  // HARD: body non-empty, has an H1, no placeholder tokens.
  const body = content.trim();
  if (!body) {
    errors.push("body is empty");
  } else {
    if (!/^#\s+\S/m.test(content)) {
      errors.push("body has no H1 (a line starting with `# `)");
    }
    const lower = content.toLowerCase();
    for (const tok of PLACEHOLDER_TOKENS) {
      if (lower.includes(tok.toLowerCase())) {
        errors.push(`body contains placeholder token "${tok}"`);
      }
    }
  }

  // SOFT: trigger precision.
  if (description) {
    const wc = wordCount(description);
    if (wc < 12) {
      warnings.push(`description is only ${wc} words (< 12); make it more trigger-precise`);
    }
    const lower = description.toLowerCase();
    const hasCue =
      lower.includes("use when") ||
      lower.includes("do not use") ||
      /when someone says/.test(lower);
    if (!hasCue) {
      warnings.push(
        'description lacks a trigger cue (`use when`, `do not use`, or a "when someone says" phrase)'
      );
    }
  }

  return { rel, errors, warnings };
}

function main() {
  const files = findSkillFiles(SKILLS_DIR);

  if (files.length === 0) {
    console.error(`No SKILL.md files found under ${SKILLS_DIR}`);
    process.exit(1);
  }

  let hardFailures = 0;
  let softCount = 0;

  for (const file of files.sort()) {
    const { rel, errors, warnings } = validateFile(file);
    if (errors.length === 0 && warnings.length === 0) {
      console.log(`✓ ${rel}`);
    } else {
      const mark = errors.length ? "✗" : "⚠";
      console.log(`${mark} ${rel}`);
      for (const e of errors) console.log(`    error: ${e}`);
      for (const w of warnings) console.log(`    warn:  ${w}`);
    }
    hardFailures += errors.length;
    softCount += warnings.length;
  }

  console.log("");
  console.log(
    `${files.length} file(s) checked · ${hardFailures} error(s) · ${softCount} warning(s)`
  );

  if (hardFailures > 0) {
    console.error(`\nFAILED: ${hardFailures} hard error(s).`);
    process.exit(1);
  }
  console.log("\nOK: no hard failures.");
}

main();
