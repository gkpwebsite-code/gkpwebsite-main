/**
 * Runs before paint so reduced-motion users never see the intro, so a reload always starts at
 * the top where the intro choreography expects the grid to be, and so a couple gallery opens
 * with the name already heading for top centre.
 */
export const INTRO_BOOT_SCRIPT = `try{history.scrollRestoration="manual";if(/^\\/portfolio\\/[^/]+/.test(location.pathname))document.documentElement.dataset.gallery="";if(matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.intro="done"}catch(e){document.documentElement.dataset.intro="done"}`;

export const INTRO_NOSCRIPT_STYLE =
  ".intro-overlay{display:none}[data-intro-logo],[data-intro-letter],[data-intro-rise],[data-intro-from],[data-footer-letter]{transform:none!important;animation:none!important}[data-gallery-cover],[data-gallery-cover]>*,[data-gallery-edge],[data-gallery-line],[data-gallery-fade],[data-gallery-photo],[data-gallery-reveal],[data-gallery-reveal]>img{clip-path:none!important;transform:none!important;scale:none!important;opacity:1!important}";
