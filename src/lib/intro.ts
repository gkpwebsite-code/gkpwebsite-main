/**
 * Runs before paint. The full opening intro (rolling name, counter, photos rising) belongs to
 * the portfolio grid only: a visit that starts anywhere else, such as a reloaded or shared
 * gallery, contact or testimonials page, skips straight to "done", so that page's own short
 * entrance plays at once with the name already resting in its corner. A gallery opened this
 * way is also flagged (data-gallery-flip) for its flip-through-the-prints opening. Also skips it for reduced-motion users, and makes a reload
 * start at the top where the intro choreography expects the grid to be.
 */
export const INTRO_BOOT_SCRIPT = `try{history.scrollRestoration="manual";var p=location.pathname,d=document.documentElement;var r=matchMedia("(prefers-reduced-motion: reduce)").matches;if(/^\\/portfolio\\/[^/]+/.test(p)){d.dataset.gallery="";if(!r)d.dataset.galleryFlip=""}if((p!=="/"&&p!=="/portfolio")||r)d.dataset.intro="done"}catch(e){document.documentElement.dataset.intro="done"}`;

export const INTRO_NOSCRIPT_STYLE =
  ".intro-overlay{display:none}[data-intro-logo],[data-intro-letter],[data-intro-rise],[data-intro-from],[data-footer-letter],[data-inquire-line]{transform:none!important;animation:none!important}[data-gallery-cover],[data-gallery-cover]>*,[data-gallery-edge],[data-gallery-line],[data-gallery-fade],[data-gallery-photo],[data-gallery-reveal],[data-gallery-reveal]>img{clip-path:none!important;transform:none!important;scale:none!important;opacity:1!important}";
