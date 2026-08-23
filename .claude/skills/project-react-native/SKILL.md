---
name: project-react-native
description: Defines architecture and coding conventions for this React Native Expo TypeScript application. Use when creating or modifying screens, components, hooks, API integrations, forms, navigation, state management, or application features.
---

# React Native Project Guidelines

## Stack

Use:

- React Native
- Expo
- TypeScript
- Expo Router
- Zustand
- TanStack Query
- React Hook Form
- Zod

Do not introduce alternative libraries unless there is a clear technical reason.

## TypeScript

Use strict TypeScript.

Avoid:

- `any`
- unsafe type assertions
- duplicated interfaces
- implicit nullable values

Prefer explicit types.

## Architecture

Use feature-based architecture.

Recommended structure:

src/
├── components/
│ ├── common/
│ └── ui/
├── features/
│ ├── auth/
│ │ ├── api/
│ │ ├── components/
│ │ ├── hooks/
│ │ ├── schemas/
│ │ ├── types/
│ │ └── utils/
│ └── products/
├── hooks/
├── services/
├── stores/
├── constants/
├── types/
└── utils/

Feature-specific code should stay inside:

src/features/<feature>

## Components

Use functional components.

Prefer:

type Props = {
title: string;
onPress: () => void;
};

export function Button({ title, onPress }: Props) {
return (...);
}

Avoid `React.FC` unless required by existing project conventions.

Components should have one clear responsibility.

## Screens

Screens should mainly compose:

- UI components
- hooks
- navigation
- loading state
- error state
- empty state

Do not put complex business logic directly inside screens.

## API

Never call `fetch` or `axios` directly inside UI components.

Use:

Screen
↓
Hook / TanStack Query
↓
API Module
↓
HTTP Client

Example:

features/products/
├── api/
│ ├── get-products.ts
│ └── create-product.ts
├── hooks/
│ └── use-products.ts
└── types/
└── product.ts

## Server State

Use TanStack Query for:

- API data
- caching
- pagination
- mutations
- refetching
- loading state
- server errors

Do not duplicate TanStack Query state into Zustand.

## Zustand

Use Zustand only for shared client state.

Examples:

- authentication
- cart
- app settings
- cross-screen workflow state

Prefer selectors:

const user = useAuthStore(state => state.user);

Avoid:

const store = useAuthStore();

when only one property is needed.

## Forms

Use:

React Hook Form

- Zod

Keep validation schemas in:

schemas/

## Navigation

Use Expo Router.

Keep routing files inside:

app/

Route files should remain lightweight.

Prefer:

export default function ProductRoute() {
return <ProductScreen />;
}

Business logic belongs in `src/features`.

## Lists

Use FlatList or FlashList for large collections.

Avoid:

<ScrollView>
  {items.map(...)}
</ScrollView>

for large datasets.

Always use stable keys.

## Performance

Do not automatically add:

- useMemo
- useCallback
- React.memo

Only use them when reference stability or rendering performance actually requires them.

When investigating performance problems, apply the `react-native-best-practices` skill.

## Security

Do not store sensitive tokens in AsyncStorage.

Use secure storage such as Expo SecureStore when appropriate.

Never put secrets inside `EXPO_PUBLIC_*` environment variables.

## Platform Differences

Always consider differences between Android and iOS for:

- keyboard
- permissions
- safe area
- notifications
- file system
- shadows
- deep links
- status bar

## Before Coding

Before creating new code:

1. Inspect existing architecture.
2. Search for reusable components.
3. Search for existing hooks.
4. Search for existing API modules.
5. Search for existing types.
6. Inspect installed dependencies.
7. Follow existing naming conventions.

Avoid duplicate infrastructure.

## After Coding

Validate:

1. TypeScript
2. ESLint
3. imports
4. loading states
5. error states
6. empty states
7. Android behavior
8. iOS behavior
9. unnecessary re-renders
10. duplicated logic

## Definition of Done

Before considering any implementation task complete, apply the
`react-native-validation` skill.

A task is not complete merely because files were created or code was written.

The implementation must pass actual TypeScript, lint, Expo, import, bundling,
routing and relevant runtime validation.
