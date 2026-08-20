---
name: react-native-validation
description: Validates React Native Expo changes before considering a task complete. Use after implementing or modifying routes, components, hooks, stores, providers, services, imports, authentication, navigation, or project configuration.
---

# React Native Validation

A React Native task is NOT complete until actual validation has been performed.

## Mandatory validation

After changing application code, inspect and validate:

1. TypeScript
2. ESLint
3. Expo configuration
4. imports
5. Metro bundling
6. Expo Router
7. runtime startup

Never mark a task complete based only on file creation.

## TypeScript

Run:

```bash
npx tsc --noEmit
```
