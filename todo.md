# Notion-Style Inline Editing — Todo

## Architecture
- [x] Restore corrupted markdown content in production DB
- [ ] Add `editorjs_content` column to schema (keep `content` for markdown, separate column for JSON)
- [ ] Update `contentFormat` logic: render from `editorjs_content` when format is "editorjs", from `content` when "markdown"
- [ ] Ensure Editor.js never auto-saves empty blocks over existing content

## Inline Editing (Admin Only)
- [ ] Single-click to edit (not double-click) for all fields:
  - [ ] Title (h1) — click to get a text input
  - [ ] Description — click to get a textarea
  - [ ] Header image — click to upload/change
  - [ ] GitHub URL — click to edit
  - [ ] Live URL + button text + icon — click to edit
  - [ ] Slug — click to edit
  - [ ] Visibility — click to cycle
- [ ] Editor.js content area: always interactive for admins, read-only rendered for everyone else
- [ ] No edit mode toggle, no admin toolbar — page looks identical for admin and non-admin
- [ ] Auto-save on blur/change with debounce

## Content Migration
- [ ] One-time LLM conversion of existing markdown projects to Editor.js JSON
- [ ] Store converted JSON in `editorjs_content` column
- [ ] Keep original markdown in `content` column as backup
