# PLASMITE: Antigravity Build Plan
A context-preserving, prompt-by-prompt implementation plan for turning the existing Stitch-generated PLASMITE design system into a working product.

This document is intentionally split into small execution prompts. The goal is not to ask an agent to build the entire application in one giant request. Each prompt has a bounded responsibility, explicit source-of-truth rules, verification requirements, and a handoff protocol.

## 0. Mission
Build PLASMITE as a real, maintainable engineering-student notebook application from the existing design artifacts in the project folder.
- Use the existing Stitch outputs as visual and interaction references.
- Use PROJECT.md as the product specification.
- Use phase.md as the implementation sequencing reference.
- Use the PLASMITE logo asset as the brand asset.
- Preserve the visual language of the generated designs instead of replacing them with a generic dashboard template.
- Turn static Stitch screens into reusable application components.
- Connect the application to a real data layer.
- Make authentication, persistence, search, CRUD, responsive behavior, and validation actually work.
- Do not fake functionality with hard-coded demo state once the real data layer exists.
- Work in small verified increments.
## 1. Model Strategy
For Google Antigravity, use Claude Opus 4.6 Thinking for architecture, repository planning, difficult debugging, and final audits. Use Claude Sonnet 4.6 Thinking for most implementation prompts because it is faster and highly capable for coding, refactoring, and iterative UI work.
Current Antigravity documentation lists Claude Sonnet 4.6 Thinking and Claude Opus 4.6 Thinking as selectable reasoning models. Model availability can depend on the account or plan.
- PLAN / ARCHITECTURE: Claude Opus 4.6 Thinking.
- FOUNDATION IMPLEMENTATION: Claude Sonnet 4.6 Thinking.
- REPETITIVE UI IMPLEMENTATION: Claude Sonnet 4.6 Thinking.
- COMPLEX DATA MODEL OR SECURITY REVIEW: Claude Opus 4.6 Thinking.
- FINAL PRODUCT AUDIT: Claude Opus 4.6 Thinking.
- Do not change models in the middle of a single task unless the task explicitly says to do so.
## 2. Source-of-Truth Order
When sources disagree, use this priority order.
```text
1. Existing working code and database behavior
2. PROJECT.md for product intent
3. phase.md for sequencing
4. Stitch code.html files for page-level visual and interaction reference
5. Stitch screen.png files for visual comparison
6. DESIGN.md files for design-system and technical-editorial guidance
7. app logo and Name "PLASMITE".png for brand identity
8. Agent assumptions only when no source answers the question
```
## 3. Existing Folder Contract
```text
.
├── app logo and Name "PLASMITE".png
├── phase.md
├── PROJECT.md
└── stitch_plasmite_web_design_system/
    ├── image.png/screen.png
    ├── plasmite_account_storage_data_management_settings/
    │   ├── code.html
    │   └── screen.png
    ├── plasmite_admin_console/
    │   └── DESIGN.md
    ├── plasmite_command_palette_universal_search_overlay_cmd_k/
    │   ├── code.html
    │   └── screen.png
    ├── plasmite_console_operator_storage_student_admin_dashboard/
    │   ├── code.html
    │   └── screen.png
    ├── plasmite_distraction_free_note_editor/
    │   ├── code.html
    │   └── screen.png
    ├── plasmite_editorial_sign_in/
    │   ├── code.html
    │   └── screen.png
    ├── plasmite_editorial_sign_up/
    │   ├── code.html
    │   └── screen.png
    ├── plasmite_editorial_student_dashboard/
    │   ├── code.html
    │   └── screen.png
    ├── plasmite_engineering_tools_developer_utilities_hub/
    │   ├── code.html
    │   └── screen.png
    ├── plasmite_project_workspace_detail_menu/
    │   ├── code.html
    │   └── screen.png
    ├── plasmite_public_landing_page_editorial/
    │   ├── code.html
    │   └── screen.png
    ├── plasmite_revision_system_exam_deck/
    │   ├── code.html
    │   └── screen.png
    ├── plasmite_setup_step_1_student_profile/
    │   ├── code.html
    │   └── screen.png
    ├── plasmite_setup_step_2_curriculum/
    │   ├── code.html
    │   └── screen.png
    ├── plasmite_structured_lab_experiment_record_distance_vector_routing/
    │   ├── code.html
    │   └── screen.png
    ├── plasmite_subjects_syllabus_hub/
    │   ├── code.html
    │   └── screen.png
    ├── plasmite_tasks_academic_checklists_hub/
    │   ├── code.html
    │   └── screen.png
    └── technical_editorial_parchment/
        └── DESIGN.md
```
## 4. Non-Negotiable Agent Rules
- Read the relevant files before changing code.
- Never invent a visual system when an existing Stitch artifact covers the screen.
- Never delete a working feature merely to make a new feature easier.
- Never overwrite existing user data during migrations.
- Never hard-code credentials, API keys, service-role keys, or secrets.
- Never put privileged database operations in browser-only code.
- Never treat a screenshot as permission to copy inaccessible proprietary code verbatim; use it as a design reference.
- Prefer reusable components over page-specific duplication.
- Keep business logic separate from presentation where practical.
- Run the project after meaningful changes.
- Run the relevant tests after meaningful changes.
- Fix errors introduced by the current task before moving to the next task.
- Do not perform unrelated refactors during a bounded prompt.
- Do not change the chosen stack without a clear technical reason and explicit confirmation.
- Do not replace the brand name PLASMITE with Engineer Notebook.
- Do not create a second design system when one already exists.
- Do not create fake loading states that hide real errors.
- Do not mark a task complete until its acceptance criteria have been checked.
- At the end of each prompt, summarize files changed, behavior added, tests run, and remaining risks.
- If blocked, stop at the smallest safe boundary and explain the blocker instead of improvising a destructive workaround.
## 5. Context Preservation Protocol
Every prompt below is designed to be pasted into a fresh or continuing Antigravity agent conversation. If starting a fresh conversation, prepend the context packet below. If continuing the same conversation, still require the agent to read the local files because local files are the authoritative state.
```text
PROJECT ROOT: the current PLASMITE project folder.
PRODUCT SPEC: PROJECT.md
PHASE PLAN: phase.md
DESIGN SOURCE: stitch_plasmite_web_design_system/
BRAND ASSET: app logo and Name "PLASMITE".png
PRODUCT NAME: PLASMITE
RULE: inspect source files before implementation.
RULE: preserve existing working behavior.
RULE: implement only the scope of this prompt.
RULE: verify the result before reporting completion.
RULE: do not fabricate completion.
HANDOFF: report changed files, commands run, tests, screenshots or browser checks, and unresolved issues.
```
## 6. Global Acceptance Standard
- The application starts from a clean checkout.
- The requested route is reachable.
- The page uses the PLASMITE visual language.
- The page is responsive.
- Interactive controls have real behavior.
- Data persists when persistence is part of the feature.
- Authenticated data is isolated by user.
- Errors are surfaced clearly.
- Empty states are intentional.
- Loading states are intentional.
- No console errors remain from the implemented feature.
- No TypeScript or build errors remain.
- The agent reports exact verification commands.
## 7. Prompt 01: Repository Reconnaissance
MODEL: Claude Opus 4.6 Thinking
```text
You are the lead engineer for PLASMITE.
Do not implement features yet.
First inspect the entire repository and all existing source artifacts.
Read PROJECT.md completely.
Read phase.md completely.
Inspect every directory under stitch_plasmite_web_design_system.
Open every code.html and DESIGN.md that is relevant.
Inspect the available screen.png files and the PLASMITE logo asset.
Identify the current framework, package manager, entry points, routes, components, styles, environment files, and test setup.
Identify whether a database or authentication layer already exists.
Build a concise architecture map.
Build a screen-to-route mapping.
Build a component reuse map.
Build a data-model candidate map.
Build a dependency/risk list.
Do not change application code.
You may create only a planning artifact such as docs/PLASMITE_RECON.md.
At the end, state exactly what you inspected and what remains unknown.
```
## 8. Prompt 02: Freeze the Implementation Contract
MODEL: Claude Opus 4.6 Thinking
```text
Read PROJECT.md, phase.md, and the reconnaissance artifact from Prompt 01.
Create docs/PLASMITE_IMPLEMENTATION_CONTRACT.md.
Define the final stack based on the existing repository unless a strong blocker exists.
Define routing conventions.
Define component conventions.
Define data access conventions.
Define authentication conventions.
Define error handling conventions.
Define loading and empty-state conventions.
Define responsive breakpoints.
Define naming conventions.
Define the boundary between UI components and domain logic.
Define how Stitch references will be translated into reusable components.
Define a rule for preserving the existing visual identity.
Do not implement application features.
Keep the contract practical and short enough that future agents can actually follow it.
```
## 9. Prompt 03: Establish Git Safety
MODEL: Claude Sonnet 4.6 Thinking
```text
Inspect the repository status.
If Git is not initialized, initialize it only if that matches the existing project workflow.
Create or improve .gitignore for the actual stack.
Never ignore source files, migrations, or design references that belong in version control.
Never commit secrets.
Create a baseline commit only if the repository workflow permits it.
Do not modify application behavior.
Verify git status is understandable after the task.
Report the exact files changed.
```
## 10. Prompt 04: Build the Design Token Layer
MODEL: Claude Sonnet 4.6 Thinking
```text
Read the Stitch design sources and technical-editorial DESIGN.md.
Extract the recurring typography, spacing, borders, radii, surfaces, shadows, icon sizing, and interaction patterns.
Create one reusable PLASMITE design-token layer.
Do not invent a completely new theme.
Use the existing screens as the visual target.
Keep tokens centralized.
Support light and dark mode if the source designs show both or PROJECT.md requires both.
Verify the token layer can be consumed by all application screens.
Do not build every page yet.
Create a small token showcase or test surface if useful.
Run the application and verify that the token layer compiles.
```
## 11. Prompt 05: Build the Application Shell
MODEL: Claude Sonnet 4.6 Thinking
```text
Implement the reusable application shell shown by the Stitch student dashboard.
Create sidebar/navigation primitives.
Create top-level content container primitives.
Create mobile navigation behavior.
Create page-header primitives.
Create breadcrumbs where required.
Create command/search entry points.
Preserve the editorial technical visual language.
Do not implement feature-specific data yet.
Use placeholder slots only where the next prompts will provide real content.
Verify desktop, tablet, and mobile layouts.
```
## 12. Prompt 06: Implement Public Landing Page
MODEL: Claude Sonnet 4.6 Thinking
```text
Use plasmite_public_landing_page_editorial as the primary reference.
Use PROJECT.md for product messaging.
Implement the landing page as production code.
Use the real PLASMITE logo asset.
Implement navigation, hero, product preview, feature sections, trust/privacy messaging, FAQ, pricing if required by the current product phase, and footer only when supported by the source.
Do not invent testimonials or fake metrics.
Make calls to action route to real sign-in/sign-up pages.
Verify responsive behavior.
Compare the browser result against the Stitch reference.
```
## 13. Prompt 07: Implement Authentication
MODEL: Claude Sonnet 4.6 Thinking
```text
Use the Stitch sign-in and sign-up screens.
Implement real authentication using the project's selected auth provider.
Implement sign in.
Implement sign up.
Implement sign out.
Handle invalid credentials.
Handle duplicate accounts.
Handle session persistence.
Protect authenticated routes.
Do not expose secrets.
Preserve the editorial sign-in/sign-up design.
Verify a new account can authenticate and reach the intended setup flow.
```
## 14. Prompt 08: Implement Student Setup
MODEL: Claude Sonnet 4.6 Thinking
```text
Use the two Stitch setup screens as references.
Implement student profile setup.
Implement curriculum/semester setup.
Persist the setup to the real database.
Make the setup resumable.
Do not lose partially completed setup.
After setup, route the student to the dashboard.
If setup is already complete, do not show the setup wizard again unless explicitly requested.
Verify refresh behavior.
Verify sign-out/sign-in behavior.
Verify database persistence.
```
## 15. Prompt 09: Design the Database Schema
MODEL: Claude Opus 4.6 Thinking
```text
Read PROJECT.md and the existing application code.
Design the minimum production schema required for the current phase.
Include users/profiles, subjects, topics, notes, tags, labs, projects, questions, revision items, tasks, and any currently required supporting tables.
Avoid creating every future table if it is not needed now.
Use foreign keys.
Use timestamps.
Use indexes for expected search and filter paths.
Define ownership relationships clearly.
Define Row Level Security policies if Supabase is used.
Create migrations rather than manually editing production data.
Document the schema.
Do not build UI in this prompt.
Verify migrations on a clean database.
```
## 16. Prompt 10: Implement the Student Dashboard
MODEL: Claude Sonnet 4.6 Thinking
```text
Use plasmite_editorial_student_dashboard as the visual reference.
Replace static demo values with real authenticated data.
Implement welcome state.
Implement recent notes.
Implement subject overview.
Implement upcoming tasks where the current phase supports them.
Implement quick actions.
Implement meaningful empty states.
Do not fabricate activity.
Use skeleton loading where appropriate.
Verify that two different users cannot see each other's dashboard data.
```
## 17. Prompt 11: Implement Subjects and Syllabus Hub
MODEL: Claude Sonnet 4.6 Thinking
```text
Use plasmite_subjects_syllabus_hub as the primary reference.
Implement subject list.
Implement subject creation.
Implement subject editing.
Implement subject deletion with confirmation.
Implement subject detail.
Implement syllabus topics.
Implement topic status.
Implement progress calculation from real data.
Use the design reference for cards, tables, tabs, and hierarchy.
Verify persistence and ownership.
```
## 18. Prompt 12: Implement the Note Editor
MODEL: Claude Sonnet 4.6 Thinking
```text
Use plasmite_distraction_free_note_editor as the primary reference.
Implement a production note editor.
Support the minimum editor features required by PROJECT.md.
Support headings, lists, checklists, links, code blocks, callouts, and other explicitly required blocks.
Implement autosave safely.
Prevent accidental data loss.
Show save state.
Implement title editing.
Implement tags.
Implement favorite/pin behavior if present in the design.
Implement back navigation.
Verify refresh does not lose content.
Verify unsaved changes are handled safely.
```
## 19. Prompt 13: Implement Notes Library
MODEL: Claude Sonnet 4.6 Thinking
```text
Build the notes library around the existing note/editor design language.
Implement list/grid mode only if supported by the design.
Implement filters.
Implement tags.
Implement favorites.
Implement archive if required.
Implement sorting.
Implement pagination or efficient loading if needed.
Use real note data.
Provide useful empty states.
Make every item open the real note editor.
```
## 20. Prompt 14: Implement Universal Search and Command Palette
MODEL: Claude Sonnet 4.6 Thinking
```text
Use plasmite_command_palette_universal_search_overlay_cmd_k as the visual reference.
Implement Cmd/Ctrl+K.
Search across the currently implemented entities.
Start with database full-text or efficient server-side search appropriate to the stack.
Group results by type.
Show keyboard navigation.
Allow Enter to open a result.
Allow commands such as New Note and New Project.
Debounce input.
Handle no results.
Handle errors.
Verify keyboard-only operation.
```
## 21. Prompt 15: Implement Lab Experiment Records
MODEL: Claude Sonnet 4.6 Thinking
```text
Use plasmite_structured_lab_experiment_record_distance_vector_routing as the reference.
Implement lab record creation.
Implement experiment fields required by PROJECT.md.
Support code, procedure, observation, result, and viva sections where applicable.
Persist experiments.
Support editing.
Support completion state.
Keep long-form content readable.
Do not force every field to be filled before saving a draft.
Verify student ownership.
```
## 22. Prompt 16: Implement Projects Workspace
MODEL: Claude Sonnet 4.6 Thinking
```text
Use plasmite_project_workspace_detail_menu as the reference.
Implement project creation.
Implement project detail.
Implement project status.
Implement project tasks.
Implement milestones if included in the current phase.
Implement technology tags.
Implement project notes.
Implement project archive/delete behavior safely.
Keep the workspace visually aligned with the Stitch design.
Verify that project records persist.
```
## 23. Prompt 17: Implement Tasks and Academic Checklists
MODEL: Claude Sonnet 4.6 Thinking
```text
Use plasmite_tasks_academic_checklists_hub.
Implement task creation.
Implement editing.
Implement completion.
Implement due dates.
Implement priority if shown in the design.
Implement subject/project relationships.
Implement useful filtering.
Make dashboard upcoming items derive from the same task source.
Avoid duplicate task models.
```
## 24. Prompt 18: Implement Revision System
MODEL: Claude Sonnet 4.6 Thinking
```text
Use plasmite_revision_system_exam_deck.
Implement revision items linked to real notes/topics/questions.
Implement revision state.
Implement exam deck or focused revision view.
Implement important/weak topic indicators where supported.
Keep the UX calm rather than gamified.
Persist revision state.
Verify that revising an item updates the relevant source state.
```
## 25. Prompt 19: Implement Engineering Tools Hub
MODEL: Claude Sonnet 4.6 Thinking
```text
Use plasmite_engineering_tools_developer_utilities_hub.
Implement the tools explicitly required by the current phase.
Prefer client-side deterministic tools when possible.
Implement JSON formatting/validation only if included in scope.
Implement converters/calculators only when specified.
Keep tools isolated and testable.
Do not make a giant monolithic tools component.
Add unit tests for calculations and parsers.
```
## 26. Prompt 20: Implement Account, Storage, and Settings
MODEL: Claude Sonnet 4.6 Thinking
```text
Use plasmite_account_storage_data_management_settings.
Implement profile settings.
Implement account/session controls.
Implement storage usage view if supported.
Implement export entry point.
Implement safe account deletion flow if the backend supports it.
Clearly distinguish destructive actions.
Never expose secrets.
Verify settings persist.
```
## 27. Prompt 21: Implement Admin/Operator Console
MODEL: Claude Opus 4.6 Thinking
```text
Use the admin console DESIGN.md and operator dashboard reference.
Implement only the administrative capabilities explicitly required by the project.
Separate admin authorization from ordinary user authentication.
Never rely on hidden UI buttons as authorization.
Enforce authorization on the server/database layer.
Implement safe read-only operational views first.
Do not expose private student content beyond the intended administrative policy.
Audit every privileged query.
Verify an ordinary student cannot access admin routes.
```
## 28. Prompt 22: Implement Storage and Attachments
MODEL: Claude Sonnet 4.6 Thinking
```text
Implement file upload only after confirming the chosen storage provider.
Use the existing storage design reference.
Attach files to the appropriate parent entity.
Validate file type and size.
Generate safe filenames or storage keys.
Enforce user ownership.
Support deletion safely.
Do not store service credentials in the browser.
Show upload progress when practical.
Test failed uploads and retry behavior.
```
## 29. Prompt 23: Responsive and Mobile Pass
MODEL: Claude Sonnet 4.6 Thinking
```text
Audit every implemented screen at desktop, tablet, and mobile widths.
Compare against the Stitch screen references.
Fix overflow.
Fix inaccessible controls.
Fix editor behavior on narrow screens.
Implement mobile navigation.
Ensure dialogs fit small screens.
Ensure tables have a usable mobile representation.
Do not simply shrink desktop UI.
Test touch targets.
```
## 30. Prompt 24: Visual Fidelity Pass
MODEL: Claude Sonnet 4.6 Thinking
```text
Do not add new features.
Compare the live application against every relevant Stitch screenshot.
Audit typography.
Audit spacing.
Audit borders.
Audit surface hierarchy.
Audit navigation density.
Audit button dimensions.
Audit icon sizing.
Audit empty states.
Audit modal/dialog behavior.
Audit responsive behavior.
Fix the highest-impact visual differences first.
Preserve the existing PLASMITE identity.
```
## 31. Prompt 25: Accessibility Pass
MODEL: Claude Sonnet 4.6 Thinking
```text
Audit keyboard navigation.
Audit focus states.
Audit semantic headings.
Audit form labels.
Audit button names.
Audit dialog semantics.
Audit color contrast.
Audit reduced-motion behavior where applicable.
Audit screen-reader-friendly status messages.
Fix issues without changing the intended visual design.
```
## 32. Prompt 26: Data Integrity and Security Audit
MODEL: Claude Opus 4.6 Thinking
```text
Audit every user-owned table and query.
Verify authentication boundaries.
Verify authorization.
Verify Row Level Security if applicable.
Search for exposed secrets.
Search for unsafe client-side privileged operations.
Check upload security.
Check destructive actions.
Check route protection.
Check database constraints.
Check migrations.
Write a security findings report.
Fix critical and high-risk issues.
Do not make speculative security changes without explaining them.
```
## 33. Prompt 27: Testing Pass
MODEL: Claude Sonnet 4.6 Thinking
```text
Inspect the existing test setup.
Add focused unit tests for pure business logic.
Add integration tests for important data operations.
Add route/auth tests where practical.
Add end-to-end coverage for the critical user journey.
Critical journey:
sign up -> setup -> dashboard -> subject -> note -> save -> search -> sign out -> sign in -> reopen note.
Add lab and project smoke coverage if those features are in the current release.
Run the full test suite.
Fix failures caused by the implementation.
Report coverage honestly.
```
## 34. Prompt 28: Error Handling and Observability
MODEL: Claude Sonnet 4.6 Thinking
```text
Audit network failures.
Audit database failures.
Audit authentication failures.
Audit validation failures.
Audit upload failures.
Audit empty states.
Audit unexpected runtime errors.
Ensure users see useful messages.
Ensure developers can diagnose failures.
Do not expose sensitive server details to users.
Remove debug logging that leaks private data.
```
## 35. Prompt 29: Performance Pass
MODEL: Claude Sonnet 4.6 Thinking
```text
Measure rather than guess.
Audit initial bundle size.
Audit unnecessary rerenders.
Audit database query count.
Audit large images.
Audit editor initialization.
Audit search requests.
Audit attachment loading.
Use pagination or lazy loading where justified.
Do not introduce complexity without measured benefit.
```
## 36. Prompt 30: Production Readiness Audit
MODEL: Claude Opus 4.6 Thinking
```text
Act as the final principal engineer.
Read PROJECT.md, phase.md, implementation contract, and all relevant code.
Run the production build.
Run tests.
Inspect environment configuration.
Inspect database migrations.
Inspect authentication.
Inspect authorization.
Inspect critical routes.
Inspect the browser experience.
Check all major Stitch-derived screens.
Check responsive behavior.
Check console errors.
Check broken links.
Check missing assets.
Check loading/error/empty states.
Do not add speculative features.
Fix blockers that prevent a credible production release.
Produce a final release report with PASS, WARN, and BLOCKED items.
```
## 37. Prompt 31: Final Context Compression
MODEL: Claude Opus 4.6 Thinking
```text
Create docs/PLASMITE_CONTEXT.md.
Summarize the current architecture.
Summarize routes.
Summarize database tables.
Summarize important reusable components.
Summarize environment variables by name only, never values.
Summarize current feature status.
Summarize known limitations.
Summarize the next recommended implementation step.
Keep the document concise enough to paste into future agent sessions.
Do not include secrets.
Do not claim features are complete unless verified.
```
## 38. Prompt 32: Build a Handoff Packet for Another Agent
MODEL: Claude Sonnet 4.6 Thinking
```text
Create docs/PLASMITE_HANDOFF.md.
Include the current task state.
Include the exact commands required to start the project.
Include the exact test commands.
Include the exact routes implemented.
Include the database migration status.
Include known failing tests if any.
Include screenshots or browser verification notes if available.
Include the next five safe tasks.
Do not repeat the entire project specification.
```
## 39. How to Run the Prompts
- Start with Prompt 01 and use Claude Opus 4.6 Thinking.
- Do not ask the agent to code before reconnaissance is complete.
- Run Prompt 02 before significant implementation.
- Use Sonnet for most implementation prompts.
- Use Opus for architecture, security, complex data-model decisions, and final audit.
- Run one prompt at a time.
- After each prompt, inspect the diff.
- Run the application when the prompt changes UI or behavior.
- Do not stack five unverified prompts into one agent conversation.
- If a prompt produces a large unexpected refactor, stop and inspect before continuing.
- Commit stable milestones frequently.
## 40. Recommended Milestones
- **M0**: Recon | Prompts 01-03
- **M1**: Design foundation | Prompts 04-05
- **M2**: Public/auth foundation | Prompts 06-08
- **M3**: Data foundation | Prompt 09
- **M4**: Core notebook | Prompts 10-14
- **M5**: Student workflows | Prompts 15-20
- **M6**: Operations | Prompts 21-22
- **M7**: Quality | Prompts 23-29
- **M8**: Release | Prompts 30-32
## 41. What Not to Do
- Do not tell Antigravity: 'build the whole app from these screenshots'.
- Do not paste all 20 screenshots into one prompt and expect consistent architecture.
- Do not let the agent recreate the design from memory.
- Do not let each page invent its own buttons, cards, typography, or spacing.
- Do not let the agent replace the existing Stitch design with a generic Tailwind dashboard.
- Do not build future features before the current data model is stable.
- Do not use fake JSON files as permanent persistence.
- Do not keep demo data after real persistence is implemented.
- Do not hard-code the logged-in student.
- Do not put authorization only in the frontend.
- Do not expose Supabase service-role credentials.
- Do not delete migrations to fix a schema problem.
- Do not hide failing tests.
- Do not declare success because the page visually loads.
- Do not optimize before measuring.
## 42. Definition of Done for a Feature
- Requirement is traced to PROJECT.md, phase.md, or a specific Stitch source.
- Route exists.
- Component exists.
- Data model exists if needed.
- Create/read/update/delete behavior works where relevant.
- Authentication and ownership are enforced.
- Loading state exists.
- Empty state exists.
- Error state exists.
- Responsive behavior is checked.
- Accessibility basics are checked.
- Tests exist for important logic.
- Browser verification was performed.
- No unrelated regressions were introduced.
- Changed files are reported.
## 43. Suggested File Organization
```text
src/
  app/ or routes/
  components/
    ui/
    layout/
    notes/
    subjects/
    labs/
    projects/
    revision/
    tools/
  features/
  lib/
    auth/
    db/
    search/
    storage/
    validation/
  hooks/
  types/
  styles/
tests/
docs/
supabase/
  migrations/
```
## 44. Suggested Domain Boundaries
- Identity: profile, authentication, onboarding.
- Curriculum: subjects, topics, syllabus.
- Knowledge: notes, tags, attachments.
- Practice: questions, viva, revision.
- Practical: labs and experiments.
- Projects: projects, milestones, tasks.
- Academic planning: assignments, exams, checklists.
- Tools: calculators and developer utilities.
- Operations: admin/operator views.
- Platform: search, storage, settings, export.
## 45. Data Ownership Rules
- Every student-owned record must have a reliable ownership path.
- Prefer direct user_id ownership where it makes queries and policies clearer.
- Child records must be protected through their parent ownership relationship.
- Do not trust user_id values sent from the browser.
- Derive authenticated identity from the auth/session layer.
- Admin access must be explicitly authorized.
- Deletion must respect foreign keys and user expectations.
- Exports must include only the requesting user's data.
## 46. Search Strategy
- Search titles first.
- Search note/editorial content second.
- Search subject and topic names.
- Search project names.
- Search lab titles.
- Search questions.
- Return typed results.
- Rank exact title matches above broad content matches.
- Debounce interactive search.
- Never load an entire database into the browser just to search it.
## 47. UI Consistency Checklist
- Same page title treatment.
- Same primary button style.
- Same secondary button style.
- Same destructive action treatment.
- Same field labels.
- Same focus ring behavior.
- Same loading skeleton language.
- Same empty-state language.
- Same modal spacing.
- Same table density.
- Same mobile navigation behavior.
- Same icon sizing.
- Same typography hierarchy.
## 48. Browser Verification Checklist
- Open the route directly.
- Refresh the route.
- Resize the browser.
- Open keyboard shortcuts.
- Create data.
- Edit data.
- Delete data.
- Refresh after saving.
- Sign out.
- Sign back in.
- Verify data remains.
- Check browser console.
- Check network errors.
- Check empty state.
- Check validation state.
## 49. Prompt Template for Any Future Feature
```text
MODEL: Claude Sonnet 4.6 Thinking

You are working on PLASMITE.

Read PROJECT.md and phase.md before changing code.
Read the relevant Stitch source under stitch_plasmite_web_design_system/.
Inspect the current implementation before modifying it.

FEATURE:
[describe one feature]

SOURCE REFERENCES:
[list exact folders/files]

SCOPE:
[small bounded implementation scope]

DO NOT:
[list unrelated changes to avoid]

ACCEPTANCE CRITERIA:
1. [criterion]
2. [criterion]
3. [criterion]

VERIFICATION:
Run the relevant tests.
Run the application.
Verify the feature in the browser.
Check console errors.

HANDOFF:
Report changed files.
Report commands run.
Report tests.
Report browser verification.
Report unresolved issues.
```
## 50. Context Recovery Prompt
Use this when an agent appears to have forgotten the project context.
```text
Stop implementation temporarily.
You are working on PLASMITE, not a generic application.
Read PROJECT.md.
Read phase.md.
Read docs/PLASMITE_CONTEXT.md if it exists.
Inspect the current git diff.
Inspect the current route/component structure.
Inspect the relevant Stitch source.
Summarize the current architecture in 15 bullets.
Summarize the current task in 5 bullets.
Only then continue implementation.
Do not rewrite working code merely to re-establish context.
```
## 51. Recovery Prompt for a Bad Refactor
```text
A recent change appears to have caused unrelated regressions.
Do not continue adding features.
Inspect git diff and recent changes.
Identify the smallest change set responsible.
Run the existing tests before changing anything.
Revert only the problematic changes if safe.
Preserve unrelated work.
Restore the last known-good behavior.
Run tests again.
Report what was reverted and why.
```
## 52. Recovery Prompt for a Visual Regression
```text
The implementation has drifted from the Stitch design.
Do not redesign the product.
Open the relevant Stitch code.html and screen.png.
Inspect the live route.
Compare layout hierarchy, typography, spacing, borders, surfaces, controls, and responsive behavior.
Fix only the visual differences that are supported by the source.
Preserve working data behavior.
Verify at desktop and mobile widths.
```
## 53. Recovery Prompt for a Data Bug
```text
A data persistence bug has been reported.
Do not patch the UI with fake local state.
Reproduce the issue.
Inspect the request path.
Inspect validation.
Inspect database query/mutation.
Inspect authorization.
Inspect transaction/error handling.
Fix the root cause.
Add a regression test.
Verify the browser flow.
```
## 54. Recovery Prompt for an Auth Bug
```text
An authentication or authorization issue has been reported.
Do not bypass authentication to make the page load.
Reproduce the issue with a normal student account.
Check session restoration.
Check protected routes.
Check server/database authorization.
Check logout behavior.
Check cross-user access.
Fix the smallest root cause.
Add a regression test.
Never expose secrets.
```
## 55. Release Checklist
- Production build passes.
- Type checking passes.
- Linting passes.
- Unit tests pass.
- Integration tests pass.
- Critical end-to-end flow passes.
- Authentication works.
- Authorization works.
- Database migrations are reproducible.
- Storage rules are correct.
- No secrets are committed.
- No service-role credentials are client-visible.
- All major routes load.
- No obvious console errors.
- Mobile layout works.
- PLASMITE branding is correct.
- Logo asset is used correctly.
- Landing page works.
- Sign-up works.
- Sign-in works.
- Setup works.
- Dashboard works.
- Notes work.
- Subjects work.
- Search works.
- Labs work if released.
- Projects work if released.
- Revision works if released.
- Settings work.
- Export works if released.
## 56. Recommended Prompt Sequence
01. Prompt 01 | reconnaissance
02. Prompt 02 | reconnaissance
03. Prompt 03 | reconnaissance
04. Prompt 04 | foundation
05. Prompt 05 | foundation
06. Prompt 06 | public/auth
07. Prompt 07 | public/auth
08. Prompt 08 | public/auth
09. Prompt 09 | data
10. Prompt 10 | core notebook
11. Prompt 11 | core notebook
12. Prompt 12 | core notebook
13. Prompt 13 | core notebook
14. Prompt 14 | core notebook
15. Prompt 15 | student workflows
16. Prompt 16 | student workflows
17. Prompt 17 | student workflows
18. Prompt 18 | student workflows
19. Prompt 19 | student workflows
20. Prompt 20 | student workflows
21. Prompt 21 | operations
22. Prompt 22 | operations
23. Prompt 23 | quality
24. Prompt 24 | quality
25. Prompt 25 | quality
26. Prompt 26 | quality
27. Prompt 27 | quality
28. Prompt 28 | quality
29. Prompt 29 | quality
30. Prompt 30 | release/handoff
31. Prompt 31 | release/handoff
32. Prompt 32 | release/handoff
## 57. Agent Behavior: Small Batches
The purpose of the sequence is to keep each agent turn understandable. A good implementation turn should answer one engineering question and leave the repository in a testable state.
- One prompt should ideally create one coherent milestone.
- One prompt should not simultaneously redesign UI, change the database, and rewrite authentication.
- If a prompt discovers a prerequisite, document it and stop at the boundary.
- Use the next prompt for the prerequisite rather than silently expanding scope.
- Prefer ten verified changes over one giant unverified change.
## 58. Agent Behavior: Use the Browser as a Verification Surface
- A screenshot is not proof of functionality.
- A route loading is not proof of persistence.
- A button appearing is not proof of its action.
- A successful mutation must survive refresh.
- A user-specific screen must be checked with more than one identity when security matters.
- Responsive behavior must be checked at real viewport sizes.
- The agent should use Antigravity's browser capabilities where available for UI verification.
## 59. Agent Behavior: Preserve Stitch Intent
- Stitch gives you visual intent.
- PROJECT.md gives you product intent.
- The working application gives you implementation truth.
- Translate rather than blindly copy.
- Extract repeated patterns into components.
- Use the source screenshot to validate proportions.
- Use the source HTML to understand intended structure.
- Use DESIGN.md to understand editorial and technical direction.
## 60. Agent Behavior: No Context Loss
- Never rely exclusively on conversation history.
- Keep durable context in docs/PLASMITE_CONTEXT.md.
- Keep product requirements in PROJECT.md.
- Keep sequencing in phase.md.
- Keep design references in stitch_plasmite_web_design_system/.
- Keep architectural decisions documented.
- Keep migrations in version control.
- Keep tests close to the code they validate.
- Keep every handoff factual.
## 61. Suggested Architecture Decision Record Format
```text
# ADR-XXX: Decision title

## Context
What problem are we solving?

## Decision
What are we choosing?

## Alternatives
What else was considered?

## Consequences
What becomes easier or harder?

## Verification
How will we know this works?
```
## 62. Suggested Feature Record Format
```text
# Feature: [name]

Source:
- PROJECT.md: [section]
- Stitch: [folder]

Route:
- [route]

Data:
- [tables]

Components:
- [components]

Acceptance:
- [criteria]

Verification:
- [commands]
- [browser flow]
```
## 63. Suggested Commit Strategy
- feat: establish PLASMITE design tokens
- feat: add application shell
- feat: add authentication
- feat: add onboarding
- feat: add subjects
- feat: add notes
- feat: add search
- feat: add labs
- feat: add projects
- feat: add revision
- fix: correct note autosave
- fix: enforce ownership policy
- test: add critical student journey
- refactor: extract shared editor primitives
## 64. What Counts as Context
- Product requirements.
- Current code.
- Database schema.
- Migrations.
- Design references.
- Routes.
- Environment variable names.
- Known bugs.
- Test results.
- Current milestone.
- Last verified behavior.
## 65. What Does Not Count as Reliable Context
- Agent memory from a previous conversation.
- An old screenshot after the UI has changed.
- A README that contradicts the current code.
- A TODO that was never implemented.
- A comment that describes a removed feature.
- A demo value that looks real.
- An unverified assumption about the database.
## 66. Final Instruction to Every Antigravity Agent
```text
Build carefully.
Read first.
Change only what is needed.
Use the PLASMITE sources.
Preserve the design.
Preserve working behavior.
Use real persistence.
Enforce authorization.
Test the result.
Verify it in the browser.
Report facts, not assumptions.
Leave the repository healthier than you found it.
```
## 67. Micro-Prompt Library
### Micro-Prompt 1: UI component extraction
```text
MODEL: Claude Sonnet 4.6 Thinking

You are working on PLASMITE.
Read PROJECT.md and inspect the current implementation before changing anything.
Extract the repeated UI pattern from the current screens into a reusable component without changing behavior.
Keep the change bounded.
Do not redesign unrelated screens.
Run the relevant tests.
Verify the result in the browser when UI behavior is affected.
Report changed files, verification, and remaining risks.
```
### Micro-Prompt 2: Form validation
```text
MODEL: Claude Sonnet 4.6 Thinking

You are working on PLASMITE.
Read PROJECT.md and inspect the current implementation before changing anything.
Add schema-based validation to this form, preserve current visuals, show accessible errors, and add tests.
Keep the change bounded.
Do not redesign unrelated screens.
Run the relevant tests.
Verify the result in the browser when UI behavior is affected.
Report changed files, verification, and remaining risks.
```
### Micro-Prompt 3: Loading state
```text
MODEL: Claude Sonnet 4.6 Thinking

You are working on PLASMITE.
Read PROJECT.md and inspect the current implementation before changing anything.
Replace the current blank/loading behavior with a source-aligned loading state and verify it does not hide errors.
Keep the change bounded.
Do not redesign unrelated screens.
Run the relevant tests.
Verify the result in the browser when UI behavior is affected.
Report changed files, verification, and remaining risks.
```
### Micro-Prompt 4: Empty state
```text
MODEL: Claude Sonnet 4.6 Thinking

You are working on PLASMITE.
Read PROJECT.md and inspect the current implementation before changing anything.
Design and implement an intentional empty state using the PLASMITE visual language and a clear next action.
Keep the change bounded.
Do not redesign unrelated screens.
Run the relevant tests.
Verify the result in the browser when UI behavior is affected.
Report changed files, verification, and remaining risks.
```
### Micro-Prompt 5: Delete confirmation
```text
MODEL: Claude Sonnet 4.6 Thinking

You are working on PLASMITE.
Read PROJECT.md and inspect the current implementation before changing anything.
Implement a safe destructive confirmation flow with cancellation, loading, error handling, and refresh verification.
Keep the change bounded.
Do not redesign unrelated screens.
Run the relevant tests.
Verify the result in the browser when UI behavior is affected.
Report changed files, verification, and remaining risks.
```
### Micro-Prompt 6: Pagination
```text
MODEL: Claude Sonnet 4.6 Thinking

You are working on PLASMITE.
Read PROJECT.md and inspect the current implementation before changing anything.
Add efficient pagination only if current data volume requires it; keep the API and UI simple.
Keep the change bounded.
Do not redesign unrelated screens.
Run the relevant tests.
Verify the result in the browser when UI behavior is affected.
Report changed files, verification, and remaining risks.
```
### Micro-Prompt 7: Filter
```text
MODEL: Claude Sonnet 4.6 Thinking

You are working on PLASMITE.
Read PROJECT.md and inspect the current implementation before changing anything.
Add one filter to the current list using existing data fields; do not redesign the page.
Keep the change bounded.
Do not redesign unrelated screens.
Run the relevant tests.
Verify the result in the browser when UI behavior is affected.
Report changed files, verification, and remaining risks.
```
### Micro-Prompt 8: Sort
```text
MODEL: Claude Sonnet 4.6 Thinking

You are working on PLASMITE.
Read PROJECT.md and inspect the current implementation before changing anything.
Add deterministic sorting with a stable default and preserve URL or local state only if already used by the app.
Keep the change bounded.
Do not redesign unrelated screens.
Run the relevant tests.
Verify the result in the browser when UI behavior is affected.
Report changed files, verification, and remaining risks.
```
### Micro-Prompt 9: Keyboard shortcut
```text
MODEL: Claude Sonnet 4.6 Thinking

You are working on PLASMITE.
Read PROJECT.md and inspect the current implementation before changing anything.
Add this keyboard shortcut without breaking text input behavior or accessibility.
Keep the change bounded.
Do not redesign unrelated screens.
Run the relevant tests.
Verify the result in the browser when UI behavior is affected.
Report changed files, verification, and remaining risks.
```
### Micro-Prompt 10: Toast
```text
MODEL: Claude Sonnet 4.6 Thinking

You are working on PLASMITE.
Read PROJECT.md and inspect the current implementation before changing anything.
Add a concise success/error notification using the existing notification system or create one shared primitive.
Keep the change bounded.
Do not redesign unrelated screens.
Run the relevant tests.
Verify the result in the browser when UI behavior is affected.
Report changed files, verification, and remaining risks.
```
### Micro-Prompt 11: Modal
```text
MODEL: Claude Sonnet 4.6 Thinking

You are working on PLASMITE.
Read PROJECT.md and inspect the current implementation before changing anything.
Implement a reusable accessible modal matching the existing design system.
Keep the change bounded.
Do not redesign unrelated screens.
Run the relevant tests.
Verify the result in the browser when UI behavior is affected.
Report changed files, verification, and remaining risks.
```
### Micro-Prompt 12: Drawer
```text
MODEL: Claude Sonnet 4.6 Thinking

You are working on PLASMITE.
Read PROJECT.md and inspect the current implementation before changing anything.
Implement a responsive drawer for this mobile interaction using the existing shell.
Keep the change bounded.
Do not redesign unrelated screens.
Run the relevant tests.
Verify the result in the browser when UI behavior is affected.
Report changed files, verification, and remaining risks.
```
### Micro-Prompt 13: Server query
```text
MODEL: Claude Sonnet 4.6 Thinking

You are working on PLASMITE.
Read PROJECT.md and inspect the current implementation before changing anything.
Move this data query to the appropriate trusted layer and keep the browser API minimal.
Keep the change bounded.
Do not redesign unrelated screens.
Run the relevant tests.
Verify the result in the browser when UI behavior is affected.
Report changed files, verification, and remaining risks.
```
### Micro-Prompt 14: Mutation
```text
MODEL: Claude Sonnet 4.6 Thinking

You are working on PLASMITE.
Read PROJECT.md and inspect the current implementation before changing anything.
Implement this mutation with validation, authorization, error handling, and a regression test.
Keep the change bounded.
Do not redesign unrelated screens.
Run the relevant tests.
Verify the result in the browser when UI behavior is affected.
Report changed files, verification, and remaining risks.
```
### Micro-Prompt 15: Migration
```text
MODEL: Claude Sonnet 4.6 Thinking

You are working on PLASMITE.
Read PROJECT.md and inspect the current implementation before changing anything.
Create a reversible or safely forward-compatible database migration and verify it on a clean database.
Keep the change bounded.
Do not redesign unrelated screens.
Run the relevant tests.
Verify the result in the browser when UI behavior is affected.
Report changed files, verification, and remaining risks.
```
### Micro-Prompt 16: RLS
```text
MODEL: Claude Sonnet 4.6 Thinking

You are working on PLASMITE.
Read PROJECT.md and inspect the current implementation before changing anything.
Review this table's Row Level Security and prove that one user cannot access another user's rows.
Keep the change bounded.
Do not redesign unrelated screens.
Run the relevant tests.
Verify the result in the browser when UI behavior is affected.
Report changed files, verification, and remaining risks.
```
### Micro-Prompt 17: Search ranking
```text
MODEL: Claude Sonnet 4.6 Thinking

You are working on PLASMITE.
Read PROJECT.md and inspect the current implementation before changing anything.
Improve search relevance without loading the full dataset into the browser.
Keep the change bounded.
Do not redesign unrelated screens.
Run the relevant tests.
Verify the result in the browser when UI behavior is affected.
Report changed files, verification, and remaining risks.
```
### Micro-Prompt 18: Editor block
```text
MODEL: Claude Sonnet 4.6 Thinking

You are working on PLASMITE.
Read PROJECT.md and inspect the current implementation before changing anything.
Add this editor block as a reusable, serializable component and verify save/reload behavior.
Keep the change bounded.
Do not redesign unrelated screens.
Run the relevant tests.
Verify the result in the browser when UI behavior is affected.
Report changed files, verification, and remaining risks.
```
### Micro-Prompt 19: Attachment
```text
MODEL: Claude Sonnet 4.6 Thinking

You are working on PLASMITE.
Read PROJECT.md and inspect the current implementation before changing anything.
Attach this uploaded file to the correct entity with ownership checks and safe cleanup.
Keep the change bounded.
Do not redesign unrelated screens.
Run the relevant tests.
Verify the result in the browser when UI behavior is affected.
Report changed files, verification, and remaining risks.
```
### Micro-Prompt 20: Export
```text
MODEL: Claude Sonnet 4.6 Thinking

You are working on PLASMITE.
Read PROJECT.md and inspect the current implementation before changing anything.
Export this entity using the existing export architecture without leaking unrelated user data.
Keep the change bounded.
Do not redesign unrelated screens.
Run the relevant tests.
Verify the result in the browser when UI behavior is affected.
Report changed files, verification, and remaining risks.
```
### Micro-Prompt 21: Dark mode
```text
MODEL: Claude Sonnet 4.6 Thinking

You are working on PLASMITE.
Read PROJECT.md and inspect the current implementation before changing anything.
Correct dark-mode surfaces and contrast using existing tokens rather than introducing new colors.
Keep the change bounded.
Do not redesign unrelated screens.
Run the relevant tests.
Verify the result in the browser when UI behavior is affected.
Report changed files, verification, and remaining risks.
```
### Micro-Prompt 22: Mobile
```text
MODEL: Claude Sonnet 4.6 Thinking

You are working on PLASMITE.
Read PROJECT.md and inspect the current implementation before changing anything.
Fix the current mobile layout at 390px and 768px without changing desktop structure.
Keep the change bounded.
Do not redesign unrelated screens.
Run the relevant tests.
Verify the result in the browser when UI behavior is affected.
Report changed files, verification, and remaining risks.
```
### Micro-Prompt 23: Accessibility
```text
MODEL: Claude Sonnet 4.6 Thinking

You are working on PLASMITE.
Read PROJECT.md and inspect the current implementation before changing anything.
Audit this screen for keyboard, focus, labels, semantics, and contrast, then fix the highest-impact issues.
Keep the change bounded.
Do not redesign unrelated screens.
Run the relevant tests.
Verify the result in the browser when UI behavior is affected.
Report changed files, verification, and remaining risks.
```
### Micro-Prompt 24: Performance
```text
MODEL: Claude Sonnet 4.6 Thinking

You are working on PLASMITE.
Read PROJECT.md and inspect the current implementation before changing anything.
Profile this screen before optimizing and fix only measured bottlenecks.
Keep the change bounded.
Do not redesign unrelated screens.
Run the relevant tests.
Verify the result in the browser when UI behavior is affected.
Report changed files, verification, and remaining risks.
```
### Micro-Prompt 25: Regression
```text
MODEL: Claude Sonnet 4.6 Thinking

You are working on PLASMITE.
Read PROJECT.md and inspect the current implementation before changing anything.
Reproduce this bug, add a regression test, fix the root cause, and verify the original flow.
Keep the change bounded.
Do not redesign unrelated screens.
Run the relevant tests.
Verify the result in the browser when UI behavior is affected.
Report changed files, verification, and remaining risks.
```
### Micro-Prompt 26: Refactor
```text
MODEL: Claude Sonnet 4.6 Thinking

You are working on PLASMITE.
Read PROJECT.md and inspect the current implementation before changing anything.
Refactor only the named component boundary, preserve behavior, and run the existing tests.
Keep the change bounded.
Do not redesign unrelated screens.
Run the relevant tests.
Verify the result in the browser when UI behavior is affected.
Report changed files, verification, and remaining risks.
```
### Micro-Prompt 27: Documentation
```text
MODEL: Claude Sonnet 4.6 Thinking

You are working on PLASMITE.
Read PROJECT.md and inspect the current implementation before changing anything.
Document this feature in a concise developer-facing file without duplicating PROJECT.md.
Keep the change bounded.
Do not redesign unrelated screens.
Run the relevant tests.
Verify the result in the browser when UI behavior is affected.
Report changed files, verification, and remaining risks.
```
### Micro-Prompt 28: Handoff
```text
MODEL: Claude Sonnet 4.6 Thinking

You are working on PLASMITE.
Read PROJECT.md and inspect the current implementation before changing anything.
Create a factual handoff note describing current state, verification, and next action.
Keep the change bounded.
Do not redesign unrelated screens.
Run the relevant tests.
Verify the result in the browser when UI behavior is affected.
Report changed files, verification, and remaining risks.
```
## 68. 1000-Line Planning Rule
This document is deliberately long because it is intended to be a durable build playbook, not a single mega-prompt. The individual prompts are the execution units. The surrounding sections are the context-preservation layer.
- Do not paste the entire document into every agent turn if the agent can read the file from the repository.
- Tell the agent which prompt number it is executing.
- Tell it to read only the relevant source artifacts plus the persistent context file.
- Keep the active task small.
- Keep the project context on disk.
- Keep verification explicit.
- Keep handoffs factual.
