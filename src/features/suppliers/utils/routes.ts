import type { Href } from 'expo-router';

/**
 * `expo-router`'s typed-routes generator does not emit a union member for
 * `suppliers/[id]/index.tsx` (a dynamic segment whose only child is an
 * index route) even though the route itself resolves, bundles and renders
 * correctly — same gap confirmed for the Categories module in Phase 3.1.
 * This isolates the one necessary type escape.
 */
export function supplierDetailHref(id: string): Href {
  return { pathname: '/(app)/suppliers/[id]', params: { id } } as unknown as Href;
}

/**
 * The bare `/(app)/suppliers` path (which resolves to `suppliers/index.tsx`)
 * is likewise missing from the typed-routes union. Do NOT substitute the
 * typed-but-wrong literal `/(app)/suppliers/index` — at runtime that string
 * is parsed as segments `["suppliers", "index"]`, which matches the sibling
 * dynamic route `suppliers/[id]/index.tsx` with `id = "index"` instead of
 * the list screen (see Categories module, Phase 3.1, for the same bug).
 */
export function suppliersListHref(): Href {
  return { pathname: '/(app)/suppliers' } as unknown as Href;
}
