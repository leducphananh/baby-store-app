import type { Href } from 'expo-router';

/**
 * `expo-router`'s typed-routes generator does not emit a union member for
 * `products/[id]/index.tsx` (a dynamic segment whose only child is an index
 * route) even though the route itself resolves, bundles and renders
 * correctly — same gap confirmed for Categories, Suppliers and Customers.
 * This isolates the one necessary type escape.
 */
export function productDetailHref(id: string): Href {
  return { pathname: '/(app)/products/[id]', params: { id } } as unknown as Href;
}

/**
 * The bare `/(app)/products` path (which resolves to `products/index.tsx`)
 * is likewise missing from the typed-routes union. Do NOT substitute the
 * typed-but-wrong literal `/(app)/products/index` — at runtime that string
 * is parsed as segments `["products", "index"]`, which matches the sibling
 * dynamic route `products/[id]/index.tsx` with `id = "index"` instead of
 * the list screen.
 */
export function productsListHref(): Href {
  return { pathname: '/(app)/products' } as unknown as Href;
}
