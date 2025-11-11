# Atomic Commit Command

You are tasked with creating atomic commits following the Conventional Commits 1.0.0 specification.

## Instructions

1. **Analyze Current Changes**:
   - Run `git status` to see all modified and untracked files
   - Run `git diff` for modified files to understand the changes
   - Read relevant files if needed to understand the context

2. **Group Changes Logically**:
   - Group related changes into separate atomic commits
   - Each commit should represent ONE logical change
   - Common groupings:
     - Models/Entities (feat/fix)
     - Database migrations (feat/fix/refactor)
     - DTOs (feat/refactor)
     - Controllers/API endpoints (feat/fix)
     - Services/Business logic (feat/fix/refactor)
     - Configuration changes (chore/feat)
     - Documentation (docs)
     - Tests (test)
     - Dependency updates (chore)
     - Bug fixes (fix)
     - Performance improvements (perf)
     - Code cleanup (refactor/style)

3. **Follow Conventional Commit Format**:
   ```
   <type>(<scope>): <description>

   [optional body with bullet points]

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude <noreply@anthropic.com>
   ```

4. **Commit Types** (from @./.claude/guidelines/commit-conventions.md):
   - `feat`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation changes
   - `style`: Code style changes (formatting, semicolons, etc.)
   - `refactor`: Code refactoring without changing functionality
   - `perf`: Performance improvements
   - `test`: Adding or updating tests
   - `build`: Build system changes
   - `ci`: CI/CD changes
   - `chore`: Maintenance tasks (dependencies, configs)
   - `revert`: Revert a previous commit

5. **Scope Examples**:
   - `models`, `data`, `api`, `dtos`, `controllers`, `services`
   - `db`, `migrations`, `auth`, `health`, `docker`
   - `frontend`, `backend`, `readme`, `config`
   - Be specific but concise

6. **Commit Message Guidelines**:
   - Use imperative mood ("add" not "added", "fix" not "fixed")
   - Start with lowercase (except for proper nouns)
   - No period at the end of description
   - Keep description under 72 characters
   - Use body for detailed explanations with bullet points
   - Include emojis in body if it helps clarity (✨ 🐛 📝 🔧 🚀 etc.)
   - Always end with the Claude footer

7. **Create Commits**:
   - Explain your grouping strategy first
   - Create each commit with proper message
   - Use `git add <files>` for specific files
   - Use heredoc for multi-line commit messages
   - Verify with `git status` after all commits

8. **Best Practices**:
   - Never mix different concerns in one commit
   - Keep commits small and focused
   - Ensure each commit builds successfully (if applicable)
   - Write clear, descriptive commit messages
   - Include "why" in the body, not just "what"

## Example Commit Plan

Before creating commits, present a plan like:

```
I'll create the following atomic commits:

1. feat(models): add User entity
   - User.cs model file

2. feat(data): configure User entity in DbContext
   - ApplicationDbContext.cs updates

3. feat(dtos): add User DTOs
   - CreateUserDto.cs, UpdateUserDto.cs, UserDto.cs

4. feat(api): add UsersController with CRUD operations
   - UsersController.cs

5. feat(db): add migration for User table
   - Migration files

6. docs(http): add User API test cases
   - .http file updates
```

Then wait for user approval or proceed if changes are straightforward.

## Notes

- If there's only ONE logical change, create ONE commit
- If changes span multiple concerns, ALWAYS split into multiple commits
- Check @./.claude/guidelines/commit-conventions.md for the full specification
- Follow the existing commit style in the repository (check git log)
- Be thorough but efficient - don't over-split trivial changes

Now analyze the current git changes and create appropriate atomic commits.
