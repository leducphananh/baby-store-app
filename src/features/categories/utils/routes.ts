import type { Href } from 'expo-router';

/**
 * `expo-router`'s typed-routes generator does not emit a union member for
 * `categories/[id]/index.tsx` (a dynamic segment whose only child is an
 * index route) even though the route itself resolves, bundles and renders
 * correctly — confirmed via `expo export`. This isolates the one
 * necessary type escape so it does not need to be repeated at every call
 * site that links to a category's detail screen.
 */
export function categoryDetailHref(id: string): Href {
  return { pathname: '/(app)/categories/[id]', params: { id } } as unknown as Href;
}

/**
 * The bare `/(app)/categories` path (which resolves to `categories/index.tsx`)
 * is likewise missing from the typed-routes union. Do NOT substitute the
 * typed-but-wrong literal `/(app)/categories/index` here: at runtime that
 * string is parsed as segments `["categories", "index"]`, which actually
 * matches the sibling dynamic route `categories/[id]/index.tsx` with
 * `id = "index"` instead of the list screen — it fetches a category whose
 * id is the literal string "index", fails, and surfaces a generic error.
 */
export function categoriesListHref(): Href {
  return { pathname: '/(app)/categories' } as unknown as Href;
}
