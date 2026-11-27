"use client";

/**
 * The pages visited within the site during this visit, in order, so a page can tell where the
 * visitor came from (e.g. a gallery's BACK can return to the exact spot in the portfolio grid
 * instead of reloading it at the top). Kept by SmoothScroll as the route changes.
 */
const stack: string[] = [];

/** Records a route change: a new page, or a step back through browser history. */
export function recordVisit(pathname: string, cameBack: boolean) {
  if (cameBack) {
    const at = stack.lastIndexOf(pathname);
    if (at >= 0) {
      stack.length = at + 1;
      return;
    }
  }
  if (stack[stack.length - 1] !== pathname) stack.push(pathname);
}

/** The page before this one within the site, or null when the visit started here. */
export function previousPathname() {
  return stack.length > 1 ? stack[stack.length - 2] : null;
}
