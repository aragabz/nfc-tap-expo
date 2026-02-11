# Tasks: Mobile App Foundation

## Implementation Strategy
- **MVP First**: Prioritize User Story 1 (Onboarding + Login) to establish the core app flow.
- **Incremental Delivery**: Deliver Onboarding, then Authentication, then the Profile tab.
- **Independent Testing**: Each phase ends with a verification step that can be performed independently.

## Phase 1: Setup
Initial configuration and project structure setup.

- [x] T001 Create core directory structure for auth and tabs in `src/app/`
- [x] T002 Configure Expo scheme and plugins in `app.json` for `expo-auth-session`
- [x] T003 Install missing dependencies: `npx expo install expo-auth-session expo-secure-store expo-crypto expo-web-browser`
- [x] T004 Define core TypeScript types in `src/types/auth.ts` based on `internal-schema.ts`

## Phase 2: Foundational
Global state and service abstractions required by all stories.

- [x] T005 [P] Implement `StorageService` in `src/services/storage.ts` using `AsyncStorage` and `SecureStore`
- [x] T006 [P] Implement `AuthService` abstraction in `src/services/auth.ts` for Azure AD SSO logic
- [x] T007 Create `AuthContext` and `AuthProvider` in `src/hooks/use-auth.tsx` to manage global session state
- [x] T008 Implement `useOnboarding` hook in `src/hooks/use-onboarding.ts` to manage flow state
- [x] T009 [P] Write unit tests for `StorageService` in `src/services/__tests__/storage.test.ts`

## Phase 3: User Story 1 - First Time Onboarding and Login (Priority: P1)
**Goal**: New users can swipe through onboarding and sign in via Azure AD.
**Independent Test**: Launch fresh app -> Complete onboarding -> Sign in -> Reach Home tab.

- [x] T010 [P] [US1] Create `OnboardingScreen` component in `src/components/onboarding/onboarding-screen.tsx`
- [x] T011 [US1] Implement swipeable onboarding flow in `src/app/(auth)/onboarding.tsx` using `FlatList` and `Reanimated`
- [x] T012 [P] [US1] Create `LoginScreen` UI in `src/app/(auth)/login.tsx` with "Sign in with Microsoft" button
- [x] T013 [US1] Integrate `AuthService.signIn()` with the login button in `src/app/(auth)/login.tsx`
- [x] T014 [US1] Implement root `_layout.tsx` in `src/app/_layout.tsx` to handle conditional routing based on auth/onboarding state

## Phase 4: User Story 2 - Returning User Authentication (Priority: P1)
**Goal**: Existing users skip onboarding and go directly to login or home.
**Independent Test**: Complete onboarding -> Close app -> Re-launch -> Verify landing on Login screen (if not signed in).

- [x] T015 [US2] Update `src/app/_layout.tsx` to check `isCompleted` flag and `isAuthenticated` state on startup
- [x] T016 [US2] Implement splash screen handling to prevent UI flicker during state hydration in `src/app/_layout.tsx`

## Phase 5: User Story 3 - Profile Management and Logout (Priority: P2)
**Goal**: Authenticated users can see their info and sign out.
**Independent Test**: Go to Profile tab -> Verify data -> Tap Logout -> Verify return to Login.

- [x] T017 [P] [US3] Create `ProfileCard` component in `src/components/profile/profile-card.tsx`
- [x] T018 [US3] Implement Profile screen in `src/app/(tabs)/profile.tsx` to display `UserProfile` data
- [x] T019 [US3] Implement Logout button in `src/app/(tabs)/profile.tsx` that calls `AuthService.signOut()`
- [x] T020 [P] [US3] Add "App Version" info section in `src/app/(tabs)/profile.tsx`

## Phase 6: Polish
Final refinements and cross-cutting concerns.

- [x] T021 [P] Implement loading states for authentication transitions in `src/components/ui/loading-overlay.tsx`
- [x] T022 [P] Add error boundary and user-friendly error alerts for auth failures
- [x] T023 Final accessibility pass (aria-labels, contrast) on onboarding and profile screens
- [x] T024 Performance check: Ensure onboarding animations maintain 60fps

## Dependencies
- **Phase 2** depends on **Phase 1**
- **Phase 3 (US1)** depends on **Phase 2**
- **Phase 4 (US2)** depends on **Phase 3**
- **Phase 5 (US3)** depends on **Phase 3**

## Parallel Execution Examples
- **US1**: T010 (Onboarding UI) and T012 (Login UI) can be developed in parallel.
- **US3**: T017 (Profile Card) can be developed independently of the main Profile screen T018.
- **Services**: T005 (Storage) and T006 (Auth) can be developed in parallel.
