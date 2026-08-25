import type { Href } from 'expo-router';

/**
 * `expo-router`'s typed-routes generator does not emit a union member for
 * `customers/[id]/index.tsx` (a dynamic segment whose only child is an
 * index route) even though the route itself resolves, bundles and renders
 * correctly — same gap confirmed for Categories (Phase 3.1) and Suppliers
 * (Phase 3.2). This isolates the one necessary type escape.
 */
export function customerDetailHref(id: string): Href {
  return { pathname: '/(app)/customers/[id]', params: { id } } as unknown as Href;
}

/**
 * The bare `/(app)/customers` path (which resolves to `customers/index.tsx`)
 * is likewise missing from the typed-routes union. Do NOT substitute the
 * typed-but-wrong literal `/(app)/customers/index` — at runtime that string
 * is parsed as segments `["customers", "index"]`, which matches the sibling
 * dynamic route `customers/[id]/index.tsx` with `id = "index"` instead of
 * the list screen.
 */
export function customersListHref(): Href {
  return { pathname: '/(app)/customers' } as unknown as Href;
}
