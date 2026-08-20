# Agent Rules

## Restrictions

_(hard stops — never bypass)_

1. No code changes without explicit permission.
2. No task creation without explicit permission.
3. No implementation plans without explicit permission.
4. Never read `.env` files.

---

## Behavior

### Before responding

- Map the full context of the request (module, scope, affected areas).
- Validate suggestions against the current implementation; anticipate edge cases.
- Search the codebase for existing solutions before proposing new ones (utils, validations, masks, etc.).
- Ensure answers are brief and objective, without sacrificing details; do not skip complex steps or assume context.
- If there is any ambiguity on a request made by the user, clarify it before proceeding with changes.

### When writing code

- Follow the project's naming conventions (files, variables, functions).
- Use full, descriptive names — no abbreviations (`userResponse` not `usersRes`; `(account) =>` not `(a) =>`).
- No `{}` for single-line `if`/`else` blocks.
- No `any` in TypeScript — ever.
- No comments unless explicitly requested.
- Omit boilerplate and standard imports in snippets; show only the change + minimal surrounding context for placement.
- Prioritize clean code, performance and responsiveness.

### When suggesting

- Solve the root problem — don't suppress linter warnings with workarounds.
- Prefer existing patterns over new abstractions.
- Avoid workarounds; find the real fix.

### Communication

- Portuguese only.
- Use tools autonomously — avoid asking permission to run commands. Ask only when absolutely necessary.
- Be thorough and comprehensive; never omit critical implementation details or logic.
