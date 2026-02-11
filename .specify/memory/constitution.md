# digital-business-cards Constitution

<!--
SYNC IMPACT REPORT
Version: 1.0.0 (Initial Ratification)
Modified Principles:
- Added: I. Code Quality & Standards
- Added: II. Testing Strategy
- Added: III. UX & Design Consistency
- Added: IV. Performance & Efficiency
Added Sections:
- Technology Stack
- Development Workflow
Templates Status:
- plan-template.md: ✅ Compatible
- spec-template.md: ✅ Compatible
- tasks-template.md: ✅ Compatible
-->

## Core Principles

### I. Code Quality & Standards

Code must be strictly typed (TypeScript), linted (ESLint), and formatted (Prettier). All code should be readable, maintainable, and prefer clarity over cleverness. No `any` types unless absolutely necessary and documented. Comments should explain "why", not "what".

### II. Testing Strategy

Unit tests are mandatory for business logic, utilities, and complex hooks. Critical user paths must be covered by integration tests. Tests must be deterministic and run in CI. Focus on testing behavior (what the user sees/does), not implementation details.

### III. UX & Design Consistency

The application must provide a native-like feel. Adhere to platform-specific guidelines (iOS HIG, Android Material Design) where appropriate. UI must be responsive, accessible (a11y), and handle edge cases (loading, error, offline) gracefully. Visual hierarchy and theming must remain consistent across screens.

### IV. Performance & Efficiency

Maintain 60fps for animations and interactions. Optimize bundle size and startup time. Network operations must be efficient, minimizing data usage and handling latency. Avoid unnecessary re-renders by using React.memo and stable callbacks appropriately.

## Technology Stack

**Framework**: React Native (via Expo)
**Language**: TypeScript
**Navigation**: React Navigation (File-based routing via Expo Router)
**Styling**: Standard StyleSheet or Expo-compatible styling solutions.
**State**: Local state preferred; Global state (e.g., Context, Zustand) only when shared across distinct features.

## Development Workflow

1.  **Feature Branches**: Use `feat/description` or `fix/issue`.
2.  **Pull Requests**: Must pass CI (Lint + Test) and require at least one peer review.
3.  **Commits**: Follow Semantic Commit Messages (feat, fix, docs, style, refactor, test, chore).
4.  **Documentation**: Keep README and Spec files updated with code changes.

## Governance

This constitution serves as the primary source of truth for engineering standards.

- **Amendments**: Require a Pull Request with justification and team approval.
- **Enforcement**: Code reviews and CI pipelines must verify compliance with these principles.
- **Versioning**: Follows Semantic Versioning. Major changes to principles require a Major version bump.

**Version**: 1.0.0 | **Ratified**: 2026-02-02 | **Last Amended**: 2026-02-02
